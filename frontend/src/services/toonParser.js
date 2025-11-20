/**
 * TOON Format Parser
 * Parses Token-Oriented Object Notation (TOON) format into JSON
 * Specification: https://toonformat.dev
 */

export class ToonParser {
  constructor(toonText) {
    this.lines = toonText.split('\n');
    this.currentLine = 0;
    this.indentSize = 2; // Default indent size
  }

  parse() {
    const result = {};
    this.parseObject(result, 0);
    return result;
  }

  parseObject(obj, baseIndent) {
    while (this.currentLine < this.lines.length) {
      const line = this.lines[this.currentLine];
      const indent = this.getIndent(line);
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        this.currentLine++;
        continue;
      }

      if (indent < baseIndent) {
        break;
      }

      if (indent > baseIndent) {
        this.currentLine++;
        continue;
      }

      // Handle array headers with tabular format
      if (trimmed.match(/^[\w_]+\[\d+\](\{[\w,]+\})?:/)) {
        this.parseArray(obj, baseIndent);
      }
      // Handle list items
      else if (trimmed.startsWith('- ')) {
        break; // Let parseArray handle this
      }
      // Handle key-value pairs
      else if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();

        if (!value || value === '') {
          // Nested object
          obj[key.trim()] = {};
          this.currentLine++;
          this.parseObject(obj[key.trim()], indent + this.indentSize);
        } else {
          // Simple value
          obj[key.trim()] = this.parseValue(value);
          this.currentLine++;
        }
      } else {
        this.currentLine++;
      }
    }
  }

  parseArray(obj, baseIndent) {
    const line = this.lines[this.currentLine].trim();
    const match = line.match(/^([\w_]+)\[(\d+)\](\{([\w,]+)\})?:/);

    if (!match) {
      this.currentLine++;
      return;
    }

    const [, key, length, , fields] = match;
    const arrayLength = parseInt(length);

    this.currentLine++;

    // Check if it's a tabular array
    if (fields) {
      obj[key] = this.parseTabularArray(fields.split(','), arrayLength, baseIndent);
    } else {
      // Check next line to determine array type
      const nextLine = this.lines[this.currentLine];
      if (nextLine && nextLine.trim().startsWith('- ')) {
        // Object array with list format
        obj[key] = this.parseListArray(arrayLength, baseIndent);
      } else {
        // Inline array
        obj[key] = this.parseInlineArray(nextLine);
      }
    }
  }

  parseTabularArray(fields, length, baseIndent) {
    const array = [];

    for (let i = 0; i < length && this.currentLine < this.lines.length; i++) {
      const line = this.lines[this.currentLine];
      const indent = this.getIndent(line);

      if (indent <= baseIndent) {
        break;
      }

      const values = this.parseCSVLine(line.trim());
      const obj = {};

      fields.forEach((field, index) => {
        if (index < values.length) {
          obj[field.trim()] = this.parseValue(values[index]);
        }
      });

      array.push(obj);
      this.currentLine++;
    }

    return array;
  }

  parseListArray(length, baseIndent) {
    const array = [];

    while (array.length < length && this.currentLine < this.lines.length) {
      const line = this.lines[this.currentLine];
      const indent = this.getIndent(line);
      const trimmed = line.trim();

      if (!trimmed.startsWith('- ')) {
        break;
      }

      const obj = {};
      this.currentLine++;
      this.parseObject(obj, indent + this.indentSize);
      array.push(obj);
    }

    return array;
  }

  parseInlineArray(line) {
    if (!line) return [];
    const values = this.parseCSVLine(line.trim());
    this.currentLine++;
    return values.map(v => this.parseValue(v));
  }

  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    if (current) {
      values.push(current.trim());
    }

    return values;
  }

  parseValue(value) {
    const trimmed = value.trim();

    // Remove quotes
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
    }

    // Boolean
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;

    // Null
    if (trimmed === 'null') return null;

    // Number
    if (!isNaN(trimmed) && trimmed !== '') {
      return parseFloat(trimmed);
    }

    return trimmed;
  }

  getIndent(line) {
    let indent = 0;
    for (let char of line) {
      if (char === ' ') indent++;
      else break;
    }
    return indent;
  }
}

// Export for use
export function parseToon(toonText) {
  const parser = new ToonParser(toonText);
  return parser.parse();
}

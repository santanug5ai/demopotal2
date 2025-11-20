const fs = require('fs');
const path = require('path');

class ToonParser {
  constructor(toonText) {
    this.lines = toonText.split('\n');
    this.currentLine = 0;
    this.indentSize = 2;
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

      if (trimmed.match(/^[\w_]+\[\d+\](\{[\w,]+\})?:/)) {
        this.parseArray(obj, baseIndent);
      } else if (trimmed.startsWith('- ')) {
        break;
      } else if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();

        if (!value || value === '') {
          obj[key.trim()] = {};
          this.currentLine++;
          this.parseObject(obj[key.trim()], indent + this.indentSize);
        } else {
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

    if (fields) {
      obj[key] = this.parseTabularArray(fields.split(','), arrayLength, baseIndent);
    } else {
      const nextLine = this.lines[this.currentLine];
      if (nextLine && nextLine.trim().startsWith('- ')) {
        obj[key] = this.parseListArray(arrayLength, baseIndent);
      } else {
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

    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
    }

    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null') return null;

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

// Read and parse
const toonPath = path.join(__dirname, '../data/catalog.toon');
const outputPath = path.join(__dirname, '../frontend/src/data/catalog.json');

const toonText = fs.readFileSync(toonPath, 'utf-8');
const parser = new ToonParser(toonText);
const catalogData = parser.parse();

fs.writeFileSync(outputPath, JSON.stringify(catalogData, null, 2));
console.log(`✓ Parsed catalog.toon to catalog.json`);
console.log(`✓ Total products: ${catalogData.products.length}`);
console.log(`✓ Categories: ${catalogData.categories.length}`);

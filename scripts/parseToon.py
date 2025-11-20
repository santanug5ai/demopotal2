#!/usr/bin/env python3
import json
import re

def parse_toon(toon_text):
    lines = toon_text.split('\n')
    result = {}
    idx = [0]  # Use list to make it mutable in nested functions

    def parse_value(value):
        value = value.strip()
        if value.startswith('"') and value.endswith('"'):
            return value[1:-1]
        if value == 'true':
            return True
        if value == 'false':
            return False
        if value == 'null':
            return None
        try:
            if '.' in value:
                return float(value)
            return int(value)
        except:
            return value

    def get_indent(line):
        count = 0
        for char in line:
            if char == ' ':
                count += 1
            else:
                break
        return count

    def parse_csv_line(line):
        # Simple CSV parser
        values = []
        current = ''
        in_quotes = False

        for char in line:
            if char == '"':
                in_quotes = not in_quotes
            elif char == ',' and not in_quotes:
                values.append(current.strip())
                current = ''
            else:
                current += char

        if current.strip():
            values.append(current.strip())

        return values

    def parse_object(base_indent):
        obj = {}

        while idx[0] < len(lines):
            line = lines[idx[0]]
            indent = get_indent(line)
            trimmed = line.strip()

            if not trimmed or trimmed.startswith('#'):
                idx[0] += 1
                continue

            if indent < base_indent:
                break

            if indent > base_indent:
                idx[0] += 1
                continue

            # Check for array
            array_match = re.match(r'^([\w_]+)\[(\d+)\](\{([\w,]+)\})?:', trimmed)
            if array_match:
                key = array_match.group(1)
                length = int(array_match.group(2))
                fields = array_match.group(4)

                idx[0] += 1

                if fields:
                    # Tabular array
                    arr = []
                    field_names = [f.strip() for f in fields.split(',')]

                    for _ in range(length):
                        if idx[0] >= len(lines):
                            break

                        line = lines[idx[0]]
                        if get_indent(line) <= base_indent:
                            break

                        values = parse_csv_line(line.strip())
                        item = {}
                        for i, field in enumerate(field_names):
                            if i < len(values):
                                item[field] = parse_value(values[i])

                        arr.append(item)
                        idx[0] += 1

                    obj[key] = arr
                else:
                    # List array
                    arr = []

                    for _ in range(length):
                        if idx[0] >= len(lines):
                            break

                        line = lines[idx[0]]
                        if not line.strip().startswith('- '):
                            break

                        idx[0] += 1
                        arr.append(parse_object(get_indent(line) + 2))

                    obj[key] = arr

            elif trimmed.startswith('- '):
                break

            elif ':' in trimmed:
                key, *value_parts = trimmed.split(':', 1)
                value = value_parts[0] if value_parts else ''
                value = value.strip()

                if not value:
                    idx[0] += 1
                    obj[key.strip()] = parse_object(indent + 2)
                else:
                    obj[key.strip()] = parse_value(value)
                    idx[0] += 1
            else:
                idx[0] += 1

        return obj

    result = parse_object(0)
    return result

# Read TOON file
with open('/home/user/demopotal2/data/catalog.toon', 'r') as f:
    toon_text = f.read()

# Parse
catalog = parse_toon(toon_text)

# Write JSON
with open('/home/user/demopotal2/frontend/src/data/catalog.json', 'w') as f:
    json.dump(catalog, f, indent=2)

print(f"✓ Parsed catalog.toon to catalog.json")
print(f"✓ Total products: {len(catalog.get('products', []))}")
print(f"✓ Categories: {len(catalog.get('categories', []))}")

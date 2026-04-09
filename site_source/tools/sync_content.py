from pathlib import Path
import json
import re
import zipfile
import xml.etree.ElementTree as ET

BASE = Path(__file__).resolve().parents[1]
XLSX = BASE / 'data' / 'content.xlsx'
JS = BASE / 'data' / 'content.js'
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def cell_col(ref):
    letters = ''.join(ch for ch in ref if ch.isalpha())
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch.upper()) - 64)
    return n - 1


def load_shared_strings(z):
    if 'xl/sharedStrings.xml' not in z.namelist():
        return []
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    out = []
    for si in root.findall('m:si', NS):
        texts = []
        for t in si.findall('.//m:t', NS):
            texts.append(t.text or '')
        out.append(''.join(texts))
    return out


def read_cell(cell, shared):
    t = cell.attrib.get('t')
    if t == 'inlineStr':
        node = cell.find('m:is/m:t', NS)
        return node.text if node is not None and node.text is not None else ''
    v = cell.find('m:v', NS)
    if v is None or v.text is None:
        return ''
    if t == 's':
        return shared[int(v.text)]
    return v.text


def read_xlsx(path):
    with zipfile.ZipFile(path) as z:
        shared = load_shared_strings(z)
        sheet_name = 'xl/worksheets/sheet1.xml'
        root = ET.fromstring(z.read(sheet_name))
        rows = []
        for row in root.findall('.//m:sheetData/m:row', NS):
            values = []
            for cell in row.findall('m:c', NS):
                idx = cell_col(cell.attrib.get('r', 'A1'))
                while len(values) <= idx:
                    values.append('')
                values[idx] = read_cell(cell, shared)
            rows.append(values)
    if not rows:
        return []
    header = rows[0]
    required = ['key', 'zh', 'en', 'de']
    for col in required:
        if col not in header:
            raise SystemExit(f'Missing column: {col}')
    idx = {col: header.index(col) for col in required}
    records = []
    for row in rows[1:]:
        if not row or len(row) <= idx['key'] or not row[idx['key']].strip():
            continue
        records.append({col: row[idx[col]] if len(row) > idx[col] else '' for col in required})
    return records


def main():
    records = read_xlsx(XLSX)
    data = {r['key']: {'zh': r['zh'], 'en': r['en'], 'de': r['de']} for r in records}
    JS.write_text('window.SITE_CONTENT = ' + json.dumps(data, ensure_ascii=True, indent=2) + ';\n', encoding='utf-8')
    print(f'Generated {JS} from {XLSX} ({len(records)} rows).')


if __name__ == '__main__':
    main()

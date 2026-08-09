import sys
import json
import zipfile
from xmindparser import xmind_to_dict, config, apply_config

# Enable relationship and ID parsing
config['showRelationship'] = True
config['showTopicId'] = True
apply_config()

if len(sys.argv) < 2:
    print("Usage: python parse_xmind.py <path_to_xmind_file>")
    sys.exit(1)

file_path = sys.argv[1]
print(f"Parsing {file_path}...")

def build_id_map_raw(obj, id_map):
    if isinstance(obj, dict):
        if 'id' in obj and 'title' in obj:
            id_map[obj['id']] = obj['title']
        for k, v in obj.items():
            build_id_map_raw(v, id_map)
    elif isinstance(obj, list):
        for item in obj:
            build_id_map_raw(item, id_map)

try:
    data = xmind_to_dict(file_path)
    
    # Build a complete id_map from the raw content.json inside the zip
    id_map = {}
    with zipfile.ZipFile(file_path) as z:
        if 'content.json' in z.namelist():
            raw_data = json.loads(z.read('content.json'))
            build_id_map_raw(raw_data, id_map)

    # Augment relationships with titles
    for sheet in data:
        if 'relationships' in sheet:
            for rel in sheet['relationships']:
                if 'end1Id' in rel and rel['end1Id'] in id_map:
                    rel['end1Title'] = id_map[rel['end1Id']]
                if 'end2Id' in rel and rel['end2Id'] in id_map:
                    rel['end2Title'] = id_map[rel['end2Id']]

    out_path = file_path + '.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully parsed and saved to {out_path}")
except Exception as e:
    print(f"Error parsing file: {e}")

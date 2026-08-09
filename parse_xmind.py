import sys
import json
import zipfile

def extract_node(node):
    result = {
        'id': node.get('id', ''),
        'title': node.get('title', '')
    }
    
    # Extract notes
    if 'notes' in node and 'plain' in node['notes'] and 'content' in node['notes']['plain']:
        result['notes'] = node['notes']['plain']['content']
        
    # Extract labels
    if 'labels' in node:
        result['labels'] = node['labels']
        
    # Extract new fields based on user spec
    if 'markers' in node:
        result['markers'] = [m.get("markerId") for m in node.get("markers", [])]
        
    if 'image' in node and 'src' in node['image']:
        result['image'] = node['image']['src']
        
    if 'href' in node:
        result['link'] = node['href']
        
    if 'summaries' in node:
        result['summaries'] = node['summaries']

    # Extract children
    topics = []
    if 'children' in node:
        children = node['children']
        if 'attached' in children:
            for child in children['attached']:
                topics.append(extract_node(child))
                
    if topics:
        result['topics'] = topics
        
    return result

# --- XML Parser for XMind 8 (Legacy) ---
def strip_ns(tag):
    if '}' in tag:
        return tag.split('}', 1)[1]
    return tag

def parse_xml_node(node):
    result = {
        'id': node.attrib.get('id', ''),
        'title': ''
    }
    
    topics = []
    labels = []
    notes_content = ""
    
    for child in node:
        tag = strip_ns(child.tag)
        if tag == 'title':
            result['title'] = child.text or ''
        elif tag == 'labels':
            for label in child:
                if strip_ns(label.tag) == 'label':
                    labels.append(label.text)
        elif tag == 'notes':
            for note in child:
                if strip_ns(note.tag) == 'plain':
                    notes_content = note.text or ''
        elif tag == 'children':
            for topics_el in child:
                if strip_ns(topics_el.tag) == 'topics':
                    for topic in topics_el:
                        if strip_ns(topic.tag) == 'topic':
                            topics.append(parse_xml_node(topic))
                            
    if labels:
        result['labels'] = labels
    if notes_content:
        result['notes'] = notes_content
    if topics:
        result['topics'] = topics
        
    return result

def parse_xml_content(xml_string):
    import xml.etree.ElementTree as ET
    root = ET.fromstring(xml_string)
    sheets = []
    
    id_map = {}
    def build_id_map(node):
        if 'id' in node and 'title' in node:
            id_map[node['id']] = node['title']
        for t in node.get('topics', []):
            build_id_map(t)
            
    for sheet_node in root:
        if strip_ns(sheet_node.tag) != 'sheet':
            continue
            
        sheet_out = {
            'title': "Sheet",
            'topic': {},
            'floating_topics': [],
            'relationships': []
        }
        
        for child in sheet_node:
            tag = strip_ns(child.tag)
            if tag == 'title':
                sheet_out['title'] = child.text or 'Sheet'
            elif tag == 'topic':
                parsed_topic = parse_xml_node(child)
                if not sheet_out['topic']:
                    sheet_out['topic'] = parsed_topic
                else:
                    sheet_out['floating_topics'].append(parsed_topic)
            elif tag == 'relationships':
                for rel in child:
                    if strip_ns(rel.tag) == 'relationship':
                        title_text = ''
                        for rchild in rel:
                            if strip_ns(rchild.tag) == 'title':
                                title_text = rchild.text or ''
                                break
                        r = {
                            'id': rel.attrib.get('id', ''),
                            'end1Id': rel.attrib.get('end1', ''),
                            'end2Id': rel.attrib.get('end2', ''),
                            'title': title_text
                        }
                        sheet_out['relationships'].append(r)
                        
        build_id_map(sheet_out['topic'])
        for f in sheet_out['floating_topics']:
            build_id_map(f)
            
        for r in sheet_out['relationships']:
            r['end1Title'] = id_map.get(r['end1Id'], '')
            r['end2Title'] = id_map.get(r['end2Id'], '')
            
        sheets.append(sheet_out)
        
    return sheets

def parse_xmind(file_path):
    import os
    print(f"Parsing {file_path}...")
    
    with zipfile.ZipFile(file_path) as z:
        # Automatically extract resources if any exist
        resource_dir = file_path + "_resources"
        extracted_any_resource = False
        for name in z.namelist():
            if name.startswith("resources/"):
                z.extract(name, resource_dir)
                extracted_any_resource = True
        
        if extracted_any_resource:
            print(f"Extracted binary resources to {resource_dir}")
            
        if 'content.json' in z.namelist():
            raw_data = json.loads(z.read('content.json'))
            
            # --- JSON Processing (XMind ZEN) ---
            output_sheets = []
            id_map = {}
            def build_id_map(obj):
                if isinstance(obj, dict):
                    if 'id' in obj and 'title' in obj:
                        id_map[obj['id']] = obj['title']
                    for k, v in obj.items():
                        build_id_map(v)
                elif isinstance(obj, list):
                    for item in obj:
                        build_id_map(item)
                        
            build_id_map(raw_data)
            
            for sheet in raw_data:
                sheet_out = {
                    'title': sheet.get('title', 'Sheet'),
                    'topic': extract_node(sheet.get('rootTopic', {}))
                }
                
                floating_topics = []
                root_children = sheet.get('rootTopic', {}).get('children', {})
                if 'detached' in root_children:
                    for detached in root_children['detached']:
                        floating_topics.append(extract_node(detached))
                if floating_topics:
                    sheet_out['floating_topics'] = floating_topics
                    
                if 'relationships' in sheet:
                    rels = []
                    for rel in sheet['relationships']:
                        title = rel.get('title', '')
                        r = {
                            'id': rel.get('id', ''),
                            'end1Id': rel.get('end1Id', ''),
                            'end2Id': rel.get('end2Id', ''),
                            'end1Title': id_map.get(rel.get('end1Id', ''), ''),
                            'end2Title': id_map.get(rel.get('end2Id', ''), ''),
                            'title': title
                        }
                        rels.append(r)
                    sheet_out['relationships'] = rels
                    
                output_sheets.append(sheet_out)
        
        elif 'content.xml' in z.namelist():
            # --- XML Processing (XMind 8 / Legacy) ---
            xml_data = z.read('content.xml').decode('utf-8')
            output_sheets = parse_xml_content(xml_data)
        
        else:
            raise Exception("Neither content.json nor content.xml found in the .xmind file.")
        
    out_path = file_path + '.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output_sheets, f, ensure_ascii=False, indent=2)
    print(f"Successfully parsed and saved to {out_path}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("No file provided. Launching GUI...")
        import subprocess
        import os
        gui_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'xmind_gui.py')
        subprocess.run(["python3", gui_path])
        sys.exit(0)
        
    try:
        parse_xmind(sys.argv[1])
    except Exception as e:
        print(f"Error parsing file: {e}")

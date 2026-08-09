import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import json
import subprocess
import os
import webbrowser
import tempfile

class XmindExplorerGUI(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("XMind Parser & Explorer")
        self.geometry("1100x700")
        
        self.data = None
        self.node_map = {}
        
        self.setup_ui()

    def setup_ui(self):
        # Toolbar
        toolbar = tk.Frame(self, bd=1, relief=tk.RAISED)
        toolbar.pack(side=tk.TOP, fill=tk.X)
        
        tk.Button(toolbar, text="Open .xmind File", command=self.open_file).pack(side=tk.LEFT, padx=5, pady=5)
        tk.Button(toolbar, text="Reconstruct Diagram (Browser)", command=self.render_diagram).pack(side=tk.LEFT, padx=5, pady=5)
        self.lbl_file = tk.Label(toolbar, text="No file selected", fg="gray")
        self.lbl_file.pack(side=tk.LEFT, padx=5)

        # Main PanedWindow
        self.paned = ttk.PanedWindow(self, orient=tk.HORIZONTAL)
        self.paned.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Left Panel (Tree)
        self.tree_frame = ttk.Frame(self.paned)
        self.paned.add(self.tree_frame, weight=1)
        
        ttk.Label(self.tree_frame, text="Topics (Main & Floating)", font=("Arial", 10, "bold")).pack(anchor=tk.W, pady=(0, 5))
        
        tree_scroll = ttk.Scrollbar(self.tree_frame)
        tree_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.tree = ttk.Treeview(self.tree_frame, yscrollcommand=tree_scroll.set)
        self.tree.pack(fill=tk.BOTH, expand=True)
        tree_scroll.config(command=self.tree.yview)
        self.tree.bind('<<TreeviewSelect>>', self.on_tree_select)
        
        # Right Panel (Relationships & Details)
        self.right_frame = ttk.Frame(self.paned)
        self.paned.add(self.right_frame, weight=2)
        
        # Details Text
        ttk.Label(self.right_frame, text="Node Details (Notes & Labels)", font=("Arial", 10, "bold")).pack(anchor=tk.W, pady=(0, 5))
        self.txt_details = tk.Text(self.right_frame, height=12, wrap=tk.WORD, font=("Consolas", 10))
        self.txt_details.pack(fill=tk.X, pady=(0, 15))
        
        # Relationships Tree (Decision Tree)
        ttk.Label(self.right_frame, text="Relationships (Decision Tree)", font=("Arial", 10, "bold")).pack(anchor=tk.W, pady=(0, 5))
        
        rel_scroll = ttk.Scrollbar(self.right_frame)
        rel_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.rel_tree = ttk.Treeview(self.right_frame, yscrollcommand=rel_scroll.set)
        self.rel_tree.pack(fill=tk.BOTH, expand=True)
        rel_scroll.config(command=self.rel_tree.yview)
        
        # Also bind selection to show details
        self.rel_tree.bind('<<TreeviewSelect>>', self.on_tree_select)

    def open_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("XMind Files", "*.xmind")])
        if not file_path:
            return
            
        self.lbl_file.config(text=file_path, fg="black")
        self.process_xmind(file_path)

    def process_xmind(self, file_path):
        self.txt_details.delete("1.0", tk.END)
        self.txt_details.insert(tk.END, "Parsing XMind file, please wait...\n")
        self.update()
        
        try:
            # Execute parse_xmind.py
            subprocess.run(["python3", "parse_xmind.py", file_path], check=True, cwd=os.path.dirname(os.path.abspath(__file__)))
            
            json_path = file_path + ".json"
            if os.path.exists(json_path):
                with open(json_path, 'r', encoding='utf-8') as f:
                    self.data = json.load(f)
                
                self.populate_tree()
                self.populate_relationships()
                self.txt_details.delete("1.0", tk.END)
                self.txt_details.insert(tk.END, "Parse successful. Select a node in the tree to view details.")
            else:
                raise Exception("JSON output file not found.")
                
        except Exception as e:
            messagebox.showerror("Parse Error", f"Failed to parse XMind file:\n{e}")

    def render_diagram(self):
        if not self.data:
            messagebox.showwarning("Warning", "No parsed data available to render.")
            return
            
        import json
        nodes = []
        edges = []
        node_ids = set()
        
        def add_node(n_id, label, hover_title=""):
            if n_id not in node_ids:
                nodes.append({"id": n_id, "label": label, "title": hover_title})
                node_ids.add(n_id)

        for sheet in self.data:
            def traverse(node):
                node_id = node.get('id', '')
                if not node_id: return
                
                title = node.get('title', 'Unnamed')
                
                hover_text = []
                if node.get('labels'):
                    hover_text.append("Labels: " + ", ".join(node['labels']))
                if node.get('notes'):
                    hover_text.append("Notes:\\n" + node['notes'])
                    
                add_node(node_id, title, "\\n\\n".join(hover_text) if hover_text else title)
                
                for child in node.get('topics', []):
                    child_id = child.get('id', '')
                    if child_id:
                        edges.append({"from": node_id, "to": child_id})
                        traverse(child)
                        
            if sheet.get('topic'):
                traverse(sheet['topic'])
                
            for f_topic in sheet.get('floating_topics', []):
                traverse(f_topic)
                
            for rel in sheet.get('relationships', []):
                src = rel.get('end1Id', '')
                tgt = rel.get('end2Id', '')
                if not src or not tgt: continue
                
                title = rel.get('title', '')
                edge_data = {"from": src, "to": tgt, "dashes": True}
                if title:
                    edge_data["label"] = title
                edges.append(edge_data)

        nodes_json = json.dumps(nodes)
        edges_json = json.dumps(edges)

        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>XMind Diagram Reconstruction</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style>
        body, html {{ height: 100%; margin: 0; padding: 0; font-family: sans-serif; }}
        #mynetwork {{ width: 100%; height: 100%; border: none; background: #f4f4f9; }}
    </style>
</head>
<body>
    <div id="mynetwork"></div>
    <script type="text/javascript">
        var nodes = new vis.DataSet({nodes_json});
        var edges = new vis.DataSet({edges_json});
        var container = document.getElementById('mynetwork');
        var data = {{ nodes: nodes, edges: edges }};
        var options = {{
            layout: {{
                hierarchical: {{
                    direction: "LR",
                    sortMethod: "directed",
                    levelSeparation: 300,
                    nodeSpacing: 150,
                    treeSpacing: 250,
                    blockShifting: true,
                    edgeMinimization: true,
                    parentCentralization: true
                }}
            }},
            physics: {{
                enabled: true,
                hierarchicalRepulsion: {{
                    nodeDistance: 150,
                    springLength: 150
                }},
                solver: 'hierarchicalRepulsion',
                stabilization: {{
                    iterations: 150
                }}
            }},
            nodes: {{
                shape: 'box',
                margin: 10,
                color: {{ background: '#ffffff', border: '#2B7CE9' }},
                font: {{ size: 14 }}
            }},
            edges: {{
                arrows: 'to',
                smooth: false,
                font: {{ align: 'middle' }}
            }},
            interaction: {{
                hover: true,
                navigationButtons: true,
                keyboard: true,
                tooltipDelay: 200
            }}
        }};
        var network = new vis.Network(container, data, options);
    </script>
</body>
</html>"""

        fd, path = tempfile.mkstemp(suffix=".html")
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write(html_content)
            
        import subprocess
        import sys
        
        script = f"""
import webview
webview.create_window('XMind Diagram - Interactive View', r'file://{path}', width=1024, height=768)
webview.start()
"""
        # Run pywebview in a separate process so it doesn't block or crash the Tkinter mainloop
        subprocess.Popen([sys.executable, '-c', script])

    def populate_tree(self):
        self.tree.delete(*self.tree.get_children())
        self.node_map = {}
        
        for sheet_idx, sheet in enumerate(self.data):
            sheet_title = sheet.get('title', f'Sheet {sheet_idx+1}')
            sheet_node = self.tree.insert("", tk.END, text=f"📊 {sheet_title}", open=True)
            
            # Root Topic
            root = sheet.get('topic', {})
            if root:
                self.insert_topic(root, sheet_node)
                
            # Floating Topics
            floating = sheet.get('floating_topics', [])
            if floating:
                float_root = self.tree.insert(sheet_node, tk.END, text="☁️ [Floating Topics]", open=True)
                for f_topic in floating:
                    self.insert_topic(f_topic, float_root)

    def insert_topic(self, topic, parent_id):
        node_id = topic.get('id', '')
        title = topic.get('title', 'Untitled').replace('\n', ' ')
        
        self.node_map[node_id] = topic
        
        item_id = self.tree.insert(parent_id, tk.END, text=title, values=(node_id,))
        
        for child in topic.get('topics', []):
            self.insert_topic(child, item_id)

    def on_tree_select(self, event):
        selection = self.tree.selection()
        if not selection:
            return
            
        item_id = selection[0]
        values = self.tree.item(item_id, 'values')
        if not values:
            # Selected a root/sheet or group node
            return
            
        node_id = values[0]
        topic = self.node_map.get(node_id, {})
        
        self.txt_details.delete("1.0", tk.END)
        self.txt_details.insert(tk.END, f"ID:    {topic.get('id', '')}\n")
        self.txt_details.insert(tk.END, f"Title: {topic.get('title', '')}\n")
        
        if 'labels' in topic and topic['labels']:
            self.txt_details.insert(tk.END, f"\n🏷️ Labels: {', '.join(topic['labels'])}\n")
            
        if 'notes' in topic and topic['notes']:
            self.txt_details.insert(tk.END, f"\n📝 Notes:\n{topic['notes']}\n")
            
    def populate_relationships(self):
        self.rel_tree.delete(*self.rel_tree.get_children())
        for sheet_idx, sheet in enumerate(self.data):
            rels = sheet.get('relationships', [])
            if not rels:
                continue
                
            # Build directed graph from relationships
            graph = {}
            in_degree = {}
            nodes_info = {}
            
            for rel in rels:
                src_id = rel.get('end1Id', '')
                tgt_id = rel.get('end2Id', '')
                src_title = rel.get('end1Title', src_id).replace('\n', ' ')
                tgt_title = rel.get('end2Title', tgt_id).replace('\n', ' ')
                edge_title = rel.get('title', '')
                
                nodes_info[src_id] = src_title
                nodes_info[tgt_id] = tgt_title
                
                if src_id not in graph: graph[src_id] = []
                if tgt_id not in graph: graph[tgt_id] = []
                if src_id not in in_degree: in_degree[src_id] = 0
                if tgt_id not in in_degree: in_degree[tgt_id] = 0
                
                graph[src_id].append((tgt_id, edge_title))
                in_degree[tgt_id] += 1
                
            # Roots are nodes with 0 incoming edges
            roots = [n for n, deg in in_degree.items() if deg == 0]
            if not roots and in_degree:
                roots = [list(in_degree.keys())[0]] # fallback for cycles
                
            sheet_title = sheet.get('title', f'Sheet {sheet_idx+1}')
            sheet_node = self.rel_tree.insert("", tk.END, text=f"🔗 {sheet_title} Flow", open=True)
            
            # Recursive function to build tree UI
            def insert_rel_node(node_id, parent_item, link_label, path):
                if node_id in path:
                    text = f"🔄 [Cycle back to] {nodes_info.get(node_id, node_id)}"
                    if link_label: text = f"[{link_label}] " + text
                    self.rel_tree.insert(parent_item, tk.END, text=text)
                    return
                    
                path.add(node_id)
                text = nodes_info.get(node_id, node_id)
                if link_label: text = f"[{link_label}] " + text
                
                # Insert and store node_id in values to allow details linking
                current_item = self.rel_tree.insert(parent_item, tk.END, text=text, open=True, values=(node_id,))
                
                for child_id, edge_desc in graph.get(node_id, []):
                    insert_rel_node(child_id, current_item, edge_desc, path.copy())
                    
            for root_id in roots:
                insert_rel_node(root_id, sheet_node, "", set())

if __name__ == "__main__":
    app = XmindExplorerGUI()
    app.mainloop()

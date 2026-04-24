import os

# 1. Define the specific relative paths to exclude
PATHS_TO_EXCLUDE = [
    "backend/runs",
    "my-ai-portfolio/.next",
    "my-ai-portfolio/node_modules",
    "g.py"  # Note: If this is active, the entire folder is hidden.
]

# 2. Define general folder/file names to exclude anywhere in the project
NAMES_TO_EXCLUDE = {
    ".git", 
    "__pycache__", 
    ".DS_Store", 
    "venv", 
    "env"
}

def normalize_path(path):
    """Normalize paths to use forward slashes for cross-platform matching."""
    return os.path.normpath(path).replace('\\', '/')

def generate_tree(dir_path, prefix="", is_last=True, root_path=None):
    if root_path is None:
        root_path = dir_path

    # Check if the current directory is in the exact paths to exclude
    rel_path = normalize_path(os.path.relpath(dir_path, root_path))
    if rel_path in PATHS_TO_EXCLUDE:
        return ""

    tree_str = ""
    
    if rel_path == ".":
        tree_str += f"📁 {os.path.basename(os.path.abspath(dir_path))}/\n"
    else:
        connector = "└── " if is_last else "├── "
        tree_str += f"{prefix}{connector}📁 {os.path.basename(dir_path)}/\n"
        prefix += "    " if is_last else "│   "

    try:
        items = os.listdir(dir_path)
    except PermissionError:
        return tree_str

    # Filter out excluded items
    filtered_items = []
    for item in items:
        item_path = os.path.join(dir_path, item)
        item_rel_path = normalize_path(os.path.relpath(item_path, root_path))
        
        # Skip if the file/folder name is in the general exclusion list
        if item in NAMES_TO_EXCLUDE:
            continue
            
        # Skip if the relative path matches the specific exclusion list
        if item_rel_path in PATHS_TO_EXCLUDE:
            continue
            
        filtered_items.append(item)

    # Sort items: directories first, then files alphabetically
    filtered_items.sort(key=lambda x: (not os.path.isdir(os.path.join(dir_path, x)), x.lower()))

    for i, item in enumerate(filtered_items):
        item_path = os.path.join(dir_path, item)
        is_last_item = (i == len(filtered_items) - 1)
        
        if os.path.isdir(item_path):
            tree_str += generate_tree(item_path, prefix, is_last_item, root_path)
        else:
            connector = "└── " if is_last_item else "├── "
            tree_str += f"{prefix}{connector}📄 {item}\n"

    return tree_str

if __name__ == "__main__":
    # Get the directory where the script is currently located
    current_dir = os.getcwd()
    
    print("Generating project tree...")
    tree_output = generate_tree(current_dir)
    
    # Save the output to a text file
    output_filename = "project_tree.txt"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(tree_output)
        
    print(f"✅ Success! Folder tree saved to '{output_filename}'.")
    print("-" * 40)
    print(tree_output)

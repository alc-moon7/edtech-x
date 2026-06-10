import os
import json
import re

def slugify_key(name):
    # Same as JS: remove parens, replace & with and, lower case, trim
    name = name.lower()
    name = re.sub(r'\([^)]*\)', '', name)
    name = name.replace('&', 'and')
    name = re.sub(r'\s+', ' ', name)
    return name.strip()

def generate_mapping(base_dir):
    mapping = {}
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.png'):
                rel_path = os.path.relpath(os.path.join(root, file), base_dir)
                parts = rel_path.split(os.sep)
                if len(parts) >= 3:
                    class_level = parts[0] # e.g. "Class 8"
                    version = parts[1] # e.g. "English Version"
                    subject_name = os.path.splitext(parts[2])[0] # e.g. "Mathematics" or "বিজ্ঞান"
                    
                    if class_level not in mapping:
                        mapping[class_level] = {}
                    
                    # Store by raw name and slugified name
                    key_raw = subject_name.strip().lower()
                    key_slug = slugify_key(subject_name)
                    
                    public_path = "/assets/book-covers-extracted/" + rel_path.replace(os.sep, "/")
                    
                    # Add both mappings to be safe
                    mapping[class_level][key_raw] = public_path
                    mapping[class_level][key_slug] = public_path

    # Write to a TS file
    ts_content = "export const BOOK_COVERS: Record<string, Record<string, string>> = " + json.dumps(mapping, indent=2, ensure_ascii=False) + ";\n"
    
    with open(r"c:\workspace\Personal\home-school\src\lib\bookCoversMap.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)

if __name__ == "__main__":
    generate_mapping(r"c:\workspace\Personal\home-school\public\assets\book-covers-extracted")
    print("Mapping generated!")

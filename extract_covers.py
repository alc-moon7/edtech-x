import os
import fitz  # PyMuPDF

def extract_covers(source_dir, target_dir):
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    for root, dirs, files in os.walk(source_dir):
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_path = os.path.join(root, file)
                
                # Determine relative path to recreate structure
                rel_path = os.path.relpath(root, source_dir)
                target_subdir = os.path.join(target_dir, rel_path)
                
                if not os.path.exists(target_subdir):
                    os.makedirs(target_subdir)
                
                png_name = os.path.splitext(file)[0] + '.png'
                target_path = os.path.join(target_subdir, png_name)
                
                try:
                    # Open PDF
                    doc = fitz.open(pdf_path)
                    if len(doc) > 0:
                        # Extract first page
                        page = doc.load_page(0)
                        # Render to image (scale up slightly for better quality)
                        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                        pix.save(target_path)
                        print(f"Extracted: {target_path}")
                    doc.close()
                except Exception as e:
                    print(f"Failed to extract {pdf_path}: {e}")

if __name__ == "__main__":
    source_dir = r"c:\workspace\Personal\home-school\public\assets\Study Materials"
    target_dir = r"c:\workspace\Personal\home-school\public\assets\book-covers-extracted"
    print("Starting extraction...")
    extract_covers(source_dir, target_dir)
    print("Done!")

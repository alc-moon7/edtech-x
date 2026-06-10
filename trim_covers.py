import os
from PIL import Image, ImageChops

def trim(im):
    # Convert image to RGB if not already
    if im.mode != 'RGB':
        im = im.convert('RGB')
    # Get background color from top-left pixel
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

def trim_covers(target_dir):
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.lower().endswith('.png'):
                img_path = os.path.join(root, file)
                try:
                    img = Image.open(img_path)
                    trimmed_img = trim(img)
                    if trimmed_img.size != img.size:
                        trimmed_img.save(img_path)
                        print(f"Trimmed: {img_path}")
                except Exception as e:
                    print(f"Failed to trim {img_path}: {e}")

if __name__ == "__main__":
    target_dir = r"c:\workspace\Personal\home-school\public\assets\book-covers-extracted"
    print("Starting trimming...")
    trim_covers(target_dir)
    print("Done!")

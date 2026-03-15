import os
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

def convert_heic_to_jpg(source_path, target_path):
    try:
        if not os.path.exists(source_path):
            print(f"Source not found: {source_path}")
            return
        
        image = Image.open(source_path)
        image = image.convert('RGB')
        image.save(target_path, "JPEG", quality=90)
        print(f"Converted {source_path} to {target_path}")
    except Exception as e:
        print(f"Error converting {source_path}: {e}")

# Home Gallery
convert_heic_to_jpg(
    r"c:\Users\akash\Desktop\enactus\enactus2\enactus\static\images\home\gallery\17.heic",
    r"c:\Users\akash\Desktop\enactus\enactus2\enactus\static\images\home\gallery\17.jpg"
)

# Project Vriksh Gallery
convert_heic_to_jpg(
    r"c:\Users\akash\Downloads\Enactus web-20260315T133449Z-3-001\Enactus web\Project page\Project Vriksh\Gallery\Small5.heic",
    r"c:\Users\akash\Desktop\enactus\enactus2\enactus\static\images\projects\Project Vriksh\Gallery\Small5.jpg"
)
convert_heic_to_jpg(
    r"c:\Users\akash\Downloads\Enactus web-20260315T133449Z-3-001\Enactus web\Project page\Project Vriksh\Gallery\Small6.heic",
    r"c:\Users\akash\Desktop\enactus\enactus2\enactus\static\images\projects\Project Vriksh\Gallery\Small6.jpg"
)


import sys
from PIL import Image
import os

def apply_logo(base_path, logo_path, output_path, scale=0.2, pos_x_percent=0.5, pos_y_percent=0.5):
    try:
        print(f"Processing {base_path}...")
        if not os.path.exists(base_path):
            print(f"Error: Base file not found: {base_path}")
            return
        if not os.path.exists(logo_path):
            print(f"Error: Logo file not found: {logo_path}")
            return

        base = Image.open(base_path).convert("RGBA")
        logo = Image.open(logo_path).convert("RGBA")

        # Resize logo
        base_width, base_height = base.size
        target_width = int(base_width * scale)
        aspect_ratio = logo.height / logo.width
        target_height = int(target_width * aspect_ratio)
        
        logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)

        # Calculate position (center of logo at percentage)
        x = int((base_width * pos_x_percent) - (target_width / 2))
        y = int((base_height * pos_y_percent) - (target_height / 2))

        # Create a new image for the composition
        comp = Image.new('RGBA', base.size)
        comp.paste(base, (0,0))
        
        # Paste logo with alpha (using logo itself as mask)
        comp.paste(logo, (x, y), logo)

        # Convert back to RGB for safety if png not needed, but keeping RGBA is good for now.
        # Actually save as PNG
        comp.save(output_path, "PNG")
        print(f"Saved to {output_path}")

    except Exception as e:
        print(f"Failed to process {base_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python apply_logo.py <base> <logo> <output> [scale] [pos_x] [pos_y]")
        sys.exit(1)

    base = sys.argv[1]
    logo = sys.argv[2]
    out = sys.argv[3]
    scale = float(sys.argv[4]) if len(sys.argv) > 4 else 0.2
    px = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
    py = float(sys.argv[6]) if len(sys.argv) > 6 else 0.5

    apply_logo(base, logo, out, scale, px, py)

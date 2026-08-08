from PIL import Image, ImageOps
import sys

def process(input_path, output_path, fill_color):
    img = Image.open(input_path).convert("RGBA")
    
    # Create grayscale version for alpha mask
    gray = img.convert("L")
    
    # Invert grayscale: dark lines become bright (high alpha), white paper becomes dark (low alpha)
    # We can also add a contrast boost to remove the paper texture entirely.
    # thresholding: anything lighter than 200 becomes 0, etc.
    # Let's use point evaluation
    def map_alpha(val):
        # val is grayscale 0-255. 
        # Paper is ~220-255. Lines are ~50-100.
        # We want paper (255) -> 0 alpha
        # We want lines (50) -> 255 alpha
        if val > 200:
            return 0
        else:
            # Map 0-200 to 255-0
            return int(255 * (1 - val/200.0))

    alpha = gray.point(map_alpha)
    
    # Create a solid color image for the logo
    color_img = Image.new("RGBA", img.size, fill_color)
    
    # Apply the calculated alpha mask
    color_img.putalpha(alpha)
    
    color_img.save(output_path, "PNG")

# For header (needs to be light/white to show on dark header)
process("public/logo-original.png", "public/logo.png", (255, 255, 255))

# For favicon (can be the original brand color, e.g. dark teal #0f4c5c)
# Let's use a nice teal color for the favicon: (15, 76, 92)
process("src/app/icon-base-original.png", "src/app/icon-base.png", (15, 76, 92))

print("Logos processed successfully!")

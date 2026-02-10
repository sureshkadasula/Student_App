#!/usr/bin/env python3
from PIL import Image, ImageChops
import os

def trim_white_background(img, border_percent=0):
    """
    Trim white background from image and add minimal border
    border_percent: percentage of image size to add as border (default 0%)
    """
    # Convert to RGB if needed
    if img.mode == 'RGBA':
        # Create a white background
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
        img = background
    
    # Convert to RGB to handle any mode
    img = img.convert('RGB')
    
    # Create a white background image
    bg = Image.new('RGB', img.size, (255, 255, 255))
    
    # Get the difference between the image and white background
    diff = ImageChops.difference(img, bg)
    
    # Get the bounding box of non-white areas
    bbox = diff.getbbox()
    
    if bbox:
        # Crop to the bounding box
        img = img.crop(bbox)
        
        # Add a small border (border_percent of the smaller dimension)
        border_size = int(min(img.size) * (border_percent / 100))
        
        # Create new image with border
        new_size = (img.width + 2 * border_size, img.height + 2 * border_size)
        new_img = Image.new('RGB', new_size, (255, 255, 255))
        new_img.paste(img, (border_size, border_size))
        img = new_img
    
    return img

def resize_to_cover(img, target_size):
    """
    Resize image to cover the entire target size (like CSS background-size: cover)
    This ensures no empty space - the image fills the entire square
    """
    target_width, target_height = target_size
    img_width, img_height = img.size
    
    # Calculate the scale factor to cover the entire area
    scale_width = target_width / img_width
    scale_height = target_height / img_height
    
    # Use the larger scale to ensure the image covers the entire area
    scale = max(scale_width, scale_height)
    
    # Calculate new size
    new_width = int(img_width * scale)
    new_height = int(img_height * scale)
    
    # Resize the image
    resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Crop from center to get exact target size
    left = (new_width - target_width) // 2
    top = (new_height - target_height) // 2
    right = left + target_width
    bottom = top + target_height
    
    return resized.crop((left, top, right, bottom))

# Define the icon sizes for different Android densities
# For adaptive icons, content at 68% with padding (not canvas size)
sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

# Source icon path
source_icon = 'src/assets/images/icon.jpeg'

# Open the source image
img = Image.open(source_icon)

# Trim white background with no border for maximum zoom
print('Cropping white background and generating adaptive icons...')
img = trim_white_background(img, border_percent=0)

# Convert to RGBA for PNG with transparency support
img = img.convert('RGBA')

# Generate FOREGROUND images with 68% content (32% padding for perfect display)
print('\nGenerating adaptive icon FOREGROUND layers (68% content with padding)...')
for folder, base_size in sizes.items():
    # Foreground canvas is full size, but content is only 68%
    foreground_size = base_size
    content_size = int(base_size * 0.68)
    
    # Create output path
    output_dir = f'android/app/src/main/res/{folder}'
    output_path = os.path.join(output_dir, 'ic_launcher_foreground.png')
    
    # Resize icon content to 68% of base size
    icon_content = resize_to_cover(img, (content_size, content_size))
    
    # Create full-size foreground canvas with transparent background
    foreground_canvas = Image.new('RGBA', (foreground_size, foreground_size), (255, 255, 255, 0))
    
    # Calculate position to center the content
    offset = (foreground_size - content_size) // 2
    
    # Paste the content in the center
    foreground_canvas.paste(icon_content, (offset, offset))
    
    # Save the image
    foreground_canvas.save(output_path, 'PNG')
    print(f'Generated {output_path} ({foreground_size}x{foreground_size} with {content_size}x{content_size} content = 68%)')

# Also generate legacy icons for older Android versions (pre-API 26)
print('\nGenerating legacy launcher icons (for Android < 8.0)...')
for folder, size in sizes.items():
    # Create output path
    output_dir = f'android/app/src/main/res/{folder}'
    output_path = os.path.join(output_dir, 'ic_launcher.png')
    
    # Resize to cover the entire square (no empty space)
    icon_img = resize_to_cover(img, (size, size))
    
    # Save the image
    icon_img.save(output_path, 'PNG')
    print(f'Generated {output_path} ({size}x{size})')

# Generate legacy round icons
print('\nGenerating legacy round launcher icons (for Android < 8.0)...')
for folder, size in sizes.items():
    # Create output path for round icon
    output_dir = f'android/app/src/main/res/{folder}'
    output_path = os.path.join(output_dir, 'ic_launcher_round.png')
    
    # Resize to cover the entire square (no empty space)
    icon_img = resize_to_cover(img, (size, size))
    
    # Save the image
    icon_img.save(output_path, 'PNG')
    print(f'Generated {output_path} ({size}x{size})')

print('\n✓ All icons generated!')
print('✓ Adaptive icons (Android 8.0+) will fill circular launchers perfectly!')
print('✓ Legacy icons (Android < 8.0) use standard sizing')

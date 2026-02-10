#!/usr/bin/env python3
"""
Generate Android app icons from source image
Uses PIL/Pillow to resize icons to different densities
"""

from PIL import Image
import os

# Paths
SOURCE_IMAGE = "/home/mahesh/Desktop/Schooler/Student_App/src/assets/images/icon.jpeg"
ANDROID_RES = "/home/mahesh/Desktop/Schooler/Student_App/android/app/src/main/res"

# Icon sizes for different densities
SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

def generate_icons():
    """Generate Android app icons in all required sizes"""
    
    # Check if source image exists
    if not os.path.exists(SOURCE_IMAGE):
        print(f"❌ Error: Source image not found at {SOURCE_IMAGE}")
        return False
    
    print(f"📱 Generating Android app icons from {SOURCE_IMAGE}...")
    
    try:
        # Open source image
        img = Image.open(SOURCE_IMAGE)
        
        # Convert to RGBA if needed (for transparency support)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Generate icons for each density
        for folder, size in SIZES.items():
            folder_path = os.path.join(ANDROID_RES, folder)
            
            # Create folder if it doesn't exist
            os.makedirs(folder_path, exist_ok=True)
            
            # Resize image
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Save as ic_launcher.png
            launcher_path = os.path.join(folder_path, "ic_launcher.png")
            resized.save(launcher_path, "PNG")
            
            # Save as ic_launcher_round.png
            round_path = os.path.join(folder_path, "ic_launcher_round.png")
            resized.save(round_path, "PNG")
            
            print(f"  ✅ {folder}: {size}x{size}px")
        
        print("\n✅ Android app icons generated successfully!")
        print("\nIcon files created in:")
        print("  - mipmap-mdpi (48x48)")
        print("  - mipmap-hdpi (72x72)")
        print("  - mipmap-xhdpi (96x96)")
        print("  - mipmap-xxhdpi (144x144)")
        print("  - mipmap-xxxhdpi (192x192)")
        print("\nNext steps:")
        print("1. Clean the Android build:")
        print("   cd android && ./gradlew clean")
        print("2. Rebuild the app:")
        print("   cd .. && npx react-native run-android")
        
        return True
        
    except Exception as e:
        print(f"❌ Error generating icons: {e}")
        return False

if __name__ == "__main__":
    generate_icons()

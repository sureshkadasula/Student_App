#!/bin/bash

# Script to generate Android app icons from source image
# This script uses ImageMagick to resize the icon to different densities

SOURCE_IMAGE="/home/mahesh/Desktop/Schooler/Student_App/src/assets/images/icon.jpeg"
ANDROID_RES="/home/mahesh/Desktop/Schooler/Student_App/android/app/src/main/res"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Installing..."
    sudo apt-get update && sudo apt-get install -y imagemagick
fi

echo "Generating Android app icons from $SOURCE_IMAGE..."

# Generate icons for different densities
# mdpi: 48x48
convert "$SOURCE_IMAGE" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"

# hdpi: 72x72
convert "$SOURCE_IMAGE" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"

# xhdpi: 96x96
convert "$SOURCE_IMAGE" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"

# xxhdpi: 144x144
convert "$SOURCE_IMAGE" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"

# xxxhdpi: 192x192
convert "$SOURCE_IMAGE" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"

echo "✅ Android app icons generated successfully!"
echo "Icon files created in:"
echo "  - mipmap-mdpi (48x48)"
echo "  - mipmap-hdpi (72x72)"
echo "  - mipmap-xhdpi (96x96)"
echo "  - mipmap-xxhdpi (144x144)"
echo "  - mipmap-xxxhdpi (192x192)"
echo ""
echo "Next steps:"
echo "1. Clean the Android build: cd android && ./gradlew clean"
echo "2. Rebuild the app: cd .. && npx react-native run-android"

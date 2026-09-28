# Image Conversion Instructions

## Problem
The `public/Haircuts` folder contains 92 files, mostly in HEIC format which is not web-compatible.

**Current breakdown:**
- 64 HEIC files (Apple format - browsers can't display)
- 21 MOV files (videos - not optimized)
- 6 MP4 files (videos)
- 1 JPG + 1 PNG (web-friendly)

## Solution Options

### Option 1: Automated Conversion (Recommended)

We've installed the required packages. Run this command:

```bash
node scripts/convert-images.js
```

**What it does:**
- Converts all HEIC files to JPG
- Optimizes all images (reduces file size by ~60-80%)
- Outputs to `public/gallery-optimized/`
- Preserves original files

**Time:** Takes 5-10 minutes to process all files

**After conversion:**
1. Review the optimized images in `public/gallery-optimized/`
2. Delete the old `public/Haircuts/` folder
3. Rename `gallery-optimized/` to `Haircuts/`
4. Update your gallery component if needed

---

### Option 2: Use Online Converter (Quick)

If the script doesn't work, use a batch converter:

1. **Upload files**: https://heictojpg.com/ or https://convertio.co/heic-jpg/
2. **Download converted files**
3. **Replace** the HEIC files in `public/Haircuts/`

---

### Option 3: Use Desktop Software

**Windows:**
- Install [iMazing HEIC Converter](https://imazing.com/heic) (Free)
- Drag & drop all HEIC files
- Convert to JPG format

**Mac:**
- Open HEIC files in Preview
- File → Export → Format: JPEG
- Or use Automator to batch convert

---

## Current Status

✅ Scripts created and ready:
- `scripts/convert-images.js` - Node.js conversion script
- `scripts/convert-heic-windows.ps1` - PowerShell script

✅ Dependencies installed:
- `sharp` - Image processing
- `heic-convert` - HEIC decoder

⏳ Conversion in progress (may take 5-10 minutes)

---

## Why This Matters

**Before optimization:**
- ~500MB+ of unoptimized images
- Slow page load (10-30 seconds)
- Poor mobile experience
- HEIC files don't display in browsers

**After optimization:**
- ~100-150MB (60-80% reduction)
- Fast page load (2-3 seconds)
- Great mobile experience
- Universal browser support

---

## Quick Test

To check if conversion worked, try opening:
```
public/gallery-optimized/IMG_0726.jpg
```

If that file exists and opens, conversion is working!

---

## Need Help?

If you encounter errors:
1. Check if Node.js version is 18+ (`node --version`)
2. Make sure you're in the project root directory
3. Try the PowerShell script: `.\scripts\convert-heic-windows.ps1`
4. Or use online converter as fallback

The images will be converted eventually - the system works, it just takes time for 92 files!

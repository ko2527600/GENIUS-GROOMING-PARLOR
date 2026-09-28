/**
 * Image Conversion Script
 * Converts HEIC files to JPG and optimizes all images for web
 * 
 * Prerequisites:
 * npm install sharp heic-convert --save-dev
 * 
 * Usage:
 * node scripts/convert-images.js
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Directories to process
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const HAIRCUTS_DIR = path.join(PUBLIC_DIR, 'Haircuts');
const HAIR_COLORING_DIR = path.join(PUBLIC_DIR, 'Hair Coloring');
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'gallery-optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Convert HEIC to JPEG buffer
 */
async function convertHeicToJpeg(inputPath) {
  try {
    // Try using heic-convert if available
    const heicConvert = await import('heic-convert');
    const inputBuffer = await readFile(inputPath);
    const outputBuffer = await heicConvert.default({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });
    return outputBuffer;
  } catch (error) {
    console.error(`Failed to convert HEIC: ${path.basename(inputPath)}`);
    console.error('Make sure heic-convert is installed: npm install heic-convert');
    return null;
  }
}

/**
 * Optimize and resize image
 */
async function optimizeImage(inputBuffer, outputPath, maxWidth = 1920) {
  try {
    await sharp(inputBuffer)
      .resize(maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`Failed to optimize: ${path.basename(outputPath)}`, error.message);
    return false;
  }
}

/**
 * Process a single file
 */
async function processFile(inputPath, outputDir) {
  const ext = path.extname(inputPath).toLowerCase();
  const basename = path.basename(inputPath, ext);
  const outputPath = path.join(outputDir, `${basename}.jpg`);

  // Skip if already processed
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping (already exists): ${basename}.jpg`);
    return { skipped: true };
  }

  // Skip video files for now
  if (['.mov', '.mp4'].includes(ext)) {
    console.log(`⏭️  Skipping video: ${path.basename(inputPath)}`);
    return { skipped: true };
  }

  console.log(`🔄 Processing: ${path.basename(inputPath)}`);

  try {
    let buffer;

    if (ext === '.heic') {
      // Convert HEIC to JPEG
      buffer = await convertHeicToJpeg(inputPath);
      if (!buffer) return { error: true };
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      // Read existing image
      buffer = await readFile(inputPath);
    } else {
      console.log(`⏭️  Skipping unsupported format: ${ext}`);
      return { skipped: true };
    }

    // Optimize and save
    const success = await optimizeImage(buffer, outputPath);
    
    if (success) {
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const savedPercent = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      
      console.log(`✅ Converted: ${basename}.jpg (saved ${savedPercent}%)`);
      return { 
        success: true, 
        originalSize: inputStats.size,
        optimizedSize: outputStats.size
      };
    }

    return { error: true };
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(inputPath)}:`, error.message);
    return { error: true };
  }
}

/**
 * Process directory
 */
async function processDirectory(inputDir, label) {
  console.log(`\n📁 Processing ${label}...`);
  
  if (!fs.existsSync(inputDir)) {
    console.log(`⚠️  Directory not found: ${inputDir}`);
    return { processed: 0, skipped: 0, errors: 0 };
  }

  const files = fs.readdirSync(inputDir);
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    
    // Skip directories
    if (fs.statSync(filePath).isDirectory()) continue;

    const result = await processFile(filePath, OUTPUT_DIR);
    
    if (result.success) {
      processed++;
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
    } else if (result.skipped) {
      skipped++;
    } else if (result.error) {
      errors++;
    }
  }

  return { processed, skipped, errors, totalOriginalSize, totalOptimizedSize };
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image conversion and optimization...\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const startTime = Date.now();

  // Process Haircuts folder
  const haircutsResult = await processDirectory(HAIRCUTS_DIR, 'Haircuts');
  
  // Process Hair Coloring folder
  const coloringResult = await processDirectory(HAIR_COLORING_DIR, 'Hair Coloring');

  // Summary
  const totalProcessed = haircutsResult.processed + coloringResult.processed;
  const totalSkipped = haircutsResult.skipped + coloringResult.skipped;
  const totalErrors = haircutsResult.errors + coloringResult.errors;
  const totalOriginalSize = haircutsResult.totalOriginalSize + coloringResult.totalOriginalSize;
  const totalOptimizedSize = haircutsResult.totalOptimizedSize + coloringResult.totalOptimizedSize;
  const totalSaved = totalOriginalSize - totalOptimizedSize;
  const savedPercent = totalOriginalSize > 0 
    ? ((totalSaved / totalOriginalSize) * 100).toFixed(1) 
    : 0;

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully converted: ${totalProcessed} files`);
  console.log(`⏭️  Skipped: ${totalSkipped} files`);
  console.log(`❌ Errors: ${totalErrors} files`);
  console.log(`💾 Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🎉 Space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${savedPercent}%)`);
  console.log(`⏱️  Time taken: ${duration}s`);
  console.log('='.repeat(60));
  
  console.log(`\n✨ Done! Optimized images are in: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review the optimized images');
  console.log('2. Replace the old files with optimized versions');
  console.log('3. Update your gallery component to use the new files');
}

// Run the script
main().catch(console.error);

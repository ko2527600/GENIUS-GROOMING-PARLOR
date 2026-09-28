# Convert HEIC to JPG using Windows
# This script uses Windows built-in image conversion capabilities

$ErrorActionPreference = "Continue"

# Paths
$publicDir = Join-Path $PSScriptRoot "..\public"
$haircutsDir = Join-Path $publicDir "Haircuts"
$coloringDir = Join-Path $publicDir "Hair Coloring"
$outputDir = Join-Path $publicDir "gallery-optimized"

# Create output directory
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

Write-Host "`n🚀 Starting HEIC to JPG Conversion...`n" -ForegroundColor Green

# Function to convert image using Windows
function Convert-ImageToJpg {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )
    
    try {
        # Load image using .NET
        Add-Type -AssemblyName System.Drawing
        
        $image = [System.Drawing.Image]::FromFile($InputPath)
        
        # Get JPEG codec
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
            Where-Object { $_.MimeType -eq "image/jpeg" }
        
        # Set quality
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
            [System.Drawing.Imaging.Encoder]::Quality, 85
        )
        
        # Save as JPEG
        $image.Save($OutputPath, $jpegCodec, $encoderParams)
        $image.Dispose()
        
        return $true
    }
    catch {
        Write-Host "❌ Error converting: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Process directory
function Process-Directory {
    param(
        [string]$InputDir,
        [string]$Label
    )
    
    Write-Host "📁 Processing $Label..." -ForegroundColor Cyan
    
    if (-not (Test-Path $InputDir)) {
        Write-Host "⚠️  Directory not found: $InputDir" -ForegroundColor Yellow
        return @{ Processed = 0; Skipped = 0; Errors = 0 }
    }
    
    $files = Get-ChildItem -Path $InputDir -File
    $processed = 0
    $skipped = 0
    $errors = 0
    
    foreach ($file in $files) {
        $ext = $file.Extension.ToLower()
        $outputFile = Join-Path $outputDir "$($file.BaseName).jpg"
        
        # Skip if already processed
        if (Test-Path $outputFile) {
            Write-Host "⏭️  Skipping (exists): $($file.Name)" -ForegroundColor Gray
            $skipped++
            continue
        }
        
        # Skip videos for now
        if ($ext -in @('.mov', '.mp4')) {
            Write-Host "⏭️  Skipping video: $($file.Name)" -ForegroundColor Gray
            $skipped++
            continue
        }
        
        # Process images
        if ($ext -in @('.jpg', '.jpeg', '.png', '.heic')) {
            Write-Host "🔄 Converting: $($file.Name)..." -ForegroundColor Yellow
            
            if ($ext -eq '.heic') {
                Write-Host "⚠️  HEIC files require special tools. Please use:" -ForegroundColor Red
                Write-Host "   - iMazing HEIC Converter (free)" -ForegroundColor White
                Write-Host "   - Or run: node scripts/convert-images.js" -ForegroundColor White
                $errors++
            }
            else {
                $success = Convert-ImageToJpg -InputPath $file.FullName -OutputPath $outputFile
                if ($success) {
                    $originalSize = $file.Length
                    $newSize = (Get-Item $outputFile).Length
                    $savedPercent = [math]::Round((1 - $newSize / $originalSize) * 100, 1)
                    Write-Host "✅ Converted: $($file.BaseName).jpg (saved $savedPercent%)" -ForegroundColor Green
                    $processed++
                }
                else {
                    $errors++
                }
            }
        }
        else {
            Write-Host "⏭️  Skipping: $($file.Name) (unsupported format)" -ForegroundColor Gray
            $skipped++
        }
    }
    
    return @{
        Processed = $processed
        Skipped = $skipped
        Errors = $errors
    }
}

# Process directories
$haircutsResult = Process-Directory -InputDir $haircutsDir -Label "Haircuts"
$coloringResult = Process-Directory -InputDir $coloringDir -Label "Hair Coloring"

# Summary
$totalProcessed = $haircutsResult.Processed + $coloringResult.Processed
$totalSkipped = $haircutsResult.Skipped + $coloringResult.Skipped
$totalErrors = $haircutsResult.Errors + $coloringResult.Errors

Write-Host "`n$('=' * 60)" -ForegroundColor Cyan
Write-Host "📊 SUMMARY" -ForegroundColor Green
Write-Host "$('=' * 60)" -ForegroundColor Cyan
Write-Host "✅ Successfully converted: $totalProcessed files" -ForegroundColor Green
Write-Host "⏭️  Skipped: $totalSkipped files" -ForegroundColor Yellow
Write-Host "❌ Errors/HEIC files: $totalErrors files" -ForegroundColor Red
Write-Host "$('=' * 60)" -ForegroundColor Cyan

if ($totalErrors -gt 0) {
    Write-Host "`n⚠️  HEIC Conversion Required!" -ForegroundColor Yellow
    Write-Host "`nFor HEIC files, you have 3 options:" -ForegroundColor White
    Write-Host "1. Install heic-convert and run: npm install && node scripts/convert-images.js"
    Write-Host "2. Use iMazing HEIC Converter: https://imazing.com/heic"
    Write-Host "3. Use online converter: https://heictojpg.com/"
}

Write-Host "`n✨ Output directory: $outputDir" -ForegroundColor Green

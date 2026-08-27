#!/usr/bin/env bash
# PECOMED CAP CDSS - Standalone Windows Package Builder (Portable EXE + Bundled JRE)
# Usage: ./package-windows.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ROOT_DIR/dist/pecomed-cdss-windows"
JRE_ZIP="/tmp/win-jre17.zip"

echo "=== 1. Building Fat JAR and Windows Executable ==="
cd "$ROOT_DIR"
mvn package -DskipTests

echo "=== 2. Creating Distribution Bundle at dist/pecomed-cdss-windows ==="
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

cp "$ROOT_DIR/target/pecomed-cdss.exe" "$DIST_DIR/"
cp "$ROOT_DIR/target/pecomed-cap-cdss-1.0.0.jar" "$DIST_DIR/"

echo "=== 3. Downloading Portable Windows JRE 17 (Eclipse Temurin) ==="
if [ ! -f "$JRE_ZIP" ]; then
  curl -sL "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jre/hotspot/normal/eclipse" -o "$JRE_ZIP"
fi

echo "=== 4. Extracting Bundled JRE into distribution ==="
mkdir -p /tmp/win-jre-extract
unzip -q -o "$JRE_ZIP" -d /tmp/win-jre-extract/
mkdir -p "$DIST_DIR/jre"
cp -r /tmp/win-jre-extract/*/* "$DIST_DIR/jre/"
rm -rf /tmp/win-jre-extract

echo "=== 5. Creating Windows Launcher Batch Fallback ==="
cat << 'BAT' > "$DIST_DIR/start.bat"
@echo off
title PECOMED CAP CDSS
start "" "%~dp0pecomed-cdss.exe"
BAT

echo "=== 6. Creating Portable ZIP Archive ==="
cd "$ROOT_DIR/dist"
zip -r -q "pecomed-cdss-windows-portable.zip" pecomed-cdss-windows/

echo "============================================================"
echo "  SUCCESS! Portable Windows Bundle Created:"
echo "  - Folder: dist/pecomed-cdss-windows/"
echo "  - ZIP:    dist/pecomed-cdss-windows-portable.zip"
echo "  - Includes: pecomed-cdss.exe + Bundled JRE (No Java required!)"
echo "============================================================"

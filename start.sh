#!/usr/bin/env bash
# PECOMED CAP CDSS - Spring Boot Server Launcher
# Usage: ./start.sh [port]

PORT="${1:-8080}"
JAR="$(dirname "$0")/target/pecomed-cap-cdss-1.0.0.jar"

if [ ! -f "$JAR" ]; then
  echo "JAR not found. Building..."
  cd "$(dirname "$0")" && mvn package -q -DskipTests
fi

echo "=================================="
echo "  PECOMED CAP CDSS v1.0.0"
echo "  http://localhost:$PORT"
echo "=================================="
exec java --enable-native-access=ALL-UNNAMED -Dfile.encoding=UTF-8 \
  -jar "$JAR" --server.port="$PORT"

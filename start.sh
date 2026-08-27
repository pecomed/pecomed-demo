#!/usr/bin/env bash
set -e

PORT=${PORT:-8080}
echo "Starting PECOMED CAP CDSS TypeScript Server on port $PORT..."
node dist/server.js

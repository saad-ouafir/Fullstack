#!/bin/bash
# API Test Runner - Executes Postman collection tests using Newman

set -e

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo "Newman not found. Installing..."
    npm install -g newman newman-reporter-htmlextra
fi

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "Error: API server not running on http://localhost:3000"
    echo "Start the server with: npm start"
    exit 1
fi

echo "Running API tests..."
mkdir -p test-results

newman run TODO_TRACKER_API_v4.postman_collection.json \
    --reporters cli,htmlextra \
    --reporter-htmlextra-export test-results/report-$(date +%Y%m%d-%H%M%S).html \
    --reporter-htmlextra-darkTheme \
    --delay-request 100 \
    --timeout-request 10000

if [ $? -eq 0 ]; then
    echo "All tests passed. Report saved in test-results/"
else
    echo "Some tests failed. Check test-results/ for details."
    exit 1
fi

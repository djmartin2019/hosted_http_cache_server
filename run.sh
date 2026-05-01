#!/bin/bash

echo "Starting Origin Server..."
node origin/server.js &

ORIGIN_PID=$!

echo "Starting Edge Server..."
node edge/server.js &

EDGE_PID=$!

echo "Servers running:"
echo "Edge:     http://localhost:3000"
echo "Origin:   http://localhost:4000"

#Wait for both processes
wait $ORIGIN_PID $EDGE_PID

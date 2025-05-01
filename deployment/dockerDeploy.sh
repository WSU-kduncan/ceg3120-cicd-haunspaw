#!/bin/bash

# === Configuration ===
IMAGE_NAME="haunspaw/aunspaw-ceg3120:latest"
CONTAINER_NAME="angular-site"
HOST_PORT=8080
CONTAINER_PORT=80

echo ">>> Pulling latest image: $IMAGE_NAME"
docker pull $IMAGE_NAME

# Check if the container is already running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo ">>> Stopping container: $CONTAINER_NAME"
  docker stop $CONTAINER_NAME
fi

# Check if the container exists (running or stopped)
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo ">>> Removing container: $CONTAINER_NAME"
  docker rm $CONTAINER_NAME
fi

echo ">>> Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $HOST_PORT:$CONTAINER_PORT \
  $IMAGE_NAME

echo ">>> Done. Use 'docker ps' to confirm it's running."

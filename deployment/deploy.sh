#!/bin/bash

# Get the body of the request (the payload)
payload=$(cat)

# Get the signature from the headers (X-Hub-Signature-256)
signature=$(echo "$HTTP_X_HUB_SIGNATURE_256" | sed 's/^sha256=//')

# Set your webhook secret (the one you set in GitHub)
secret="WEB_HOOK_SECRET"

# Generate the HMAC-SHA256 signature using the payload and secret
generated_signature=$(echo -n "$payload" | openssl dgst -sha256 -hmac "$secret" | sed 's/^.* //')

# Debugging: Print the payload and the generated signature
echo "Received signature: $signature"
echo "Generated signature: $generated_signature"

# Check if the signatures match
if [[ "$signature" != "$generated_signature" ]]; then
  echo "Signature mismatch. Ignoring request."
  exit 1
fi

# Signature matched, proceed with deployment
echo "Signature matched. Proceeding with deployment."

# Pull the latest Docker image from Docker Hub and restart the container
docker pull haunspaw/aunspaw-ceg3120:latest
docker stop your_container
docker rm your_container
docker run -d --name your_container -p 80:80 haunspaw/aunspaw-ceg3120:latest

echo "Deployment completed."

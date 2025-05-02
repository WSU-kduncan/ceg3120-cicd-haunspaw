#!/bin/bash

payload=$(cat)
signature=$(echo "$2" | sed 's/^sha256=//')

# Debug: Print raw payload
echo "Raw payload received:"
echo "$payload" | jq .

secret="haunspaw"
generated_signature=$(echo -n "$payload" | openssl dgst -sha256 -hmac "$secret" | sed 's/^.* //')

echo "Received signature: $signature"
echo "Generated signature: $generated_signature"

if [[ "$signature" != "$generated_signature" ]]; then
  echo "Signature mismatch. Ignoring request."
  #exit 1
fi

echo "Signature matched. Proceeding with deployment."

bash /home/ubuntu/dockerDeploy.sh

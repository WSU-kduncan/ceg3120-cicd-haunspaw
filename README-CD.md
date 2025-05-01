# Part 1 - Semantic Versioning

## Generating tags (using the tag)
- How to see tags in a git repository
```
git tag 
```
  
- How to generate a tag in a git repository
```
git tag -a latest -m "Testing to see if tags properly work"
```

- How to push a tag in a git repository to GitHub
```
git push origin (tag name)
```
- Results of the sucessful use of these commands
![tags.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/tags.png)
## Semantic Versioning Container Images with GitHub Actions

## Summary of workflow

- The workflow triggers when a tag is pushed, the workflow then builds the container using the ubuntu enviroment. The container is used to run the angular site, the code is download from the repository so the angular site can be correctly ran. This container is saved to the docker hub repo called aunspaw-ceg3120, which is accessed by using the log in info that is saved to the github secrets called DOCKER_USERNAME and DOCKERHUB_TOKEN.


## Steps of the yml file

```
name: Build and Push Docker Image

on:
  push:
    tags:
      - '*'  
```

- This block contains the name of the work flow aswell as what actions trigger the workflow. The work flow triggers when a tag is pushed 



```
jobs:
  build-and-push:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write
```

- The job section defines what the workflow does and what environment it uses as well as the permissions needed for the workflow to function.

```
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
```

- This section downloads the require code to successfully build the container

```
  - name: Extract tag name
        id: vars
        run: echo "TAG=${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
```
- This section logs into DockerHub and send the tag to the repo

```
      - name: Set up Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKER_USERNAME }}/aunspaw-ceg3120
          tags: |
            type=semver,pattern={{major}}
            type=semver,pattern={{major}}.{{minor}}
            type=semver,pattern={{version}}
            type=raw,value=latest
```

- This section creates a tag based off of the GitHub tag.

```
      - name: Log in to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
```

- This section contains the log in information for DockerHub

```

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./angular-site
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

- This section of the yml file builds and pushes the docker image based off he angular site and the tag associated with it


## Link to file
[workflow file](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/.github/workflows/docker-build-push.yml)


## Testing & Validating

```
Q: How to test that your workflow did its tasking
```
- Answer, push a tagged commit to github and check the actions tab. It should look like the following
![Actions2.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/Action2.png)

```
Q: How to verify that the image in DockerHub works when a container is run using the image
```
- Answer, run the following commands and the result should be the image at http://localhost:8080/.
```
docker pull haunspaw/aunspaw-ceg3120:latest
docker run --rm -p 8080:80 haunspaw/aunspaw-ceg3120:latest
```
![birds.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/birds.png)


# Part 2 - Continuous Deployment


- EC2 Instance Details
  - AMI: Ubuntu
  - Instance type: t.2medium
  - Volume size: 30 GB
  - Security group information:
    - Allow Access
      - port 22 (ssh)
      - port 80 (ec2)
      - port 8080 (ec2)
      - port 9000 (webhook
  - Port 22, 80, 8080, 9000 are open to allow for ssh access and allow for the webhook to function correctly

- Docker Setup on OS on the EC2 instance (ubuntu os)
  - How to install Docker for OS on the EC2 instance (run the following commands)
  ```
  sudo apt-get update
  sudo apt-get install ca-certificates curl
  sudo install -m 0755 -d /etc/apt/keyrings
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  ```
  -  These commands are used to set up the apt repository docker uses
  ```
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  ```
  - This command is used to install docker
  ```
  docker --version
  sudo docker run hello-world
  docker ps -a
  ```
  - These commands are used to verify that docker is correctly installed and is operational as well as the ability to run containers
    
- Testing on EC2 Instance
  - How to pull container image from DockerHub repository
  ```
  command: docker pull username/repository:Tag
  ex:  docker pull haunspaw/aunspaw-ceg3120:latest
  ```
  ![ec2ProofImage.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/ec2ProofImage.png)
  
  - How to run container from image
    ```
    command: docker run [OPTIONS] <image-name>]
    ex: docker run -it angular-site
    ex: docker run -d angular-site
    docker run -it --name angular-site -p 80:80 haunspaw/aunspaw-ceg3120:latest
    docker run -d --name angular-site -p 80:80 haunspaw/aunspaw-ceg3120:latest
    ```
    - Differences between (-it) and (-d)
      - (-it) is best used for testing purposes as it requires manual intervention
      - (-d) is best for production as these containers can run independenly in the background

    - How to verify that the container is successfully serving the Angular application
      - validate from container side
        - curl http://localhost:80
      - validate from host side
        - curl http://localhost:80 
        - go to http://localhost:80
      - validate from an external connection (your physical system)
        - enter http://<EC2 Ip address>:80 in search bar

  - Steps to manually refresh the container application if a new image is available on DockerHub
    - The following command to pull the image 
    ```
    command: docker pull username/repository:Tag
    ex:  docker pull haunspaw/aunspaw-ceg3120:latest
    ```
    - Then stop/remove the old container
    ```
    docker stop angular-app
    docker rm angular-app
    ```
    - Run container with new image using the following command
    ```
    docker run -d --name angular-site -p 80:80 haunspaw/aunspaw-ceg3120:latest
    ```
    - Verify its running
    ```
    docker ps
    ```
    - go to the ip address to see if it was properly updated

  - Scripting Container Application Refresh
    - [bash script](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/deployment/bash.sh)
    - Do not for get to make it executable using the following command
    ```
    chmod +x bash.sh
    ```
    - To run the script use the following
    ```
    ./bash.sh
    ```
    - To see if it worked use the following commands
    ```
    docker ps
    curl http://localhost:80
    ```
  - Configuring a webhook Listener on EC2 Instance
    - How to install adnanh's webhook to the EC2 instance
    ```
    sudo apt-get install webhook
    ```
    - How to verify successful installation
    ```
    webhook -version
    ```
    ![webhookVerify.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/webhookVersion.png)
    - Summary of the webhook definition file
    
      ```
      [
        {
          "id": "deploy",
          "execute-command": "/home/ubuntu/deploy.sh",
          "command-working-directory": "/home/ubuntu",
          "pass-arguments-to-command": [
            {
              "source": "entire-payload"
            },
            {
              "source": "header",
              "name": "X-Hub-Signature-256"
            }
          ],
      
      ```
      - This section contains the name of the webhook, what script that will be executed when the webhook is triggered and what arguments are passed to the script. It also contains the http header used for the GitHub request.
      
      
      ```
          "trigger-rule": {
            "and": [
              {
                "match": {
                  "type": "value",
                  "value": "push",
                  "parameter": {
                    "source": "header",
                    "name": "X-GitHub-Event"
                  }
                }
              },
      ```
      - This is the trigger rule that activates when the HTTP request from GitHub has the value of push. Which means when a push event happens the webhook starts.
      
      ```
              {
                "match": {
                  "type": "payload-hmac-sha256",
                  "secret": "haunspaw",
                  "parameter": {
                    "source": "header",
                    "name": "X-Hub-Signature-256"
                  }
                }
              }
            ]
          }
        }
      ]
      ```
      - This section is the security check for the webhook to make sure the request is the correct one. It does this by comparing the hash of the payload using the secret and the hash from the signature sent by GitHub.
      
      - The full file is below
    ```
    [
    {
      "id": "deploy",
      "execute-command": "/home/ubuntu/deploy.sh",
      "command-working-directory": "/home/ubuntu",
      "pass-arguments-to-command": [
        {
          "source": "entire-payload"
        },
        {
          "source": "header",
          "name": "X-Hub-Signature-256"
        }
      ],
      "trigger-rule": {
        "and": [
          {
            "match": {
              "type": "value",
              "value": "push",
              "parameter": {
                "source": "header",
                "name": "X-GitHub-Event"
              }
            }
          },
          {
            "match": {
              "type": "payload-hmac-sha256",
              "secret": "haunspaw",
              "parameter": {
                "source": "header",
                "name": "X-Hub-Signature-256"
              }
            }
          }
        ]
      }
    }
  
    ]
    ```
    - How to verify definition file was loaded by webhook
    ```
    webhook -hooks deploy.json -verbose -port 9000
    ```
    ![webHookVerify.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/webHookVerify.png)
    
    - How to verify webhook is receiving payloads that trigger it
      - how to monitor logs from running webhook
      ```
      docker logs container-name
      ```
      ![dockerLogs.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/dockerLogs.png)
      - what to look for in docker process views
          - Status
          - ports
          - command
          - image
      - A command to help is
      ```
      command: docker inspect container-name
      ex: docker inspect angular-site
      ```
      - [result of the docker inspect](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/new/main/Images)
      - [definition file](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/deployment/deploy.json)

- Configuring a Payload Sender

  - Justification for selecting GitHub or DockerHub as the payload sender
      - I chose github because the payload information is more detailed than dockerhubs. This helped immensely with bug fixing.
        
  - How to enable your selection to send payloads to the EC2 webhook listener
    ```
    # make sure the container is running
    docker run --rm -d -p  8080:80 haunspaw/aunspaw-ceg3120:latest -n angular-site
    curl http://<EC2_PUBLIC_IP>:9000

    Complete the following steps
    1. Go to add webhooks on github (repo / Settings / Webhooks / Add webhook)
    2. place the following in the url section http://<EC2_PUBLIC_IP>:9000
    3. under content type select: application/json
    4. add a secret
    5. chose an event type that will trigger the payload (in this case choose specfic event and chose workflow event which will make the event be a workflow activation)
    6. click add
    7. test by using the following command on the ec2 instance: docker logs angular-site
    ```
    ![dockerLogs.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/dockerLogs.png)

  - Explain what triggers will send a payload to the EC2 webhook listener
    - For this project I chose the specific event of workflow (docker-build-push) success to trigger the webhook

  - How to verify a successful payload delivery
    - Go to webhooks in github settings
    - select recent delivery
    - this allows you to verify if the payload was correctly sent
![payload.png]()

- Configure a webhook Service on EC2 Instance (below is the webhook service file)
```
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
```
  - [deploy.sh](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/deployment/deploy.sh)
  - The webhook service file reads in a request from github and then verifies the authenticity by comparing the signatures. If they do not match the script exits, if they do match it will then call the dockerDeploy.sh script



















  
 

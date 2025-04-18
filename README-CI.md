# CI Project Overview
- Making a docker container that runs the angular site, and the image will be pushed to docker hub when the Github actions workflow is triggered
- The following tools were utilized to accomplish this task
  - DockerHub: A DockerHub repository was created to save the image in a secure enviroment
  - Docker: A docker file was used to make the image and container need to run the angular site
  - Github Actions: These were used to create the workflow needed to accomplish Part 2
  - Node: This was needed to be able to run the angular site
  - Ubuntu: Ubuntu was used as the enviroment to successfully utilize Docker, Dockerhub, Node and Github actions
- [Diagram](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Project4Diagram.pdf) for visual explanation
- The resources used to complete this lab are found at the bottom of this README

# Part 1 - Docker-ize it

## Containerizing your Application (How to):
- Go to [Docker](https://www.docker.com/) and pick the download that works best for your machine
- Follow and answer the prompts to finish the install
- The questions it will ask will vary depending on the version
- The one that was used for this project was Docker desktop for windows
- The questions it will ask are in summary
  - Activate the installer
  - chose where to save the file
  - enable either wsl or hypervisor
  - complete install
- Verify the install was successful by running the following command
```
docker --version
```
![vdocker.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/vdocker.png)
- Enable WSL connectivity if you are using wsl for the project
![dockerhubWSL.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/dockerhubWSL.png)
- Use the following command to make a docker file (make sure the Docker file is in the root of the angular site folder)
```
touch Dockerfile
```
- The following image is a screenshot of the Docker file I used
![dockerFileimg.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/dockerFileimg.png)
- The Docker file achieves the following
  - utilizes an appropriate base image with the FROM command
  - completes installation of the application software stack with RUN command(s)
  - copies in the angular-site application with the COPY command
  - starts the application when a container is run from the image built with the Dockerfile with the CMD command
  - use of the EXPOSE command 
- Then run the following command to build the image
```
 docker build -t angular-site .
```
- To run the container run the following command
```
docker run -d -p 8080:80 --name angular-container angular-site
```
If the previous steps were correctly followed, http://localhost:8080/ will show the this and using the curl command on the port will show the second image
![birds.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/birds.png)
![curl.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/curl.png)
## Working with DockerHub:
- Go to [Docker Hub](https://hub.docker.com/)
- Make an account
- Click make repository, follow the steps to create and then create
![repo.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/repo.png)

- Creating a personal access token
  - Log in to [DockerHub](https://hub.docker.com/)
  - Click on Account settings
  - Navigate to the Security tab
  - Under Access Tokens, click "New Access Token"
  - Name the token
  - Give it the permissions required for the project (Read and Write)
  - Click Generate
  - Copy the token and save it 

- Docker login
![login.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/login.png)


- The following is an example of pushing to dockerhub
![dockerPush.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/dockerPush.png)


- [My Repo](https://hub.docker.com/r/haunspaw/aunspaw-ceg3120/tags)



# Part 2 - GitHub Actions and DockerHub

## Configuring GitHub Repository Secrets:
- To create a Personal Access Token complete the following steps:
  - Click Account setting while logged into your Docker Hub account
  - Click Personal Access Tokens
  - Click generate new token
  - Provide a name
  - Chose desired access level (for this project Read & Write)
  - Generate and copy
  - Save to secure location
- How to set repository Secrets for use by GitHub Actions
  - Follow the following path on the chosen Github Repository
    - Settings
    - Secrets and variables
    - Actions
    - New repository secret
  - Once in the repository secrets section add the following secrets (Do not forget to click save after adding the values)
![secrets.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/secrets.png)
  - The secrets added will allow us to set up Git actions that utilize our docker containers

## CI with GitHub Actions
- Before we can utilze github actions the following file (and/or directory) or a file similar to it must be created
```
mkdir -p .github/workflows
nano .github/workflows/docker-build-push.yml
```
- Summary of what your workflow does and when it does it (this is added to the yml file, full version is listed at the end of this section)
- Comments are there to help understand what the block of code does and can be removed when making the file
```
name: Build and Push Docker Image  ## Name of the workflow

on: ## The branch it runs on
  push:
    branches:
      - main
```
- This section provides the name for the workflow. It then uses the key word ON to define what triggers the workflow in this case the push command. The Branches key word help define what branch the workflow should listen on, in this instance we are using the MAIN branch.

```
jobs: ## What the workflow does, in this case it builds and pushes the image angular site
  build-and-push:
    runs-on: ubuntu-latest
```
- Here is the job section which defines what the workflow does and where it occurs. It is programmed to build and push the image (angular-site), it runs using the linked ubuntu enviroment.
```
    permissions: ## for this project Read and Write are rquired
      contents: read
      packages: write

    steps: ## builds and pushes
      - name: Checkout code
        uses: actions/checkout@v4
```
- This section clarifies what permissions are needed for the project, in this case Read and Write privileges. It also downloads from the repository to the enviroment. The code is then checked out so the container can be built.
```
      - name: Log in to DockerHub ## logs into Docker hub using the credientals from the github secrets we added
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
```
- This part logins into Docker using the provide login information
```
      - name: Build and push Docker image ## pushes the change to the docker hub repo
        uses: docker/build-push-action@v5
        with:
          context: ./angular-site
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/aunspaw-ceg3120:latest
```          
- This section pushes the changes to the docker hub repository

## Full workflow file

```
name: Build and Push Docker Image  ## Name of the workflow

on: ## The branch it runs on
  push:
    branches:
      - main

jobs: ## What the workflow does, in this case it builds and pushes the image angular site
  build-and-push:
    runs-on: ubuntu-latest

    permissions: 
      contents: read
      packages: write

    steps: 
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to DockerHub 
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push Docker image 
        uses: docker/build-push-action@v5
        with:
          context: ./angular-site
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/aunspaw-ceg3120:latest
            
```

- [WorkFlow file](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/.github/workflows/docker-build-push.yml)


## Testing & Validating
- How to test that your workflow did its tasking
  - Check under the actions tab on the respective github repo and the actions listed should look like the following if successful
  - Another way is to check the Docker Hub repo which is shown in the second image
![workFlow.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/workFlow.png)
![githubActions.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/githubActions.png)
![repoProof2.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/repoProof2.png)
- How to verify that the image in DockerHub works when a container is run using the image, use the following command
```
docker logs CONTAINER-NAME
```

![dockerTestA.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/dockerTestA.png)







# Sources
- https://hub.docker.com/explore
  - This helped me get a better understanding of docker hub
- chatgpt: generate me a basic node dockerfile
  - Learned how to make a basic docker file and the using ai to modify it to help meet the requirements of part 1
```
# Use the official Node.js LTS base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your app's source code
COPY . .

# Expose the port your app runs on (optional, but good practice)
EXPOSE 3000

# Command to start the app
CMD ["node", "index.js"]
```
Chatgpt: modify to meet the following requirements
utilizes an appropriate base image with the FROM command
completes installation of the application software stack with RUN command(s)
copies the angular-site application to the container with the COPY command
starts the Angular application when a container is run from the image built with the Dockerfile with the CMD command
Note: as needed according to your base selection
use of the EXPOSE command is optional
```
# Use an official Node.js LTS base image for building Angular
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
COPY angular-site/package*.json ./

# Install Angular CLI globally and app dependencies
RUN npm install -g @angular/cli && npm install

# Copy the Angular app source code into the container
COPY angular-site/ .

# Build the Angular app for production
RUN ng build --configuration=production

# Serve the Angular app using a lightweight web server like nginx
# First, use a new stage with nginx as the base
FROM nginx:alpine

# Start nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
```
I used these two docker files as a starting point and then modified them to better address the points of the project

- https://docs.docker.com/get-started/docker_cheatsheet.pdf
  - Used for docker commands
- https://github.com/pattonsgirl/CEG3120/blob/main/CourseNotes/github-actions.md
  - Used to learn what github actions are
- https://docs.docker.com/build/ci/github-actions/
  - Documentation on git actions with docker this helped when making the yml file
- https://github.com/docker/build-push-action
  - Used to help create my yml file and bug fix it
- https://github.com/marketplace/actions/build-and-push-docker-images
  - Used for the contruction of the yml file
- https://www.lucidchart.com/pages
  - This was used to make the project diagram in the project overview

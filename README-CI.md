# CI Project Overview
- Making a docker container that runs the angular site


# Part 1 - Docker-ize it

## Containerizing your Application (How to):
- Go to [Docker](https://www.docker.com/) and pick the download that works best for your machine
- Follow the installation guide
- Enable WSL connectivity if you are using wsl for the project
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


- [My Repo](https://hub.docker.com/repository/docker/haunspaw/aunspaw-ceg3120/general)



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
- Summary of what your workflow does and when it does it (this is added to the yml file)
  - Comments are there to summarize what the block of code does and can be removed when making the file
```
name: Build and Push Docker Image  ## Name of the workflow

on: ## The branch it runs on
  push:
    branches:
      - main

jobs: ## What the workflow does, in this case it builds and pushes the image angular site
  build-and-push:
    runs-on: ubuntu-latest

    permissions: ## for this project Read and Write are rquired
      contents: read
      packages: write

    steps: ## builds and pushes
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to DockerHub ## logs into Docker hub using the credientals from the github secrets we added
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push Docker image ## pushes the change to the docker hub repo
        uses: docker/build-push-action@v5
        with:
          context: ./angular-site
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/DOCKERHUB REPO NAME:latest
            
```


- [WorkFlow file](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/.github/workflows/docker-build-push.yml)


## Testing & Validating
- How to test that your workflow did its tasking
  - Check under the actions tab on the respective github repo and the actions listed should look like the following if successful
  - Another way is to check the Docker Hub repo which is shown in the second image
![workFlow.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/workFlow.png)
![repoProof2.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/repoProof2.png)
- How to verify that the image in DockerHub works when a container is run using the image
![dockerTestA.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/dockerTestA.png)







# Sources
- https://hub.docker.com/explore (Help with understanding docker hub)
- chatgpt: how to make a dockerfile with the following criteria (Learned how to make a docker file)
- https://docs.docker.com/get-started/docker_cheatsheet.pdf (Used for docker commands)
- https://github.com/pattonsgirl/CEG3120/blob/main/CourseNotes/github-actions.md (Used to learn what github actions are)
- https://docs.docker.com/build/ci/github-actions/ (Documentation on git actions with docker)
- https://github.com/docker/build-push-action (Used to help create my yml file)
- https://github.com/marketplace/actions/build-and-push-docker-images (Used for the contruction of the yml file)

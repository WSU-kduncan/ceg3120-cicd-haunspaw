# CI Project Overview
- Making a docker container that runs the angular site

# Containerizing your Application (How to):
- Go to [Docker](https://www.docker.com/) and pick the download that works best for your machine
- Follow the installation guide
- Enable WSL connectivity if you are using wsl for the project
- Use the follwoing command to make a docker file (make sure the Docker file is in the root of the angular site folder)
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
If the previous steps were correctly followed, http://localhost:8080/ will show the this
![birds.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/birds.png)

# Working with DockerHub:
- Go to [Docker Hub](https://hub.docker.com/)
- Make an account
- Click make repository, follow the steps to create and then create
![repo.png](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/Images/repo.png)
- 
  
- [My Repo](https://hub.docker.com/repository/docker/haunspaw/aunspaw-ceg3120/general)

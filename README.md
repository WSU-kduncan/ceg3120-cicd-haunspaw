
# Summary
- This repository contains the require files and directions to make a docker container, and push the image to docker hub. In addition to this it provides the docuementaion required to automate the process with github actions. As well as the documentation to add webhooks to link communication between github and a EC2 instance



## [README-CI.md](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/README-CI.md)
 - This README contains the nessary file to do the following
     - Making a docker container that runs the angular site
     - Push the image to dockerhub
     - The Github actions workflow to automate it
- The following tools were utilized to accomplish this task (Accounts for Dockerhub, Docker will be needed)
  - DockerHub: A DockerHub repository was created to save the image in a secure enviroment
  - Docker: A docker file was used to make the image and container need to run the angular site
  - Github Actions: These were used to create the workflow needed to accomplish Part 2
  - Node: This was needed to be able to run the angular site
  - Ubuntu: Ubuntu was used as the enviroment to successfully utilize Docker, Dockerhub, Node and Github actions



## [README-CD.md](https://github.com/WSU-kduncan/ceg3120-cicd-haunspaw/blob/main/README-CD.md)
 - This README contains the nessary file to do the following
    - add version control to the previous project
    - webhook capabilities to the previous project
 - The following tools were utilized to accomplish this task (Accounts for Dockerhub, Docker, and AWS will be needed)
    - DockerHub: A DockerHub repository was created to save the image in a secure enviroment
    - Docker: A docker file was used to make the image and container need to run the angular site
    - Github Actions: These were used to create the workflow needed to accomplish Part 2
    - Node: This was needed to be able to run the angular site
    - Ubuntu: Ubuntu was used as the enviroment to successfully utilize Docker, Dockerhub, Node and Github actions
    - EC2 instance: This was made by using AWS this allowed for github webhooks to have somewhere to send the payload
    - Webhooks: webhooks were integrated using [adnanh webhooks](https://github.com/adnanh/webhook). These allowed for the docker images and containers to be pulled to the EC2 instance.

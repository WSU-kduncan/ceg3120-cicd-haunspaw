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

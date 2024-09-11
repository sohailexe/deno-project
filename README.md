# Deno Project

## Description

This project is a Dockerized web application that connects to a MongoDB database. It provides a streamlined development environment using Docker containers for both the application and database. This setup helps in consistent development and testing environments.

## Prerequisites

- **Docker**: Ensure Docker is installed and running on your system. You can download it from [Docker's official website](https://www.docker.com/get-started).

## Getting Started

Follow these steps to set up and run the project on your local machine:

### 1. Clone the Repository

Start by cloning the project repository from GitHub:
``` 
git clone <repository-url>

2. Create a Docker Network
Create a Docker network to allow communication between containers:

 
 
docker network create deno-net
3. Run MongoDB Container
Start a MongoDB container on the deno-net network:

 
 
docker run -d --rm --name mongodb --network deno-net -v mongodb_data:/data/db -p 27017:27017 mongo
This command sets up MongoDB with persistent data storage and exposes it on port 27017.

4. Build the Project Image
Build the Docker image for the project. You can name the image deno:

 
 
docker build -t deno .
5. Run the Project Container
Launch a container from the project image:

 
 
docker run -d --rm --name deno --network deno-net -p 3000:3000 -v /home/sohail/Desktop/deno-project:/app -v /app/node_modules deno
Replace /home/sohail/Desktop/deno-project with the path to your local project directory.
This command maps port 3000 of the container to port 3000 of your host machine and mounts your project directory to the container.
6. Access the Application
Open your browser and navigate to http://localhost:3000/ to view the running application.

Notes
Ensure Docker is running and properly configured on your system before executing the commands.
If you encounter any issues with the setup, please check the Docker logs or visit the project's issue tracker.
Issues and Contributions
For any issues or contributions, please refer to the project's issue tracker. Contributions are welcome! Please follow the contribution guidelines provided in the repository.


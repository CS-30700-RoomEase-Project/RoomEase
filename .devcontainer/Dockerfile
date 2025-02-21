# Use Node.js as the base image
FROM node:18-bullseye

# Set the working directory
WORKDIR /workspaces/RoomEase

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    openjdk-17-jdk \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install MongoDB
RUN curl -fsSL https://pgp.mongodb.com/server-7.0.asc | tee /usr/share/keyrings/mongodb-server-key.asc
RUN echo "deb [signed-by=/usr/share/keyrings/mongodb-server-key.asc] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
RUN apt-get update && apt-get install -y mongodb-org && rm -rf /var/lib/apt/lists/*

# Install Jenkins
RUN curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | tee /usr/share/keyrings/jenkins-keyring.asc
RUN echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | tee /etc/apt/sources.list.d/jenkins.list
RUN apt-get update && apt-get install -y jenkins && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g express-generator create-react-app

# Expose necessary ports
EXPOSE 3000 27017 8080

# Start MongoDB, Jenkins, and keep the container running
CMD mongod --fork --logpath /var/log/mongodb.log && \
    service jenkins start && \
    tail -f /dev/null

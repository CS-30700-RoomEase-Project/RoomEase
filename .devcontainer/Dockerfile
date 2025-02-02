FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# Install MongoDB command line tools - though mongo-database-tools not available on arm64
ARG MONGO_TOOLS_VERSION=6.0
RUN . /etc/os-release \
    && curl -sSL "https://www.mongodb.org/static/pgp/server-${MONGO_TOOLS_VERSION}.asc" | gpg --dearmor > /usr/share/keyrings/mongodb-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] http://repo.mongodb.org/apt/debian ${VERSION_CODENAME}/mongodb-org/${MONGO_TOOLS_VERSION} main" | tee /etc/apt/sources.list.d/mongodb-org-${MONGO_TOOLS_VERSION}.list \
    && apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y mongodb-mongosh \
    && if [ "$(dpkg --print-architecture)" = "amd64" ]; then apt-get install -y mongodb-database-tools; fi \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
# Use the official Jenkins LTS image from Docker Hub
FROM jenkins/jenkins:lts

# Set the user to root to install additional dependencies
USER root

# Install necessary tools (e.g., git, curl, etc.)
RUN apt-get update && \
    apt-get install -y git curl sudo

# Install the Jenkins plugins you need
# For example, install Git plugin, Docker plugin, etc.
RUN jenkins-plugin-cli --plugins "git docker-workflow"

# Set the user back to Jenkins
USER jenkins

# Expose Jenkins default port (8080)
EXPOSE 8080

# Start Jenkins
ENTRYPOINT ["java", "-jar", "/usr/share/jenkins/jenkins.war"]




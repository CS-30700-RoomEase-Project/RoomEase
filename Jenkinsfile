pipeline {
    agent { docker { image 'node:22.14.0-alpine3.21' } }

    environment {
        GITHUB_CREDENTIALS_ID = 'github-token-room-ease'  // Make sure this matches the credentials ID in Jenkins
        GITHUB_REPO = 'CS-30700-RoomEase-Project/RoomEase'
        BRANCH_NAME = 'main'  // Change this if you're using a different branch
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${env.BRANCH_NAME}"]],
                        userRemoteConfigs: [[
                            url: "https://github.com/${env.GITHUB_REPO}.git",
                            credentialsId: env.GITHUB_CREDENTIALS_ID
                        ]]
                    ])
                }
            }
        }

        stage('Build') {
            steps {
                sh 'node --version'
            }
        }
    }
}

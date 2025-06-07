pipeline {
    agent any

    environment {
        PROJECT_ID = 'passwordgenerator-462008'
        IMAGE_NAME = 'password'
        REGION = 'us-central1'
        SERVICE_NAME = 'password-generator-app'
        GCLOUD_PATH = '"C:\\Users\\lenovo\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud"'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🔨 Building Docker image...'
                bat "docker build -t gcr.io/%PROJECT_ID%/%IMAGE_NAME% ."
            }
        }

        // stage('Authenticate with GCP') {
        //     steps {
        //         echo '🔐 Authenticating with GCP...'
        //         withCredentials([file(credentialsId: 'gcp-service-account-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
        //             bat "%GCLOUD_PATH% auth activate-service-account --key-file=%GOOGLE_APPLICATION_CREDENTIALS%"
        //         }
        //     }
        // }

        stage('Push Docker Image') {
            steps {
                echo '📤 Pushing Docker image to GCR...'
                bat "docker push gcr.io/%PROJECT_ID%/%IMAGE_NAME%"
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                echo '🚀 Deploying to Google Cloud Run...'
                bat """
                %GCLOUD_PATH% config set project %PROJECT_ID%
                %GCLOUD_PATH% config set run/region %REGION%
                %GCLOUD_PATH% run deploy %SERVICE_NAME% \\
                    --image gcr.io/%PROJECT_ID%/%IMAGE_NAME% \\
                    --platform managed \\
                    --allow-unauthenticated
                """
            }
        }
    }
}

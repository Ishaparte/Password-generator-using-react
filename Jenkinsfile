pipeline {
    agent any

    environment {
        PROJECT_ID = 'passwordgenerator-462008'
        IMAGE_NAME = 'password'
        REGION = 'asia-south1'
        SERVICE_NAME = 'password-generator-app'
        GCR_IMAGE_NAME = "gcr.io/passwordgenerator-462008/password"
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
                bat "docker build -t %IMAGE_NAME% ."
            }
        }

        stage('Authenticate with GCP & Push Image') {
            steps {
                withCredentials([file(credentialsId: 'gcp-service-account', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    withEnv(['PATH=C:\\Users\\lenovo\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin;%PATH%']) {
                        bat '''
                            set "PATH=C:\\Program Files\\Docker\\Docker\\resources\\bin;%PATH%"

                            REM Step 1: Authenticate with service account
                            gcloud auth activate-service-account --key-file="%GOOGLE_APPLICATION_CREDENTIALS%"

                            REM Step 2: Set project
                            gcloud config set project %PROJECT_ID%

                            REM Step 3: Authenticate Docker to GCR
                            for /f %%t in ('gcloud auth print-access-token') do docker login -u oauth2accesstoken -p %%t https://gcr.io

                            REM Step 4: Tag and push Docker image
                            docker tag %IMAGE_NAME%:latest %GCR_IMAGE_NAME%
                            docker push %GCR_IMAGE_NAME%
                        '''
                    }
                }
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                withEnv(['PATH=C:\\Users\\lenovo\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin;%PATH%']) {
                    bat '''
                        gcloud config set project %PROJECT_ID%
                        gcloud config set run/region %REGION%
                        gcloud run deploy %SERVICE_NAME% ^
                            --image %GCR_IMAGE_NAME% ^
                            --platform managed ^
                            --allow-unauthenticated
                    '''
                }
            }
        }
    }
}



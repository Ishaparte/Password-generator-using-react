pipeline {
  agent any

  environment {
    PROJECT_ID = "passwordgenerator-462008"
    IMAGE_NAME = "gcr.io/passwordgenerator-462008/password"
    VM_USER = "ishaparte4"
    VM_HOST = "34.47.252.50"
    GCLOUD_PATH = "C:\\Users\\lenovo\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud"
  }

  stages {

    stage('Build Docker Image') {
      steps {
        echo "🔨 Building Docker image..."
        bat "docker build -t %IMAGE_NAME% ."
      }
    }

    stage('Authenticate with GCP') {
      steps {
        echo "🔐 Authenticating with GCP..."
        withCredentials([file(credentialsId: 'gcp-service-account', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
          bat """
          \"%GCLOUD_PATH%\" auth activate-service-account --key-file=%GOOGLE_APPLICATION_CREDENTIALS%
          \"%GCLOUD_PATH%\" config set project %PROJECT_ID%
          \"%GCLOUD_PATH%\" auth configure-docker --quiet
          """
        }
      }
    }

    stage('Push Docker Image to GCP') {
      steps {
        echo "📤 Pushing Docker image to GCP..."
        bat "docker push %IMAGE_NAME%"
      }
    }

    stage('Deploy to GCP VM') {
      steps {
        echo "🚀 Deploying Docker container on GCP VM..."
        sshagent(['gcp-vm-ssh']) {
          bat """
          ssh -o StrictHostKeyChecking=no %VM_USER%@%VM_HOST% ^
            "docker pull %IMAGE_NAME% && ^
             docker stop password || exit 0 && ^
             docker rm password || exit 0 && ^
             docker run -d -p 80:3000 --name password %IMAGE_NAME%"
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deployment completed successfully."
    }
    failure {
      echo "❌ Deployment failed. Check the logs."
    }
  }
}

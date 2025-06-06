pipeline {
  agent any

  environment {
    PROJECT_ID = "passwordgenerator-462008"
    IMAGE_NAME = "gcr.io/passwordgenerator-462008/password"
    VM_USER = "ishaparte4"
    VM_HOST = "34.47.252.50"
  }

  stages {

    stage('Build Docker Image') {
      steps {
        echo "🔨 Building Docker image..."
        sh "docker build -t ${IMAGE_NAME} ."
      }
    }

    stage('Authenticate with GCP') {
      steps {
        echo "🔐 Authenticating with GCP..."
        withCredentials([file(credentialsId: 'gcp-service-account', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
          sh '''
            gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
            gcloud config set project $PROJECT_ID
            gcloud auth configure-docker --quiet
          '''
        }
      }
    }

    stage('Push Docker Image to GCP') {
      steps {
        echo "📤 Pushing Docker image to GCP..."
        sh "docker push ${IMAGE_NAME}"
      }
    }

    stage('Deploy to GCP VM') {
      steps {
        echo "🚀 Deploying Docker container on GCP VM..."
        sshagent(['gcp-vm-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} '
              docker pull ${IMAGE_NAME} &&
              docker stop react-app || true &&
              docker rm react-app || true &&
              docker run -d -p 80:3000 --name react-app ${IMAGE_NAME}
            '
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

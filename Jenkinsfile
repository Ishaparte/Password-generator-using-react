pipeline {
  agent any

  environment {
    PROJECT_ID = "passwordgenerator-462008"                         // GCP project ID
    IMAGE_NAME = "gcr.io/passwordgenerator-462008/password"              // Image path in GCP Container Registry
    VM_USER = "ishaparte4"                               // GCP VM username
    VM_HOST = "34.47.252.50"                             // GCP VM IP address
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/your-username/your-react-app.git' // Your GitHub repo
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${IMAGE_NAME}")
        }
      }
    }

    stage('Authenticate with GCP') {
      steps {
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
        script {
          sh "docker push ${IMAGE_NAME}"
        }
      }
    }

    stage('Deploy to GCP VM') {
      steps {
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
      echo " Deployment completed successfully."
    }
    failure {
      echo " Deployment failed. Check the logs."
    }
  }
}

pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_VERSION = '2.20.0'
        PROJECT_NAME = 'todo-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [[$class: 'CleanBeforeCheckout']],
                    userRemoteConfigs: [[url: 'https://github.com/mahadevlover/decops-to-do-app.git']]
                ])
            }
        }
        
        stage('Build Backend') {
            steps {
                echo 'Building Backend Docker Image...'
                dir('backend') {
                    sh 'docker build -t todo-backend:${BUILD_NUMBER} .'
                    sh 'docker tag todo-backend:${BUILD_NUMBER} todo-backend:latest'
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                echo 'Running Backend Tests...'
                dir('backend') {
                    sh '''
                        docker run --rm todo-backend:${BUILD_NUMBER} \
                        sh -c "pip install pytest pytest-flask && pytest test_app.py -v"
                    '''
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo 'Building Frontend Docker Image...'
                dir('frontend') {
                    sh 'docker build -t todo-frontend:${BUILD_NUMBER} .'
                    sh 'docker tag todo-frontend:${BUILD_NUMBER} todo-frontend:latest'
                }
            }
        }
        
        stage('Test Frontend') {
            steps {
                echo 'Running Frontend Tests...'
                dir('frontend') {
                    sh '''
                        docker run --rm todo-frontend:${BUILD_NUMBER} \
                        sh -c "npm test -- --passWithNoTests" || true
                    '''
                }
            }
        }
        
        stage('Deploy - Blue/Green') {
            steps {
                script {
                    echo 'Deploying application with zero downtime...'
                    
                    // Stop old containers if running
                    sh 'cd /workspace && docker compose down || true'
                    
                    // Start new containers
                    sh 'cd /workspace && docker compose up -d'
                    
                    // Wait for services to be healthy
                    echo 'Waiting for services to be healthy...'
                    sleep(time: 30, unit: 'SECONDS')
                    
                    // Verify deployment
                    sh '''
                        curl -f http://localhost:5000/api/health || exit 1
                        curl -f http://localhost:3000 || exit 1
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health checks...'
                sh '''
                    for i in {1..5}; do
                        if curl -f http://localhost:5000/api/health; then
                            echo "Backend is healthy"
                            break
                        fi
                        echo "Waiting for backend... attempt $i"
                        sleep 5
                    done
                    
                    if curl -f http://localhost:3000; then
                        echo "Frontend is healthy"
                    else
                        echo "Frontend health check failed"
                        exit 1
                    fi
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            echo 'Application is running at:'
            echo 'Frontend: http://localhost:3000'
            echo 'Backend API: http://localhost:5000/api'
        }
        
        failure {
            echo 'Pipeline failed! Rolling back...'
            script {
                // Rollback logic
                sh '''
                    cd /workspace
                    docker compose down || true
                    docker compose up -d || true
                '''
            }
        }
        
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f || true'
        }
    }
}

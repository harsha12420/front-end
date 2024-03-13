pipeline {
agent any
environment {
      BUILD_DEV = 'npm run build-dev'
      BUILD_STAGE = 'npm run build-stage'
      PATH = "/opt/sonar-scanner/bin:$PATH"
    }


stages{
    // Code quality checks
    stage('SonarQube analysis for Feature-Branch') {
            when { 
                expression {return (env.CHANGE_BRANCH ==~ /^(feature|fix|hotfix)\/.*$/) && env.CHANGE_TARGET == 'development' }
             }
            steps {
                   withSonarQubeEnv('INVENTORY_SONAR_HOST_URL') {
                    sh 'sonar-scanner -Dsonar.projectKey=Inventory-manegement-pwa -Dsonar.projectName="Inventory-manegement-pwa" -Dsonar.qualitygate.wait=true -Dsonar.login=37a65383213f0938500ba327bd9f0444fa1c2421 || true'
                    echo "Auto mergening"
                    echo "SOURCE_BRANCH: ${env.CHANGE_BRANCH } ----> TARGET_BRANCH: ${env.CHANGE_TARGET}"
                    sh 'rm -rf inventory-pwa-angular'
                    sh 'git clone git@bitbucket.org-harsha-anadariya:solutionanalystspvtltd/inventory-pwa-angular.git'
                    dir('inventory-pwa-angular')
                    {
                    sh 'git fetch origin'
                    sh 'git branch -a' 
                    sh 'git config --global user.email harsha.anadariya@solutionanalysts.com'
                    sh 'git config --global user.name harsha-anadariya'
                    sh 'git checkout $CHANGE_TARGET' 
                    sh 'git merge origin/$CHANGE_BRANCH'
                    sh 'git push origin $CHANGE_TARGET'
                }
            }
            }
        }   
   
    stage('Build for DEV') {
        when {
            branch 'development'
        }
        steps {
            echo "Build started"
            sh "sed -i 's/build_Command/$BUILD_DEV/g' Dockerfile"
            sh "docker build -t inventory-pwa-angular-image-dev-$BUILD_NUMBER ."
        }
    }  

    stage('Deploying to DEV server') {
        when {
            branch 'development'
        }
        steps {
            echo "Deployment started"
            sh "docker run --name inventory-pwa-angular-container-dev-$BUILD_NUMBER -d inventory-pwa-angular-image-dev-$BUILD_NUMBER"
            sh "docker cp inventory-pwa-angular-container-dev-$BUILD_NUMBER:/app/dist-dev/. ./dist-dev/"
            withAWS(region:'ap-south-1',credentials:'Inventory-Management') {
                   sh "aws s3 sync dist-dev/ s3://dev-inventory-sa/"
                   sh "aws cloudfront create-invalidation --distribution-id E2AXJOFSH296BY --paths '/*'"
               }
            sh "docker rm inventory-pwa-angular-container-dev-$BUILD_NUMBER"
            sh "docker rmi inventory-pwa-angular-image-dev-$BUILD_NUMBER"   
        }
    } 
    
    stage('Build for stage') {
        when {
            branch 'stage'
        }
        steps {
            echo "Build started"
            sh "sed -i 's/build_Command/$BUILD_STAGE/g' Dockerfile"
            sh "docker build -t inventory-pwa-angular-image-stage-$BUILD_NUMBER ."
        }
    }  

    stage('Deploying to stage server') {
        when {
            branch 'stage'
        }
        steps {
            echo "Deployment started"
            sh "docker run --name inventory-pwa-angular-container-stage-$BUILD_NUMBER -d inventory-pwa-angular-image-stage-$BUILD_NUMBER"
            sh "docker cp inventory-pwa-angular-container-stage-$BUILD_NUMBER:/app/dist-stage/. ./dist-stage/"
            withAWS(region:'ap-south-1',credentials:'Inventory-Management') {
                   sh "aws s3 sync dist-stage/ s3://stage-inventory-sa/"
                   sh "aws cloudfront create-invalidation --distribution-id E1JNDZXEFBC3YM --paths '/*'"
               }
            sh "docker rm inventory-pwa-angular-container-stage-$BUILD_NUMBER"
            sh "docker rmi inventory-pwa-angular-image-stage-$BUILD_NUMBER"   
        }
    }

    
    }

}
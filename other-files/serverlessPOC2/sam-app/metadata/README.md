This is a POC to use SAM, in this specific stack I am creating:
-Lambdas
-Roles
-Usage Plan
-Rest Api

Usefull commands:
sam local invoke "function" -e events/event.json
sam local invoke asyncCall --event .\events\event.json
sam local start-api --debug (Corre todos los recursos de apis que haya disponible)
sam validate
sam build (testing) (Needed to use before using local testing)
sam deploy --guided
sam package  --template-file template.yaml --output-template-file sam.yaml --s3-bucket (testing)
sam deploy --template-file sam.yaml --stack-name testv1-sam --capabilities CAPABILITY_IAM
sam deploy --template-file sam.yaml --stack-name testv1-sam --capabilities CAPABILITY_IAM --parameter-overrides  helloWorldDescription="This is a hello world function" ApiVersion=1 EnvironmentName=development TypeDeploy=b
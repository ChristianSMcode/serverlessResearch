Note: For now you can ignore the README.md file (automatically generated with SAM cli and the samconfig.toml file)

Explanation:

As the first part of the demo we will just create a new explicit API with two endpoints with integration type of lambda function with non-proxy-integration and proxy integration, the proxy one will implement Validators for the body, the headers and the querystringparameters (remember that you can also specify path parameters that are mandatory)

I create this folder with name "implicit" meaning that this was going to use implicit resource creation that
SAM provides, however now we can point some of the weaknesses of implicit resource creation such as:
-Limited control over resource configuration (In case of an API we could not define the non-proxy-integration)
-Limited support for advance features of the resources
-etc

So, due to this, even if I called the folder with the word Implicit we will use Explicit resource definition along with implicit resource definition.Since we need some advanced features of API gateway this resource will be defined explicitly but the lambda role for example will still get created implicitly although we could do it explicitly aswell by changing the type from AWS::Serverless::Function for AWS::Lambda::Function however keep in mind that if not necessary it can be better to stick to implicit reource creationg since it reduces the general tecnical overhead.

I then proceeded to create an AWS::Serverless::Api explicit resource and referenced the Api (RestApiId: !Ref ApiGatewayBasics) in the function resource, this way I can have far more control than with implicit resource API creation
Note: Remember that logical names are like variables and can be referenced and even read its properties but
it is different from the REAL name of a resource.

I used the swagger 2.0 api definition to create the API resource, If you dont understand the syntax dont worry
since the swagger 2.0 and 3.0 API definition concepts and syntax will be covered within the guide/additional-guides folder.
Since swagger and AWS are two separated thing there are things called exensions which you can see more about
here: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions.html

To specify non-proxy for the resource I had to use the aws extension (x-amazon-apigateway-integration)
setting the type to 'aws'
Then in the Uri property I specified the following uri:
Fn::Sub: arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${calculatorFunction.Arn}/invocations

That Uri is the endpoint of the backend for integration of the aws service, so we are in fact having two clients processes, we call API gateway and then API gateway calls Lambda, thats why we specified the httpMehtod twice once within the path/function and anotherwant inside the method definition for the specific reosurce.
Notice how in the console it looks like lambda integration has its own non-proxy integration but thats nothing
more that a front end trick since in reality it is aws integration pointing towars lambda service.

IMPORTANT CONSIDERATIONS:
During this demo I realized that local testing doesnt work the intended way while using request validators,
you can define the validators and deploy the stack first then test the validators within AWS API gateway and they will work.Refer to:
"When you run the API locally with sam local start-api, it uses the local Lambda function and API Gateway emulator to handle the requests, which do not enforce request validation by default. This is because the emulator is intended for local development and testing purposes, and the main goal is to provide a simple and fast way to test your API without relying on the cloud resources."
Remember also that even if you can specify the request parameters like this within the function resource:       
- method.request.header.Header-Test
- method.request.querystring.test
It is not very well integrated and it should be easier as well as better configurable to do it within the API resource.This is due to if the RestApiId, if is provided then the ResquesParameters will get ignore resulting in, that this property only works for implicit API resource creation, you can see an example of this in the LambdaBasicsDemo demo where the api gets in fact created implicitly

General considarions:
Example on how to call the endpoint/resource is within the postman collection in which you can see the url and path/query parameters.

Note that you can send a body within a GET request in local testing but it is not recomended, use POST instead since some proxys,services or firewalls could not work with a body included withing a GET request and this is the case when using API gateway

You can find more about SAM here:
-https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started.html

Instructions:
Note: This first two steps are a brief overview of what I did to create the SAM template/project
you don't need to do it and in the guide folder there is a file in which I explain in detail the features of
SAM and CFN.

1-run: sam init
(remember you need to have sam installed on your local environment)
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
sam has some prerequisites to run, most of them are optional since they are to use some local testing features
of sam within docker containers on your local environment but I recomend to follow the complete intallation in the link above.

2-Answer the promps with the desired configuration, in my case it was:
-AWS Quick Start Templates
-Hello world Example
-N
-13 (node 16.x)
-1 (zip)
-1 (Hello world Example)
-N
-y
-GatewayBasicsSAM

The following steps are so you can deploy the sam template and test it locally 
(local testing only available if you followd the SAM cli prerequisites and installed docker)

1- To test each function by itself locally sit on the root directory of the SAM project and run:
sam local invoke <logicalFunctionName> -e .\events\<eventFunction>.json
This will invoke the logical name of the function you have in the template.yaml file and will use the -e flag to specify a test event which you can find inside the events folder (remeber that you need to allow docker to share the volumes of your pc, generally you get prompted automatically otherwise I will include a link in the references/important-links.txt file)

2-We will test this demo with implicit API resource creation.
https://github.com/awslabs/serverless-application-model/blob/master/docs/internals/generated_resources.rst#api

To test the function and the api locally run the following command.
sam local start-api --debug or sam local start-api

Note: You can create resources implicitlly not implicitlly and also, implicitlly and not implicitlly at the 
same time, I will detail this cases in the main demo of the repo.

It will give you an ip with a port, use postman to test the path which is used to call our function:
Example(this path is specified in the template.yaml file within the definition of our resources):
Running on http://127.0.0.1:3000

Note: Within the repo there is a folder called postman which will contain an exported json of the collection
I use through the demo, you can import it into your postman if you want, remember to create an environment
for the collection and create the variable host.

3-sam package  --template-file template.yaml --output-template-file sam.yaml --s3-bucket <bucket-name>
Note: the --s3-bucket flag should only be used if you want to specify a bucket in line otherwise check
you samconfig.toml file, otherwise a default bucket would be created automatically.
This command will transform your template.yaml file to another SAM yaml file which will have some variables
resolved like the implicit resources or the URI of the function code that will no longer be on our local computer but an s3 bucket which you must create before running this command.( I will explain all the details about sam in the SAM guide )

4-To deploy the stack run the following command:
sam deploy --template-file <the file created on step 3> --stack-name <YOUR STACK NAME>

5-Once you run the command you can go and check CloudFormation console to see the status of the stack you are
creating, alternativelly you can see the outputs in the terminal.

6-Once everything gets created succesfully you can go and check that a new Api was created and test it.
I will not cover how to test it since the documents within the guide folder should give you enough understanding on how to do it

7-After testing remember to delete the stack from CFN and the bucket so you keep your environment in a clean status. (this is optional since most of the demos will be build on top of each other and redeploying a sam file will just update the resources from a stack)

Aditionally: Keep in mind that this was a really brief demo and the purpose was not to go full detail into CFN
or SAM and instead you should be focusing only in the behaviour of the lambda and the Api Gateway services
deployed through this demo.
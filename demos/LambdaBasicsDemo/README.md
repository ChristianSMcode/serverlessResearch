Note: For now you can ignore the README.md file (automatically generated with SAM cli and the samconfig.toml file)

We will deploy a simple API Gateway API and one single lambda function.The API gateway resource will use a GET method and it will be 
implemented as la lambda proxy invocation.
The function will just print/return a simple hello world in different languages depending on the path, query parameters and body request.
Example on how to call the endpoint/resource is within the postman collection in which you can see the url and path/query parameters.

We will be using async/await syntax and also the moment library just to get familiar with the use of external packages 
within the Serverless lambda architecture.

Note that you can send a body within a GET request in local testing but it is not recomended, use POST instead since
some proxys,services or firewalls could not work with a body included withing a GET request and this is the case
when using API gateway

You can find more about SAM here:
-https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started.html

Instructions:

Note: This first two steps are a brief overview of what I did to create the SAM template/project
you don't need to do it and in the guide folder there is a file in which I explain in detail the features of
SAM and CFN.
========================================================================================================================================================
1-run: sam init
(remember you need to have sam installed on your local environment https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
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
-LambdaBasicsSAM
=======================================================================================================================================================
The following steps are so you can deploy the sam template and test it locally (local testing only available
if you followd the SAM cli prerequisites and installed docker).

1- To test the function by itself locally sit on the root directory of the SAM project and run:
sam local invoke "multiHellorWorld" -e .\events\multiHelloWorldTestEvent.json
This will invoke the logical name of the function you have in the template.yaml file and will use the -e flag to
specify a test event which you can find inside events folder.(remeber that you need to allow docker to share the volumes of your pc,
generally you get prompted automatically otherwise I will include a link in the references/important-links.txt file)

2-With the use we have specified on our template.yaml file an Api gateway resource will be created implicitly
https://github.com/awslabs/serverless-application-model/blob/master/docs/internals/generated_resources.rst#api
To test the function and the api locally run the following command.
sam local start-api --debug or sam local start-api

Note: You can create resources implicitlly not implicitlly and also implicitlly and not implicitlly at the 
same time, I will detail this cases in the main demo of the repo.

It will give you an ip with a port, use postman to test the path which is used to call our function:
Example(this path is specified in the template.yaml file within the definition of our resources):
Running on http://127.0.0.1:3000/helloMulti/{name}

Note: Within the repo there is a folder called postman which will contain an exported json of the collection
I use through the research, you can import it into your postman if you want, remember to create an environment
for the collection and create the variable host.

3-(This step I had to do it but if youre just trying to run the demo this step is not necesary)
sam package  --template-file template.yaml --output-template-file sam.yaml --s3-bucket <bucket-name>
Note: the --s3-bucket flag should only be used if you want to specify a bucket in line otherwise check
you samconfig.toml file, otherwise a default bucket would be created. 
automatically.
This command will transform your template.yaml file to another SAM yaml file which will have some variables
resolved like the implicit resources or the URI of the function code that will no longer be on our local computer but an s3 bucket
which you must create before running this command.( I will explain all the details about sam in the SAM guide )

Note: This is very related to the samconfig.toml file which I will explain in detail within the
SAM guide document.

4-To deploy the stack run the following command:
sam deploy --template-file <the file created on step 3> --stack-name <YOUR STACK NAME>

5-Once you run the command you can go and check CloudFormation console to see the status of the stack you are
creating, alternativelly you can see the outputs in the terminal.

6-Once everything gets created succesfully you can go and check that a new Api was created and test it.
I will not cover how to test it since the documents within the guide folder should give you enough understanding
on how to do it

7-After testing remember to delete the stack from CFN and the bucket so you keep your environment in a clean status.
(this is optional since most of the demos will be build on top of each other and redeploying a sam file will just
update the resources from a stack)

Aditionally: Keep in mind that this was a really brief demo and the purpose was not to go full detail into CFN
or SAM and instead you should be focusing only in the behaviour of the lambda and the Api Gateway services
deployed through this demo.
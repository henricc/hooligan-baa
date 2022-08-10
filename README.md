# Hooligan Backend Assessment

This repository contains everything related to my solution for the Hooligan Backend Assessment

## Description

This solution consists of an API Gateway Endpoint that sends requests to a Node.js Lambda function to handle the requests. 

The concept of this solution brings in the creation of a DynamoDB table that keeps track of all current active streams through means outside of the scope of this solution. 
In this table each record represents an active stream partitioned by a *userId* joined by a unique *streamId* to form a composite primary key.

The Lambda function performs a query on the DynamoDB table with the *userId* to return the number of records for that *userId* which represents the number of active streams. From there the Lambda returns an object specifying if another stream is allowed or not. 

## Instructions

This project consists of 4 parts:

* Node.js source code
* Node.js tests
* Terraform (AWS)
* dockerfile

### Terraform - AWS

For a full readme on the infrastructure navigate to the *README.md* file in the *aws-terraform* folder.

1. Navigate to *aws-terraform* folder.
2. In terraform.tfvars feel free to change the *project_name* and the *table_items* variables.
3. run the following commands
   1. terraform init
   2. terraform plan
   3. terraform apply
5. Once done the *terraform destroy* can be run to destroy all the resources created. 

To obtain the API endpoint:

1. The terminal output on the Terraform apply should provide the following outputs:
   1. api endpoint
   2. 3 example urls to call the API
2. Should you not see the outputs or want to obtain it again run the following command:
   1. terraform output

### Docker

The successful use of docker to run the Node.js code requires the Terraform resources to be created. Without which only the tests will run as they use mock services.

To run the tests use the following commands:
1. docker build -t <project_name> . 
   - docker build -t hooli-baa .  
2. docker run \
-e AWS_ACCESS_KEY_ID=<access_key_id> \
-e AWS_SECRET_ACCESS_KEY=<secret_access_key> \
<project_name>

To run the lambda code use the following steps:
1. In the dockerfile comment out the last line containing *CMD npm test*
2. Re-build and re-run it with the above commands.

To change the *userId* being called: in *./source/event_1.json* change the *userId* value, re-build, then re-run the dockerfile. 

### Run locally (NO Docker)

To run the code locally you can use the following command (should you have all dependencies installed and AWS configured):
* npm run locally
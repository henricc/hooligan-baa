# Hooligan Backend Assessment - Terraform (AWS)


## Terraform

Required version: ~> 0.14

## Providers

| Name | Version |
| ---- | ------- |
| aws  | ~> 4    |


## Inputs 

| Name          | Type          | Description                                                                                                                                               |
| --------------| ------------- | --------------------------------------------------------- |
| project_name  | string        | Name for the project.                                     |          
| table_items   | list(string)  | List containing all items to be added to DynamoDB Table   |


## Outputs

| Name              | Description                                   |
| ----------------- | ----------------------------------------------|
| api_endpoint      | API Endpoint for calling Lambda               |
| example_user_1    | API Endpoint for calling Lambda with userId=1 |
| example_user_2    | API Endpoint for calling Lambda with userId=2 |
| example_user_3    | API Endpoint for calling Lambda with userId=3 |

## Data Resources

This module calls data resources that are used inside the module.

| Name                | Description                                        |
| ------------------- | -------------------------------------------------- |
| aws_region          | Obtain current region as configured in the CLI     |
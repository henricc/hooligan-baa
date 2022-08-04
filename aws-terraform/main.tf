

locals {

  region               = data.aws_region.current.name
  lambda_code_filename = "${var.project_name}-lambda-code.zip"
  table_name           = "${var.project_name}-table"
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-role"

  assume_role_policy = file("${path.module}/iam-templates/trust.json")

  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]

  inline_policy {
    name   = "dynamodb-policy"
    policy = templatefile("${path.module}/iam-templates/policy.json", { "table_name" : local.table_name })
  }
}


# create zip file of lambda code
data "archive_file" "zip_lambda_code" {

  type        = "zip"
  output_path = "${path.module}/${local.lambda_code_filename}"
  source {
    filename = "index.js"
    content  = file("${path.module}/../source/index.js")
  }
}


resource "aws_lambda_function" "api_lambda" {

  function_name = "${var.project_name}-lambda"

  runtime = "nodejs16.x"
  handler = "index.handler"
  role    = aws_iam_role.lambda_role.arn

  timeout = 15

  filename         = local.lambda_code_filename
  source_code_hash = filebase64sha256("${path.module}/${local.lambda_code_filename}")

  environment {
    variables = {
      "tableName" = local.table_name
    }
  }
}

resource "aws_lambda_permission" "invoke_from_apigw" {

  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.id
  principal     = "apigateway.amazonaws.com"
}


resource "aws_dynamodb_table" "table" {
  name = "${var.project_name}-table"

  hash_key  = "userId"
  range_key = "streamId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "streamId"
    type = "S"
  }

  read_capacity  = 1
  write_capacity = 1

}

resource "aws_dynamodb_table_item" "table_items" {
  count = length(var.table_items)

  table_name = aws_dynamodb_table.table.name
  hash_key   = aws_dynamodb_table.table.hash_key
  range_key  = aws_dynamodb_table.table.range_key

  item = jsonencode(
    {
      "userId" : { "S" : var.table_items[count.index] },
      "streamId" : { "S" : "${var.table_items[count.index]}_stream_${count.index}" },
      "activeFrom" : { "S" : "0000-00-00 00-00 ${count.index}" }
    }
  )
}

resource "aws_api_gateway_rest_api" "api" {
  name = "${var.project_name}-api"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "dev"
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  depends_on = [
    aws_api_gateway_method.api_method,
    aws_api_gateway_integration_response.api_integration_response,
    aws_api_gateway_method_response.api_response_200,
    aws_api_gateway_resource.api_resource,
    aws_api_gateway_integration.api_integration

  ]


  lifecycle {
    create_before_destroy = true
  }


  triggers = {

    value = "test"

    redeployment = sha1(jsonencode([

      timestamp()

    ]))


  }
}

resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "newstreamrequest"
}

# Method 
resource "aws_api_gateway_method" "api_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.querystring.userId" = true
  }
}

# Integration 
resource "aws_api_gateway_integration" "api_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.api_resource.id
  http_method             = aws_api_gateway_method.api_method.http_method
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:${local.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.api_lambda.arn}/invocations"

  request_templates = {
    "application/json" = <<EOF
#set($inputRoot = $input.path('$'))
{
  "userId": "$input.params('userId')"

}
EOF

  }

  passthrough_behavior = "WHEN_NO_TEMPLATES" # required when request_templates are used

  request_parameters = {
    "integration.request.querystring.userId" = "method.request.querystring.userId"
  }

  cache_key_parameters = [
    "method.request.querystring.userId",
  ]

}

# Method Response 
resource "aws_api_gateway_method_response" "api_response_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = aws_api_gateway_method.api_method.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }
  # response_parameters = {
  #   "method.response.header.Access-Control-Allow-Origin" = false
  # }
}


# Integration Response 
resource "aws_api_gateway_integration_response" "api_integration_response" {

  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = aws_api_gateway_method.api_method.http_method
  status_code = aws_api_gateway_method_response.api_response_200.status_code

  # response_parameters = {
  #   "method.response.header.Access-Control-Allow-Origin" = "'*'"
  # }

}

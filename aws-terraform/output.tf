output "api_endpoint" {
  value = "${aws_api_gateway_stage.api_stage.invoke_url}${aws_api_gateway_resource.api_resource.path}"
}

output "example_user_1" {
  value = "${aws_api_gateway_stage.api_stage.invoke_url}${aws_api_gateway_resource.api_resource.path}?userId=user_1"
}

output "example_user_2" {
  value = "${aws_api_gateway_stage.api_stage.invoke_url}${aws_api_gateway_resource.api_resource.path}?userId=user_2"
}

output "example_user_3" {
  value = "${aws_api_gateway_stage.api_stage.invoke_url}${aws_api_gateway_resource.api_resource.path}?userId=user_3"
}
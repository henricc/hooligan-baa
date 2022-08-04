
variable "project_name" {
  type        = string
  description = "Name for the project."
}

variable "table_items" {
  type        = list(string)
  description = "List containing all items to be added to DynamoDB Table"
}

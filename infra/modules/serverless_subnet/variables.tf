variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "vpc_name" {
  type        = string
  description = "Existing VPC to attach the subnet to."
}

variable "subnet_name" {
  type = string
}

variable "subnet_cidr" {
  type = string
}

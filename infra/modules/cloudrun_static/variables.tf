variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "service_name" {
  type = string
}

variable "app_container_image" {
  type        = string
  description = "Fully qualified Artifact Registry image URL to deploy."
}

variable "service_account_email" {
  type        = string
  description = "Existing runtime service account for the Cloud Run service."
}

variable "serverless_subnet_id" {
  type = string
}

variable "container_port" {
  type    = number
  default = 8080
}

variable "common_labels" {
  type = map(string)
}

variable "project_id" {
  type        = string
  description = "The GCP project ID to deploy resources into."
}

variable "region" {
  type        = string
  description = "The GCP region to deploy resources into."
}

variable "app_container_image" {
  type        = string
  description = "The Docker image URL to deploy"
}

variable "deploy_service_account_email" {
  type        = string
  description = "CI/CD service account that builds the frontend image and must be able to read the frontend secret."
}

variable "common_labels" {
  type        = map(string)
  description = "Common labels applied to resources that support them."
  default = {
    app        = "portfolio"
    env        = "production"
    managed-by = "terraform"
    project    = "portfolio"
  }
}

variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "secret_id" {
  type        = string
  description = "Secret Manager secret ID to create, e.g. basicragapp-secrets."
}

variable "accessor_service_account_email" {
  type        = string
  description = "Service account that must be able to read the secret (Cloud Run runtime SA or a CI/CD deploy SA)."
}

variable "common_labels" {
  type = map(string)
}

variable "project_id" {
  type        = string
  description = "The GCP project ID to deploy resources into."
}

variable "region" {
  type        = string
  description = "The GCP region to deploy the Cloud Function into."
}

variable "zone" {
  type        = string
  description = "The GCP zone the Qdrant VM lives in (passed to the function as VM_ZONE)."
}

variable "vm_name" {
  type        = string
  description = "Name of the Qdrant Compute Engine instance to start (passed to the function as VM_NAME)."
}

variable "function_name" {
  type        = string
  description = "Name of the 2nd gen Cloud Function."
  default     = "start-qdrant-vm"
}

variable "service_account_id" {
  type        = string
  description = "account_id for the dedicated service account the function runs as."
  default     = "qdrant-vm-starter-sa"
}

variable "common_labels" {
  type        = map(string)
  description = "Common labels applied to resources that support them."
  default     = {}
}

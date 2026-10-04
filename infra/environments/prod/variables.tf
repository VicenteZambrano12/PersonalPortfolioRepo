variable "project_id" {
  type        = string
  description = "The GCP project ID to deploy resources into."
}

variable "region" {
  type        = string
  description = "The GCP region to deploy resources into."
}

variable "zone" {
  type        = string
  description = "The GCP zone to deploy zonal resources (e.g. Compute Engine VMs) into."
  default     = "europe-southwest1-a"
}

variable "qdrant_vm_name" {
  type        = string
  description = <<-EOT
    Name of the existing Qdrant Compute Engine instance (confirmed:
    "qdrant-vm", in europe-southwest1-a / Madrid). That VM, including its
    idle-shutdown startup script, is created and managed by the
    BasicRAGapp repo's Terraform state; this repo only reads it via a
    data source. Override via TF_VAR_qdrant_vm_name / terraform.tfvars if
    it's ever renamed.
  EOT
  default     = "qdrant-vm"
}

variable "app_container_image" {
  type        = string
  description = "The Docker image URL to deploy"
}

variable "common_labels" {
  type        = map(string)
  description = "Common labels applied to resources that support them."
  default = {
    app        = "basicragapp"
    env        = "prod"
    managed-by = "terraform"
    project    = "portfolio"
  }
}

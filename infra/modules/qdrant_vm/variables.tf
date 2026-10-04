variable "project_id" {
  type        = string
  description = "The GCP project ID to deploy resources into."
}

variable "zone" {
  type        = string
  description = "The GCP zone the Qdrant VM lives in (europe-southwest1-a in Madrid)."
}

variable "vm_name" {
  type        = string
  description = <<-EOT
    Name of the existing Compute Engine instance hosting Qdrant. This VM
    (and its idle-shutdown startup script) is created and owned by the
    BasicRAGapp repo's Terraform state; this module only reads it via a
    data source for outputs like its internal IP, it never creates,
    destroys, or mutates it.
    Populate via TF_VAR_qdrant_vm_name / terraform.tfvars.
  EOT
  default     = "qdrant-vm"
}

variable "common_labels" {
  type        = map(string)
  description = "Common labels applied to resources that support them."
  default     = {}
}

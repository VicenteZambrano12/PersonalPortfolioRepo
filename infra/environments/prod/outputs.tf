output "cloud_run_url" {
  value = module.cloudrun.cloud_run_url
}

output "qdrant_vm_starter_function_url" {
  description = "Public HTTPS URL the React frontend calls to wake the Qdrant VM."
  value       = module.qdrant_vm_starter.cloud_function_url
}

output "qdrant_vm_starter_service_account_email" {
  description = "Copy this into the gcloud IAM grant commands (infra/scripts/grant_vm_starter_permissions.sh)."
  value       = module.qdrant_vm_starter.service_account_email
}

output "cloud_function_url" {
  description = "HTTPS trigger URL the public React frontend calls to start the Qdrant VM."
  value       = google_cloudfunctions2_function.start_vm.service_config[0].uri
}

output "service_account_email" {
  description = "Email of the dedicated Cloud Function service account. Copy this into the gcloud IAM grant commands."
  value       = google_service_account.vm_starter.email
}

output "function_name" {
  value = google_cloudfunctions2_function.start_vm.name
}

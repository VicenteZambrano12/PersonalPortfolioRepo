output "project_id" {
  description = "Google Cloud project containing the Identity Platform configuration."
  value       = google_identity_platform_config.this.project
}

output "config_id" {
  description = "Resource ID of the Identity Platform configuration."
  value       = google_identity_platform_config.this.id
}

output "authorized_domains" {
  description = "Hostnames authorized for authentication redirects."
  value       = google_identity_platform_config.this.authorized_domains
}

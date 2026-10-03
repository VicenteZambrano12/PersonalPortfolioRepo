output "cloud_run_url" {
  value = module.cloudrun.cloud_run_url
}

output "frontend_secret_id" {
  value = module.secrets.secret_id
}

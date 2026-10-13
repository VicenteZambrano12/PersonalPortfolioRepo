output "cloud_run_url" {
  value = module.cloudrun.cloud_run_url
}

output "frontend_secret_id" {
  value = module.secrets.secret_id
}

output "login_url" {
  value = "${module.cloudrun.cloud_run_url}/login"
}

output "identity_platform_config_id" {
  value = module.identity_platform.config_id
}

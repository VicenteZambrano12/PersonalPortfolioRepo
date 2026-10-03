locals {
  # Pre-existing Cloud Run runtime SA, created manually in the console (not Terraform-managed).
  cloud_run_service_account_email = "portfolio-repo-sa@basicrahgapp.iam.gserviceaccount.com"
}

module "networking" {
  source      = "../../modules/serverless_subnet"
  project_id  = var.project_id
  region      = var.region
  vpc_name    = "portfolio-demo-vpc"
  subnet_name = "portfolio-serverless-subnet"
  # /26 minimum for Cloud Run Direct VPC egress (instances + rolling-deploy headroom)
  subnet_cidr = "10.0.3.0/26"
}

module "cloudrun" {
  source                 = "../../modules/cloudrun_static"
  project_id             = var.project_id
  region                 = var.region
  service_name           = "portfolio"
  app_container_image    = var.app_container_image
  service_account_email  = local.cloud_run_service_account_email
  serverless_subnet_id   = module.networking.subnet_id
  common_labels          = var.common_labels
}

module "secrets" {
  source                          = "../../modules/secrets"
  project_id                      = var.project_id
  region                          = var.region
  secret_id                       = "portfolio-frontend-secrets"
  accessor_service_account_email  = var.deploy_service_account_email
  common_labels                   = var.common_labels
}

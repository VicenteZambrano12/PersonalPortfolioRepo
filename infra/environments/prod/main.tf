locals {
  # Pre-existing Cloud Run runtime SA, created manually in the console (not Terraform-managed).
  cloud_run_service_account_email = "basicragapp-app@basicrahgapp.iam.gserviceaccount.com"
  # Shared portfolio-repo-sa identity (same one this repo's Terraform/CI runs
  # as) reused as the Cloud Function's runtime SA — no dedicated SA is created.
  qdrant_vm_starter_service_account_email = "portfolio-repo-sa@basicrahgapp.iam.gserviceaccount.com"
}

module "artifact_registry" {
  source        = "../../modules/artifact_registry"
  project_id    = "basicrahgapp"
  location      = "europe-southwest1"
  repository_id = "portfolio-repo"
  common_labels = var.common_labels
}
module "networking" {
  source                 = "../../modules/networking"
  project_id             = var.project_id
  region                 = var.region
  vpc_name               = "portfolio-demo-vpc"
  serverless_subnet_cidr = "10.0.2.0/24"
  common_labels          = var.common_labels
}
module "storage" {
  source        = "../../modules/storage"
  project_id    = var.project_id
  region        = var.region
  common_labels = var.common_labels
}

module "secrets" {
  source                          = "../../modules/secrets"
  project_id                      = var.project_id
  region                          = var.region
  secret_id                       = "basicragapp-secrets"
  accessor_service_account_email  = local.cloud_run_service_account_email
  common_labels                   = var.common_labels
}

module "qdrant_vm" {
  source        = "../../modules/qdrant_vm"
  project_id    = var.project_id
  zone          = var.zone
  vm_name       = var.qdrant_vm_name
  common_labels = var.common_labels
}

module "qdrant_vm_starter" {
  source                 = "../../modules/qdrant_vm_starter"
  project_id             = var.project_id
  region                 = var.region
  zone                   = module.qdrant_vm.zone
  vm_name                = module.qdrant_vm.vm_name
  service_account_email  = local.qdrant_vm_starter_service_account_email
  common_labels          = var.common_labels
}

module "cloudrun" {
  source                = "../../modules/cloudrun"
  project_id            = var.project_id
  region                = var.region
  serverless_subnet_id  = module.networking.serverless_subnet_id
  qdrant_internal_ip    = module.qdrant_vm.qdrant_internal_ip
  app_container_image   = var.app_container_image
  service_account_email = local.cloud_run_service_account_email
  secret_id             = module.secrets.secret_id
  common_labels         = var.common_labels
}
import {
  id = "projects/basicrahgapp/locations/europe-southwest1/repositories/portfolio-repo"
  to = module.artifact_registry.google_artifact_registry_repository.default
}
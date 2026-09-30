data "google_compute_network" "default" {
  project = var.project_id
  name    = var.vpc_name
}

resource "google_compute_subnetwork" "this" {
  project                  = var.project_id
  name                     = var.subnet_name
  region                   = var.region
  network                  = data.google_compute_network.default.id
  ip_cidr_range            = var.subnet_cidr
  private_ip_google_access = true
}

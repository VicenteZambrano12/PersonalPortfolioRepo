resource "google_cloud_run_v2_service" "this" {
  name                = var.service_name
  location            = var.region
  ingress             = "INGRESS_TRAFFIC_ALL"
  deletion_protection = false

  labels = merge(var.common_labels, { component = "frontend" })

  template {
    service_account = var.service_account_email

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    containers {
      image = var.app_container_image

      ports {
        container_port = var.container_port
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    vpc_access {
      network_interfaces {
        subnetwork = var.serverless_subnet_id
      }
      egress = "PRIVATE_RANGES_ONLY"
    }
  }
}

resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.this.location
  project  = var.project_id
  service  = google_cloud_run_v2_service.this.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

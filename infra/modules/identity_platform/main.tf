terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.0, < 9.0"
    }
  }
}

resource "google_project_service" "identitytoolkit" {
  project            = var.project_id
  service            = "identitytoolkit.googleapis.com"
  disable_on_destroy = false
}

resource "google_identity_platform_config" "this" {
  project            = var.project_id
  authorized_domains = var.authorized_domains

  sign_in {
    email {
      enabled           = true
      password_required = true
    }

    anonymous {
      enabled = false
    }
  }

  client {
    permissions {
      disabled_user_signup   = true
      disabled_user_deletion = true
    }
  }

  depends_on = [google_project_service.identitytoolkit]
}

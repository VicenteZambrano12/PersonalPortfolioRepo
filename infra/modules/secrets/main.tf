resource "google_secret_manager_secret" "app_secrets" {
  secret_id = var.secret_id
  labels    = merge(var.common_labels, { component = "secrets" })

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "accessor" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.app_secrets.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.accessor_service_account_email}"
}

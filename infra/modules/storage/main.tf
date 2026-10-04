# Minimal placeholder: a single private bucket for general app storage
# (e.g. user-uploaded assets, exports). No other module currently
# consumes its outputs — extend this as real storage needs emerge.
resource "google_storage_bucket" "app_storage" {
  project                     = var.project_id
  name                        = var.bucket_name
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false
  labels                      = merge(var.common_labels, { component = "storage" })
}

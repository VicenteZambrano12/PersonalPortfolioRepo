output "bucket_name" {
  value = google_storage_bucket.app_storage.name
}

output "bucket_url" {
  value = google_storage_bucket.app_storage.url
}

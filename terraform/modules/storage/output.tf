output "function_bucket_name" {
  value = google_storage_bucket.function_bucket.name
}

output "archive_name" {
  value = google_storage_bucket_object.archive.name
}
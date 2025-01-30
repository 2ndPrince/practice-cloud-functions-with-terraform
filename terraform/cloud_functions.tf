resource "google_cloudfunctions2_function" "default" {
  name        = "collect-orders-${var.commit_hash}"
  location    = "us-central1"
  description = "A function that returns the current time"

  build_config {
    runtime     = "nodejs22"
    entry_point = "collectOrdersFunction"
    source {
      storage_source {
        bucket = module.storage.function_bucket_name
        object = module.storage.archive_name
      }
    }
  }

  service_config {
    service_account_email = google_service_account.backend_service.email
    max_instance_count    = 1
    available_memory      = "256M"
    timeout_seconds       = 60
  }

  lifecycle {
    create_before_destroy = true
    replace_triggered_by  = [module.storage.archive_name]
  }
}

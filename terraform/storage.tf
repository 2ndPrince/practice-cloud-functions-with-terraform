resource "random_id" "default" {
  byte_length = 8
}

resource "google_storage_bucket" "function_bucket" {
  name                        = "practice-function-${random_id.default.hex}"
  location                    = var.project_region
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "archive" {
  name   = "function.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = "../function.zip" # Use the pre-built archive from github workflow
}
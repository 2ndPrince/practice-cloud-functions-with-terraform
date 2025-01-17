terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.34.0"
    }
  }
  required_version = ">= 1.0"
}

provider "google" {
  project = var.project_id
  region  = var.project_region
  zone    = var.project_zone
}

resource "google_storage_bucket" "function_bucket" {
  name          = "${var.project_id}-function-bucket"
  location      = var.project_region
  force_destroy = true
}

resource "google_cloudfunctions_function" "current_time" {
  name                  = "current-time-function"
  description           = "A function that returns the current time"
  runtime               = "nodejs16"
  source_archive_bucket = google_storage_bucket.function_bucket.name
  source_archive_object = "${google_storage_bucket_object.archive.name}"
  entry_point           = "currentTime"
  trigger_http          = true
  https_trigger_security_level = "SECURE_ALWAYS"
}

resource "google_storage_bucket_object" "archive" {
  name   = "function-source.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = "${path.module}/dist.zip"
}

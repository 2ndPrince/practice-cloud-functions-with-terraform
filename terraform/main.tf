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

resource "google_cloudfunctions2_function" "current_time" {
  name        = "current-time-function-gen2"
  location    = "us-central1"
  description = "A function that returns the current time"

  build_config {
    runtime     = "nodejs22"
    entry_point = "currentTime" # Set the entry point
    source {
      storage_source {
        bucket = google_storage_bucket.function_bucket.name
        object = google_storage_bucket_object.archive.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
  }
}

resource "google_storage_bucket_object" "archive" {
  name   = "function-source.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = "../dist/function.zip"
}

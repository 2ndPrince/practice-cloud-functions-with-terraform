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

resource "random_id" "default" {
  byte_length = 8
}

resource "google_storage_bucket" "function_bucket" {
  name          = "practice-function-${random_id.default.hex}"
  location      = var.project_region
  uniform_bucket_level_access = true
}

data "archive_file" "default" {
  type        = "zip"
  output_path = "/tmp/function-source.zip"
  source_dir  = "../dist"
}
resource "google_storage_bucket_object" "archive" {
  name   = "function-source.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = data.archive_file.default.output_path
}

resource "google_cloudfunctions2_function" "default" {
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

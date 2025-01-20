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
  name                        = "practice-function-${random_id.default.hex}"
  location                    = var.project_region
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

data "google_service_account" "github_actions" {
  account_id = "github-actions-sa"
}

resource "google_project_iam_member" "github_actions_sa_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${data.google_service_account.github_actions.email}"
}

resource "google_project_iam_member" "github_actions_sa_admin" {
  project = var.project_id
  role    = "roles/iam.serviceAccountAdmin"
  member  = "serviceAccount:${data.google_service_account.github_actions.email}"
}

resource "google_cloudfunctions2_function" "default" {
  name        = "current-time"
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
    service_account_email = data.google_service_account.github_actions.email
    max_instance_count    = 1
    available_memory      = "256M"
    timeout_seconds       = 60
  }

  lifecycle {
    create_before_destroy = true
    replace_triggered_by  = [google_storage_bucket_object.archive]
  }
}

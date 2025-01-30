terraform {
  backend "gcs" {
    bucket  = var.terraform_state_bucket_name
    prefix  = "terraform/state"
  }

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

resource "google_storage_bucket" "terraform_state" {
    name                        = var.terraform_state_bucket_name
    location                    = var.project_region
    uniform_bucket_level_access = true
}

resource "google_firestore_database" "default" {
  name     = "(default)"
  location_id = "nam5"
  type = "FIRESTORE_NATIVE"
}

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

resource "google_service_account" "backend_service" {
  account_id   = "backend-service-sa"
  display_name = "Backend Service Account"
}

resource "google_project_iam_member" "github_actions_sa_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.backend_service.email}"
}

resource "google_project_iam_member" "github_actions_sa_admin" {
  project = var.project_id
  role    = "roles/iam.serviceAccountAdmin"
  member  = "serviceAccount:${google_service_account.backend_service.email}"
}

resource "google_project_iam_member" "github_actions_firestore_admin" {
  project = var.project_id
  role    = "roles/datastore.owner"
  member  = "serviceAccount:${google_service_account.backend_service.email}"
}

resource "google_cloudfunctions2_function" "default" {
  name        = "collect-orders-${var.commit_hash}"
  location    = "us-central1"
  description = "A function that returns the current time"

  build_config {
    runtime     = "nodejs22"
    entry_point = "collectOrdersFunction"
    source {
      storage_source {
        bucket = google_storage_bucket.function_bucket.name
        object = google_storage_bucket_object.archive.name
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
    replace_triggered_by  = [google_storage_bucket_object.archive]
  }
}

#### triggering

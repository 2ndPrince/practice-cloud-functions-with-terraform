terraform {
  backend "gcs" {
    bucket  = "terraform-state-bucket-augmented-pager-448118-m6"
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

resource "google_storage_bucket_object" "archive" {
  name   = "function.zip"
  bucket = module.storage.function_bucket_name
  source = "../function.zip"
}

module "storage" {
  source = "./modules/storage"
  project_region = var.project_region
}

resource "google_firestore_database" "default" {
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"
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
        bucket = module.storage.function_bucket_name
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

output "function_uri" {
  value = google_cloudfunctions2_function.default.service_config[0].uri
}

#### triggering ..

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

resource "google_storage_bucket_object" "archive" {
  name   = "function.zip"
  bucket = module.storage.function_bucket_name
  source = "../function.zip"
}

module "storage" {
  source = "./modules/storage"
  project_region = var.project_region
}

#### triggering ..

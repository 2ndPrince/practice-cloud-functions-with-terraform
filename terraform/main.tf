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

module "storage" {
  source = "./modules/storage"
  project_region = var.project_region
  source_path = "../../../function.zip"
}

#### triggering ..

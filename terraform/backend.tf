terraform {
  backend "gcs" {
    bucket = "terraform-state-bucket-augmented-pager-448118-m6"
    prefix = "terraform/state"
  }
}
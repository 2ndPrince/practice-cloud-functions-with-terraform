variable "project_id" {
  description = "The project ID"
  type        = string
  default     = "augmented-pager-448118-m6"
}

variable "project_region" {
  default = "us-central1"
}

variable "project_zone" {
  default = "us-central1-c"
}

variable "commit_hash" {
  description = "The commit hash being appended to cloud function name for version controls with zero downtime"
  type        = string
  default     = "default"
}

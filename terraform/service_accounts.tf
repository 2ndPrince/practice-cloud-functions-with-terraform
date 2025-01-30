resource "google_service_account" "backend_service" {
  account_id   = "backend-service-sa"
  display_name = "Backend Service Account"
}

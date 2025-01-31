# Features Completed
- Setup Github workflow with Terraform (CI/CD setup)
- Start app locally, trigger function on cloud
- Save TF state in a GCS bucket backend
- Support Globally Unique Bucket Name
- Use TF Modules for logical categorization
- Replace Cloud Function upon Terraform Apply (same function name)
- Validate Request
- Connect with Secret Manager
- Make SpAmazonApiClient
- Creat AmazonOrder Interface
- Save orders to Firestore - 01/31/2025

# Features to complete
- Use NextToken to fully load response from Amazon
- Use PubSub to trigger Function on Cloud (Locally http trigger for testing)
- Create a new (triggering) function that publishes topic to the pubsub
- Create a scheduer to trigger the triggering function daily
- Spike: Use Analytics for orders data
- Spike: Design a frontend to support similar analytics to my customers

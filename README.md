## Project Tech Requirement
- Node.js, Typescript
- Terraform
- Github action
- GCP Cloud Run Functions (Serverless)


## Steps
1. Create a new repository on Github
2. Initialize repo with npm init
3. Install typescript and configure tsconfig.json
4. Test build and run
5. Commit and push to Github
6. Create Terraform and run test locally
7. Create Github action to deploy to GCP Cloud Run Functions
8. Test the deployment (Lots of troubleshooting)

### TroubleShooting
1. 409: Caller can't create a service account with roles/iam.serviceAccountUser and roles/iam.serviceAccountAdmin
2. Can't create service account with same name
3. Can't create cloud functions with same name


### Technical Goals
1. A designated service account for Cloud Run Functions
2. Zero downtime deployment


### Considerations
Source -> algorithm, unit test, integration test, Serverless
CI/CD -> Github Actions, Tekton, Cloud Build
IaS -> TerraForm
Security -> VPC, IAM (impersonate)
Fast response -> Cache
Database -> NoSQL and SQL both
Monitoring -> Alert
Analytics -> Data analytics

###
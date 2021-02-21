# Service description:
* Service exposes **REST** (REpresentational State Transfer) (**RESTful**) endpoints (**Headless** **REST API**) to provides **CRUD** (create, read, update, and delete) operations on an **Item**
* The **backend** is a **serverless** approach based on **business logic** written using lambdas (**AWS Lambda**) and a **NoSQL** **Database** (DB) using **DynamoDB**
* A **Serverless framework** is used for **deployment** to the **Cloud**.

# Technical Stack:
* **Amazon Web Services (AWS)**: AWS Lambda, Amazon DynamoDB, Amazon Simple Queue Service (SQS), Amazon Simple Notification Service (SNS), AWS Step Functions, Amazon CloudWatch Events
* **Languages**: TypeScript, JavaScript
* **Frameworks**: Serverless Framework, Jest, DynamoDB Toolbox (dynamodb-toolbox), Webpack, jest-dynalite
* **Runtime**: Node.js
# [Public Documentation] Application Signals Set Up for Lambda with ECR Container Image (Node.js)
This guide focuses on how to properly integrate the OpenTelemetry Layer with AppSignals support into your containerized Node.js Lambda function.

## Why This Approach is Necessary
Lambda functions deployed as container images do not support Lambda Layers in the traditional way. When using container images, you cannot simply attach the layer as you would with other Lambda deployment methods. Instead, you must manually incorporate the layer's contents into your container image during the build process.

This document outlines the necessary steps to download the `layer.zip` artifact and properly integrate it into your containerized Lambda function to enable AppSignals monitoring.

## Prerequisites
- AWS CLI configured with your credentials
- Docker installed
- Node.js (v18 or later)
- These instructions assume you are on `x86_64` platform

## 1. Set Up Project Structure
Create a directory for you Lambda function:

```console
mkdir nodejs-lambda-function && \
cd nodejs-lambda-function
```

Initialize a Node.js project:

```console
npm init -y
```

Install required dependencies:

```console
npm install aws-sdk
```

## 2. Lambda Function Code

Create an `index.js` file with the following content:

```javascript
// index.js
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

// Initialize S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION });

exports.handler = async function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('Handler initializing:', exports.handler.name);
  
  const response = {
    statusCode: 200,
    body: {}
  };
  
  try {
    // List S3 buckets
    const command = new ListBucketsCommand({});
    const data = await s3Client.send(command);
    
    // Extract bucket names
    const bucketNames = data.Buckets.map(bucket => bucket.Name);
    
    response.body = {
      message: 'Successfully retrieved buckets',
      buckets: bucketNames
    };
    
  } catch (error) {
    console.error('Error listing buckets:', error);
    
    response.statusCode = 500;
    response.body = {
      message: `Error listing buckets: ${error.message}`
    };
  }
  
  return response;
};
```

## 4. Build and Deploy the Container Image

### Set up environment variables

```console
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text) 
AWS_REGION=$(aws configure get region)

# For PowerShell users:
# $AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
# $AWS_REGION = aws configure get region
```

### Authenticate with ECR

First with public ECR (for base image):

```console
```

Then with your private ECR:

```console
```

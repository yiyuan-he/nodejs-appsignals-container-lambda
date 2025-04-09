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

'use strict';

const AWS = require('aws-sdk'); 

const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

module.exports.list = (event, context, callback) => {

  dynamoDb.scan(params, (error, result) => {
    
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};

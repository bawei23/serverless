'use strict';

const AWS = require('aws-sdk'); 

const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

	
module.exports.list = (event, context, callback) => {
  const params = {
    TableName: "contact",
    Key: {
      email: event.pathParameters.email,
    },
  };
 
  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch contact.'));
      return;
    });
};
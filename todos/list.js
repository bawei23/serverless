'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});
	
module.exports.list = (event, context, callback) => {
  const params = {
    TableName: "contact",
    Key: {
      contactID: event.pathParameters.id,
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
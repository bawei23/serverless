'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: "contact",
    Key: {
      contactID: event.pathParameters.id,
    },
  };

  dynamoDb.delete(params, (error) => {
    
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the contact.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: 'Delete successfully',
    };
    callback(null, response);
  });
};

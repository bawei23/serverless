'use strict';

const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.fullname !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the contact.',
    });
    return;
  }

  const params = {
    TableName: "contact",
    Key: {
      contactID: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#todo_text': 'fullname',
    },
    ExpressionAttributeValues: {
      ':fullname': data.fullname,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #todo_text = :fullname, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the contact.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};

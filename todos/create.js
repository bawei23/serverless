'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
	

const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});

	
module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const randomNumber = parseInt(Math.random() * 100);
  console.log(event);
  const data = JSON.parse(event.body);
  if (typeof data.fullname !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the contact.',
    });
    return;
  }

  const params = {
    TableName: "contact",
    Item: {
      contactID: randomNumber,
      fullname: data.fullname,
      email: data.email,
      phone_number: data.phone_number,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the contact.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};

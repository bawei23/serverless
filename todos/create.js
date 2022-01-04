'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
	
AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});

	
module.exports.create = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const phone_number = requestBody.phone_number;
 
  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof phone_number !== 'number') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit contact because of validation errors.'));
    return;
  }
 
  submitContact(contactInfo(fullname, email, phone_number))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted contact with email ${email}`,
          contactID: res.contactID
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit contact with email ${email}`
        })
      })
    });
};
 
 
const submitContact = contact => {
  console.log('Submitting contact');
  const contactInfo = {
    TableName: "contact",
    Item: contact,
  };
  return dynamoDb.put(contactInfo).promise()
    .then(res => contact);
};
 
const contactInfo = (fullname, email, phone_number) => {
  const timestamp = new Date().getTime();
  return {
    contactID: uuid.v1(),
    fullname: fullname,
    email: email,
    phone_number: phone_number,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};
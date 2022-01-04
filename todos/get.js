'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});


    module.exports = (event, callback) => {
      const params = {
        TableName: 'contact',
      };
    
      return dynamoDb.scan(params, (error, data) => {
        if (error) {
          callback(error);
        }
        callback(error, data.Items);
      });
    };
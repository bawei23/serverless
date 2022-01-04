'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});


   	
module.exports.get = (event, context, callback) => {
  var params = {
      TableName: "contact"
  };


  const onScan = (err, data) => {

      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  candidates: data.Items
              })
          });
      }

  };

  dynamoDb.scan(params, onScan);

};
'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});

exports.handler = async (event) => {
    var scanParams = {
        TableName: 'contact'
    };
    
    const data = await dynamoDb.scan(scanParams).promise();
    const res = {
        statusCode: 200,
        body: data
    }
    
    return res;
}

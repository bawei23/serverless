const AWS = require('aws-sdk');
const express = require('express');
const uuid = require('uuid');

const IS_OFFLINE = process.env.NODE_ENV !== 'production';
const EMPLOYEES_TABLE = process.env.TABLE;

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'eu-west-2',
        endpoint: 'http://127.0.0.1:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();

const router = express.Router();

router.get('/contact', (req, res) => {
    const params = {
        TableName: CONTACT_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the contact information' });
        }
        res.json(result.Items);
    });
});

router.get('/contact/:id', (req, res) => {
    const contactID = req.params.id;

    const params = {
        TableName: CONTACT_TABLE,
        Key: {
            contactID
        }
    };

    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving Contact Information' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Contact with id: ${id} not found` });
        }
    });
});

router.post('/contact', (req, res) => {
    const name = req.body.name;
    const id = uuid.v4();

    const params = {
        TableName: CONTACT_TABLE,
        Item: {
            id,
            name
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create Employee' });
        }
        res.json({
            id,
            name
        });
    });
});

router.delete('/contact/:id', (req, res) => {
    const contactID = req.params.id;

    const params = {
        TableName: EMPLOYEES_TABLE,
        Key: {
            contactID
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete Contact' });
        }
        res.json({ success: true });
    });
});

router.put('/employees', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;

    const params = {
        TableName: EMPLOYEES_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': name },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update Contact' });
        }
        res.json(result.Attributes);
    })
});

module.exports = router;
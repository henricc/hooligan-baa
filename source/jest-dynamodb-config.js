module.exports = {
    tables: [
        {
            TableName: `hooli-henri-mock`,
            KeySchema: [
                { AttributeName: 'userId', KeyType: 'HASH' },
                { AttributeName: 'streamId', KeyType: 'RANGE' }],
            AttributeDefinitions: [
                { AttributeName: 'userId', AttributeType: 'S' },
                { AttributeName: 'streamId', AttributeType: 'S' }],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
        // etc
    ],
};


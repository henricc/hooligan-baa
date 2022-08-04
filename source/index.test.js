

const { hasUncaughtExceptionCaptureCallback } = require('process');
var rewire = require('rewire'); // https://github.com/jhnns/rewire - Allows tests without exporting function
const index = rewire('./index.js');

const containsUserId = index.__get__('containsUserId');



describe("Tests for userId input.", () => {

    test("Non-empty userId should return true", () => {
        expect(containsUserId("testUserId")).toBe(true);
    });

    test('Undefined userId should return false', () => {
        expect(containsUserId(undefined)).toBe(false);
    });

    test("empty userId should return false", () => {
        expect(containsUserId("")).toBe(false);
    });
});


const { DocumentClient } = require('aws-sdk/clients/dynamodb');
tableName = 'hooli-henri-mock'
const params = (userId) => {
    return {
        TableName: tableName,
        KeyConditionExpression: `#userId = :userIdValue`,
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":userIdValue": userId
        },
        Select: "COUNT"
    }
};

const isTest = process.env.JEST_WORKER_ID;
const config = {
    convertEmptyValues: true,
    ...(isTest && {
        endpoint: 'localhost:8000',
        sslEnabled: false,
        region: 'local-env',
    }),
};

const item = (userId) => {
    return {
        TableName: tableName, Item: { userId: userId, activeFrom: "2000-01-01 00:00" }
    }
}

const getMockItemCount = async (userIds) => {
    await ddb
        .put({ TableName: tableName, Item: { userId: "user_1", streamId: "user_1_stream_1", activeFrom: "2000-01-01 00:00" } })
        .promise();
    await ddb
        .put({ TableName: tableName, Item: { userId: "user_1", streamId: "user_1_stream_2", activeFrom: "2000-01-01 00:01" } })
        .promise();
    await ddb
        .put({ TableName: tableName, Item: { userId: "user_1", streamId: "user_1_stream_3", activeFrom: "2000-01-01 00:01" } })
        .promise();
    await ddb
        .put({ TableName: tableName, Item: { userId: "user_2", streamId: "user_2_stream_1", activeFrom: "2000-01-01 00:01" } })
        .promise();

    const Item = await ddb.query(params(userIds)).promise();
    return Item;
}

const ddb = new DocumentClient(config);

describe("DynamoDB Tests", () => {


    test('Call to "user_1" should scan 3 objects', async () => {

        const Item = await getMockItemCount("user_1");
        expect(Item).toEqual({
            Count: 3,
            ScannedCount: 3
        });
    });

    test('Call to "user_2" should scan 1 objects', async () => {

        const Item = await getMockItemCount("user_2");
        expect(Item).toEqual({
            Count: 1,
            ScannedCount: 1
        });
    });

    test('Call to "user_3" should scan 0 objects', async () => {

        const Item = await getMockItemCount("user_3");
        expect(Item).toEqual({
            Count: 0,
            ScannedCount: 0
        });
    });

});
var AWS = require('aws-sdk');
const { run } = require('jest');

const tableName = "hooli-henri";
const REGION = "eu-west-1";

AWS.config.update({ region: REGION });
var ddbClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });


async function getActiveStreams(userId) {

    const params = {
        TableName: tableName,
        KeyConditionExpression: `#userId = :userIdValue`,
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":userIdValue": userId
        },
        Select: "COUNT"
    };

    const response = await ddbClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }

    });

    return response.promise();


}





function containsUserId(userId) {
    const hasUserId = userId ? true : false; // checks for null/undefined/empty
    return hasUserId;
}

exports.handler = async (event) => {
    console.log("hello")

    const userId = event.userId;
    const hasUserId = containsUserId(userId);

    if (hasUserId) {

        const dbResponse = await getActiveStreams(userId);
        console.log(`db response: ${dbResponse.Count}`)

        const response = {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
        };

        // console.log(response);

        return dbResponse;

    } else {

        const response = {
            statusCode: 400,
            body: "The 'userId' field is missing."
        };

        console.log(response);

        return response;
    }

};

// exports.containsUserId = containsUserId;
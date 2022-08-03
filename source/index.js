var AWS = require('aws-sdk');

const tableName = "hooli-henri";
const REGION = "eu-west-1";
const maxAllowedStreams = 3;

AWS.config.update({ region: REGION });
var ddbClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });


async function getActiveStreams(userId) {

    // parameters for DynamoDB Query to count number of active streams for user
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

    // query DynamoDB
    const response = await ddbClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }

    });

    const activeStreams = (await response.promise()).Count;

    return activeStreams;
}

// replace this function
function containsUserId(userId) {
    const hasUserId = userId ? true : false; // checks for null/undefined/empty
    return hasUserId;
}


exports.handler = async (event) => {

    const userId = event.userId;
    const hasUserId = containsUserId(userId);

    if (hasUserId) {

        const activeStreams = await getActiveStreams(userId);
        console.log(`Active Streams: ${activeStreams}`)

        const allowNewStream = activeStreams < maxAllowedStreams;

        return activeStreams;

    } else {

        const response = {
            statusCode: 400,
            body: "The 'userId' field is incorrect."
        };

        console.log(response);

        return response;
    }

};

// exports.containsUserId = containsUserId;
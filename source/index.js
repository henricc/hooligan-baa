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
            console.log("Error with DynamoDB Call: ", err);
        };
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

        const allowNewStream = activeStreams < maxAllowedStreams;


        response = {
            statusCode: 200,
            allowNewStream: allowNewStream,
            activeStreams: activeStreams
        }
        console.log(response)

        return response;

    } else {

        const allowNewStream = false;

        const response = {
            statusCode: 400,
            body: "The 'userId' field is invalid or missing."
        };

        console.log(response);

        return response;
    }

};

// exports.containsUserId = containsUserId;
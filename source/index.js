var AWS = require('aws-sdk');

const tableNameLocal = "hooli-henri"; // only used if environment variable tableName not set
const tableNameEnv = process.env.tableName;
const tableName = tableNameEnv ? tableNameEnv : tableNameLocal // use tableNameLocal as tableName if environment variable not set

const maxAllowedStreams = 3;
const REGION = "eu-west-1";

AWS.config.update({ region: REGION });
var ddbClient = new AWS.DynamoDB.DocumentClient();

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

    const activeStreams = (await response.promise()).Count; // get number of active streams from query response

    return activeStreams;
}



exports.handler = async (event) => {

    const userId = event.userId;

    try {
        if (userId) {

            const activeStreams = await getActiveStreams(userId);
            const allowNewStream = activeStreams < maxAllowedStreams;

            const response = {
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
                reason: "The 'userId' field is invalid or missing."
            };

            console.log(response);

            return response;
        }
    } catch (error) {
        return {
            statusCode: 500,
            reason: error.code
        };
    }

};

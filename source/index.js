
function containsUserId(userId) {
    const hasUserId = userId ? true : false; // checks for null/undefined/empty
    return hasUserId;
}

exports.handler = async (event) => {


    const userId = event.userId;
    const hasUserId = containsUserId(userId);

    if (hasUserId) {

        const response = {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
        };

        console.log(response);

        return response;

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
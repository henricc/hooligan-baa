function formatResponse(activeStreams, allowNewStream) {

    const response = {
        "activeStreams": activeStreams,
        "allowNewStream": allowNewStream
    };

    return response;
}

exports.handler = async (event) => {

    const userId = event.userId;
    console.log(userId);

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

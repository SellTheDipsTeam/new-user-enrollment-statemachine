const log = (type,lambdaEvent, message, response = null, statusCode = null) => {
    if (type === 'RESPONSE') {
        console.info("[RESPONSE]\n" + JSON.stringify({
            responseCode: statusCode,
            responseBody: response,
            httpMethod: lambdaEvent['httpMethod'],
            contextRoot: lambdaEvent['requestContext']['domainName'],
            resource: lambdaEvent['resource'],
            environment: lambdaEvent['requestContext']['stage'],
            requestBody: JSON.parse(lambdaEvent['body']),
        }, null, 2));
    } else if (type === 'ERROR') {
        console.error("[ERROR]\n" + JSON.stringify({
            responseCode: statusCode,
            errorMessage: message,
            httpMethod: lambdaEvent['httpMethod'],
            contextRoot: lambdaEvent['requestContext']['domainName'],
            resource: lambdaEvent['resource'],
            environment: lambdaEvent['requestContext']['stage'],
            requestBody: JSON.parse(lambdaEvent['body'])
        }, null, 2));
    } else {
        console.info("[LOG]\n" + JSON.stringify({
            message
        }, null, 2));
    }
}

module.exports = {
    log
}
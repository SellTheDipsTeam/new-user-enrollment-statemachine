const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const {constructUserJSON} = require("./utils/db-utils");
const {log} = require("./utils/logging");
/**
 * Sample Lambda function which mocks the operation of checking the current price of a stock.
 * For demonstration purposes this Lambda function simply returns a random integer between 0 and 100 as the stock price.
 * 
 * @param {Object} event - Input event to the Lambda function
 * @param {Object} context - Lambda Context runtime methods and attributes
 *
 * @returns {Object} object - Object containing the current price of the stock
 * 
 */
exports.addMemberToDynamo = async (event, context) => {
    if (event.httpMethod) {
        if (event.httpMethod !== 'POST') {
            return {
                'statusCode': 405,
                'body': 'This function only accepts POST methods'
            };
        }
    }
    const {email, uuid, account_creation_date, preferred_username} = event;
    const client = new DynamoDBClient({ region: process.env.REGION});

    const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        Item: constructUserJSON(uuid, account_creation_date, email, preferred_username)
    }

    try {
        const data = await client.send(new PutItemCommand(params));

        log("RESPONSE", event, null, data, 200);
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch(err) {
        if (err['$metadata']) {
            const statusCode = err['$metadata'].httpStatusCode
            log("ERROR", event, err.name, null, statusCode);
            return {
                statusCode: statusCode,
                body: "Internal Server Error",
            };
        }
        log("ERROR", event, err.message, null, 500);
        return {
            statusCode: 500,
            body: "Internal Server Error",
        };
    }
};

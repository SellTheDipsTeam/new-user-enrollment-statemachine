const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const {constructUserJSON} = require("./utils/db-utils");
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
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch(err) {
        throw err;
    }
};

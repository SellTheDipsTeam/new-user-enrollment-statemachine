const {CognitoIdentityProviderClient, ConfirmSignUpCommand} = require("@aws-sdk/client-cognito-identity-provider");
const {log} = require("./utils/logging");

/**
 * Sample Lambda function which mocks the operation of buying a random number of shares for a stock.
 * For demonstration purposes, this Lambda function does not actually perform any  actual transactions. It simply returns a mocked result.
 * 
 * @param {Object} event - Input event to the Lambda function
 * @param {Object} context - Lambda Context runtime methods and attributes
 *
 * @returns {Object} object - Object containing details of the stock buying transaction
 * 
 */
exports.confirmUserEmailFunction = async(event) => {
    if (event.httpMethod) {
        if (event.httpMethod !== 'POST') {
            return {
                'statusCode': 405,
                'body': 'This function only accepts POST methods'
            };
        }
    }

    const {email, uuid, code, preferred_username} = event.body;
    const params = {
        ClientId: process.env.AWS_USER_POOL_CLIENT_ID,
        Username: email,
        ConfirmationCode: code
    }
    const cognitoClient = new CognitoIdentityProviderClient({
        region: process.env.REGION
    });
    const command = new ConfirmSignUpCommand(params);

    try {
        const response = await cognitoClient.send(command);

        if (response['$metadata'].httpStatusCode === 200) {

        }
        return {
                success: true,
                uuid: uuid,
                displayName: preferred_username,
                email: email,
                account_creation_date: new Date().getUTCDate()
        };
    } catch (err) {
        if (err['$metadata']) {
            const statusCode = err['$metadata'].httpStatusCode
            log("ERROR", event, err.name, null, statusCode);
            return {
                'statusCode': statusCode,
                'body': err.name,
                'success': false
            };
        }
        log("ERROR", event, err.message, null, 500);
        return {
            'statusCode': 500,
            'body': 'Internal Server Error',
            'success': false
        };
    }
}

const { CognitoIdentityProviderClient, InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider')

const client = new CognitoIdentityProviderClient({region:'us-west-2'});

exports.lambdaHandler = async (event, context) => {
    try {
        const bodyReq = JSON.parse(event.body);
        let ClientId = bodyReq['client_id'];
        let Username = bodyReq['username'];
        let password = bodyReq['password'];

        let input ={
            AuthFlow:"USER_PASSWORD_AUTH",
            AuthParameters:{
                "USERNAME":Username,
                "PASSWORD":password
            },
            ClientId:ClientId
        }

        const command = new InitiateAuthCommand(input);
        let authRes = await client.send(command)
        let response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: authRes,
            })
        }
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
};
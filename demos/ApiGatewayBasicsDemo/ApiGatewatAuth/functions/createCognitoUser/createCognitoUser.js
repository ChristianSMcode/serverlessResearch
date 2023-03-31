const {CognitoIdentityProviderClient,AdminCreateUserCommand} = require('@aws-sdk/client-cognito-identity-provider');
const client = new CognitoIdentityProviderClient({region:"us-west-2"});

exports.lambdaHandler = async (event, context) => {
    try {
        const bodyReq = JSON.parse(event.body);

        const params = {
            UserPoolId:bodyReq['userPoolId'],
            Username:bodyReq['userName'],
            TemporaryPassword:"rvlPBO67.",
            UserAttributes:[
                {Name:'email',Value:bodyReq['email']},
                {Name:'given_name',Value:bodyReq['givenName']},
                {Name:'family_name',Value:bodyReq['familyName']}
            ]
        };

        const command = new AdminCreateUserCommand(params);
        const resCog = await client.send(command);

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: `User created ${resCog.User}`,
            })
        }
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
};
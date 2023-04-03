const auth0 = require('auth0');

const AuthenticationClient = new auth0.AuthenticationClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPES,
});


exports.lambdaHandler = async (event, context) => {
    let response;
    try {
        const bodyReq = JSON.parse(event.body);

        let email = bodyReq['email'];
        let password = bodyReq['password'];
        let connection = bodyReq['connection'];

        let input ={
            username:email,
            password:password,
            realm:connection,
            audience: process.env.AUDIENCE
        };

        let AuthUserResponse = await AuthenticationClient.passwordGrant(input);
        
        response = {
            'statusCode': 200,
            'body': JSON.stringify(AuthUserResponse)
        }
        return response;
    } catch (err) {
        response = {
            'statusCode':400,
            'body':JSON.stringify(err.message)
        }
        return response;
    }
};
const auth0 = require('auth0');
const jwt = require('jsonwebtoken');

const AuthenticationClient = new auth0.AuthenticationClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})


exports.lambdaHandler = async (event, context) => {
    let response;
    try {
        const bodyReq = JSON.parse(event.body);

        let email = bodyReq['email'];
        let password = bodyReq['password'];

        let getUserConnection = await managementClient.getUsersByEmail(email);
        let connection = getUserConnection[0].identities[0].connection;

        let input ={
            username:email,
            password:password,
            realm:connection,
            audience: process.env.AUDIENCE
        };

        let AuthUserResponse = await AuthenticationClient.passwordGrant(input);
        let {sub} = jwt.decode(AuthUserResponse.access_token);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({AuthUserResponse,userId:sub}),
            'headers':{
            'Access-Control-Allow-Origin':'*' 
            }
        }
        return response;
    } catch (err) {
        response = {
            'statusCode':400,
            'body':JSON.stringify(err.message),
            'headers':{
                'Access-Control-Allow-Origin':'*' 
                }
        }
        return response;
    }
};
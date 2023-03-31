const auth0 = require('auth0');

const managementClient = new auth0.ManagementClient({
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
            email:email,
            password:password,
            connection:connection
        };

        let createUserResponse = await managementClient.createUser(input);
        
        response = {
            'statusCode': 200,
            'body': JSON.stringify(createUserResponse)
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
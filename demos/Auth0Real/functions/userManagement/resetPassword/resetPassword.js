const auth0 = require('auth0');

const authenticationClient = new auth0.AuthenticationClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});


exports.lambdaHandler = async (event, context) => {
    let response;
    try {
        const body = JSON.parse(event.body);
        let email = body['email'];

        let userInfo = await managementClient.getUsersByEmail(email);

        let connection = userInfo[0].identities.find(
            (identity) => identity.provider === 'auth0'
        );

        await authenticationClient.requestChangePasswordEmail({
            email:email,
            connection:connection.connection
        })

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message:`Change password email sent to ${email}`
            }),
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
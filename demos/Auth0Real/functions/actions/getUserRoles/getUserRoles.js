const auth0 = require('auth0');

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});


exports.lambdaHandler = async (event, context) => {
    let response;
    try {
        const body = JSON.parse(event.body);

        let userId = body['userId'];

        let userRoles = await managementClient.getUserRoles({id:userId});
        let userScopes = await managementClient.getUserPermissions({id:userId});
 

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                'userRoles':userRoles,
                'userScopes':userScopes
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
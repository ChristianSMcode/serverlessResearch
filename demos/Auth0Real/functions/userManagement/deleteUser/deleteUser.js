const auth0 = require('auth0');
const jwt = require('jsonwebtoken');

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

        let access_token = event.headers.Authorizationtoken.split(' ')[1];
        let email = bodyReq['email'];
        let connectionId = bodyReq['connectionId'];

        let {sub} = jwt.decode(access_token);

        let users = await managementClient.getUsersByEmail(email);
        let userId = users[0].user_id;

        if(sub !== userId){
            throw new Error('Unauthorized')
        }
       
        let input ={
            email:email,
            id:connectionId
        };

        await managementClient.connections.deleteUserByEmail(input);
        
        response = {
            'statusCode': 200,
            'body': JSON.stringify('User deleted successfully')
        }
        return response;
    } catch (err) {
        response = {
            'statusCode':400,
            'body':JSON.stringify(err.message)
        }
        return response;
    }

}
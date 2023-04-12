const auth0 = require('auth0');
const jwt = require('jsonwebtoken');
const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});


exports.lambdaHandler = async (event, context) => {
    let response;
    try {
        const body = JSON.parse(event.body);
        let access_token = event.headers.authorizationtoken.split(' ')[1];
        let email = body['email'];
        let users = await managementClient.getUsersByEmail(email);
        let userId = users[0].user_id;
        let {sub} = jwt.decode(access_token);

        if(sub !== userId){
            throw new Error('Unauthorized')
        }

        let newPassword = body['new_password']; // Lo manda el usuario
        await managementClient.updateUser({id:sub},{password:newPassword});

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message:`Change password direct operation perfomed success`
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
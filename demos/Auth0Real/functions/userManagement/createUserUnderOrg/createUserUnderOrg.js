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
        let emailAdmin = body['email'];
        let userAdmin = await managementClient.getUsersByEmail(emailAdmin);
        let userIdAdmin = userAdmin[0].user_id;
        let userType = userAdmin[0].user_metadata.userType;
        let {sub} = jwt.decode(access_token);

        if(sub !== userIdAdmin){
            throw new Error('Unauthorized')
        };

        if(userType !== 'COMPANY'){
            response = {
                'statusCode': 404,
                'body': JSON.stringify('Only users of type company can create other users.'),
                'headers':{
                    'Access-Control-Allow-Origin':'*' 
                }
            }
            return response;
        }

        let organizationsInfo = await managementClient.users.getUserOrganizations({id:userIdAdmin});
        let AdminConnection = userAdmin[0].identities.find(
            (identity) => identity.provider === 'auth0'
        );
        //Create child user
        let userChildEmail = body['userEmail'];
        let userChildPassword = body['userPassword']

        let input ={
            email:userChildEmail,
            password:userChildPassword,
            connection:AdminConnection.connection,
            user_metadata:{
                userType:'MEMBER'
            }
        };

        let createUserResponse = await managementClient.createUser(input);
        
        await managementClient.organizations.addMembers(
            {id:organizationsInfo[0].id},
            {members:[createUserResponse.user_id]}
        );

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message:`New user created under your organization (${organizationsInfo[0].id})`
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
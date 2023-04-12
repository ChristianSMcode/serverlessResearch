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
        const bodyReq = JSON.parse(event.body);
        let access_token = event.headers.authorizationtoken.split(' ')[1];

        let email = bodyReq['email'];
        let users = await managementClient.getUsersByEmail(email);

        let userId = users[0].user_id;
        let userType = users[0].user_metadata.userType;

        let {sub} = jwt.decode(access_token);

        if(sub !== userId){
            throw new Error('Unauthorized')
        }

        if(userType !== 'COMPANY' && userType !== 'MEMBER'){
            response = {
                'statusCode': 400,
                'body': JSON.stringify('Only users within a custom company can list other users.'),
                'headers':{
                    'Access-Control-Allow-Origin':'*' 
                }
            }
            return response;
        }
        let organizationsInfo = await managementClient.users.getUserOrganizations({id:userId});
        let usersFromOrganization = await managementClient.organizations.getMembers({id:organizationsInfo[0].id})

        response = {
            'statusCode': 200,
            'body': JSON.stringify(usersFromOrganization),
            'headers':{
                'Access-Control-Allow-Origin':'*' 
            }
        }
        return response;
    } catch (err) {
        response = {
            'statusCode':400,
            'body':JSON.stringify({errMessage:err.message}),
            'headers':{
                'Access-Control-Allow-Origin':'*' 
            }
        }
        return response;
    }

}
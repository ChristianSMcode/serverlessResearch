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
        let {sub} = jwt.decode(access_token);
        
        let userOrganization = await managementClient.users.getUserOrganizations({id:sub})

        let roleName = body['roleName']; 
        let description = body['description'];
        let email = body['email'];
        let users = await managementClient.getUsersByEmail(email);
        let userType = users[0].user_metadata.userType;

        if(userType !== 'COMPANY' && userType !== 'MEMBER'){
            response = {
                'statusCode': 400,
                'body': JSON.stringify('Only users within a custom company can create roles.'),
                'headers':{
                    'Access-Control-Allow-Origin':'*' 
                }
            }
            return response;
        }
 
        let input = {
            name:roleName + '-' + userOrganization[0].name,
            description:description
        }
        

        await managementClient.createRole(input);

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message:`Role created.`
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
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

        let email = body['email'];
        let roleId = body['rolId'];
        let scopes = body['permissions'];

        let users = await managementClient.getUsersByEmail(email);
        let userType = users[0].user_metadata.userType;

        if(userType !== 'COMPANY' && userType !== 'MEMBER'){
            response = {
                'statusCode': 400,
                'body': JSON.stringify('Only users within a custom company can list manipulate roles/permissions'),
                'headers':{
                    'Access-Control-Allow-Origin':'*' 
                }
            }
            return response;
        }
        

        let permissions = [];

        for(let scope of scopes){
            let permissionObj = {permission_name:scope,resource_server_identifier:process.env.AUDIENCE}
            permissions.push(permissionObj)
        }

        let paramsId = {id:roleId};
        let data = {permissions:permissions};
        
        await managementClient.addPermissionsInRole(paramsId,data);
 

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                'message':'Operation completed succesfully'
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
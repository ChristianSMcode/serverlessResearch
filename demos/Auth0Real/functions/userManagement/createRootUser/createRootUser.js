const createUser = require('./createUser')
const createOrganization = require('./createOrganization')


exports.lambdaHandler = async (event, context) => {
    let response;
    try {
        const bodyReq = JSON.parse(event.body);
        let email = bodyReq['email'];
        let password = bodyReq['password'];
        let connection = bodyReq['connection'];
        let orgName = bodyReq['organizationName'];

        let createUserResponse = await createUser.createUser(email,password,connection);
        let createOrganizationResponse = await createOrganization.createOrganization(orgName);
        
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                user:`User ${createUserResponse['name']} created.`,
                organization:`Organization ${createOrganizationResponse['id']} created (id)` 
            })
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
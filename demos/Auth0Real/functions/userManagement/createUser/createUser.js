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

        let email = body['email']; // Lo manda el usuario
        let password = body['password']; // Lo manda el usuario
        let connection = 'resolve-organization-db'
      

        let input ={
            email:email,
            password:password,
            connection:connection,
        };

        let createUserResponse = await managementClient.createUser(input);

        await managementClient.organizations.addMembers(
            {id:process.env.RESSOLVE_ORG},
            {members:[createUserResponse.user_id]}
        );
        
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message:`User with id ${createUserResponse.user_id} was created and added to Ressolve organization successufully.`
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
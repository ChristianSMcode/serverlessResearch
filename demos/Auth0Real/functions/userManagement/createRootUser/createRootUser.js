const auth0 = require('auth0');

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

const createUser = async (email,password,connection) =>{
    try{
        let input ={
            email:email,
            password:password,
            connection:connection
        };
        let response = await managementClient.createUser(input);
        return response;
    }catch(err){
        throw new Error(err.message)
    }
};
const createOrganization = async (organizationName,conectionId) =>{
    try{
        let response = await managementClient.organizations.create({
            name:organizationName,
            enabled_connections:[
                {connection_id:conectionId,assign_membership_on_login:false}
            ]
        });
        return response;
    }catch(err){
        throw new Error(err.message)
    }

};
const createConnection = async (connectionName,stratrgy) =>{
    try{
        let response = await managementClient.createConnection({
            name:connectionName,
            strategy:stratrgy,
            enabled_clients:[
                "wPZkMbglCKYMMX2H8EN1WstSss71nqgP"
            ]
        })
        return response;
    }catch(err){
        throw new Error(err.message)
    }

};

exports.lambdaHandler = async (event, context) => {
    let response;
    try {
        const bodyReq = JSON.parse(event.body);
        let email = bodyReq['email'];
        let password = bodyReq['password'];
        let orgName = bodyReq['organizationName'];
        let conName = orgName + '-db';
        let strategy = 'auth0'

        let createConnectionResponse = await createConnection(conName,strategy);
        let createOrganizationResponse = await createOrganization(orgName,createConnectionResponse.id);
        let createUserResponse = await createUser(email,password,createConnectionResponse.name);

        await managementClient.organizations.addMembers(
            {id:createOrganizationResponse.id},
            {members:[createUserResponse.user_id]}
        );

        
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                user:`User ${createUserResponse['name']} created.`,
                organization:`Organization ${createOrganizationResponse['id']} created (id)`,
                connection:`Default db connection for this organization ${createConnectionResponse.name}`
            })
        }
        return response;
    } catch (err) {
        response = {
            'statusCode':400,
            'body':JSON.stringify({errMessage:err.message,errPointer:err.stack.split('\n')[1].trim()})
        }
        return response;
    }
};
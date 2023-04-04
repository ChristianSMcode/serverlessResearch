const auth0 = require('auth0');

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPES,
});

module.exports.createUser = async (email,password,connection) =>{
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
}

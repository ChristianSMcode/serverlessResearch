const auth0 = require('auth0');

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPES,
});

module.exports.createOrganization = async (organizationName) =>{
    try{
        let response = await managementClient.organizations.create({name:organizationName});
        return response;
    }catch(err){
        throw new Error(err.message)
    }

}
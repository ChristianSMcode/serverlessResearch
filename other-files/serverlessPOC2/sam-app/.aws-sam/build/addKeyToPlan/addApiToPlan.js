const { APIGatewayClient, CreateUsagePlanKeyCommand } = require("@aws-sdk/client-api-gateway");
const client = new APIGatewayClient({ region: "us-west-2" });

exports.handler = async (event) => {
    try{
        let {keyId,keyType,usagePlanId}= JSON.parse(event.body);
        
        let params = {
            keyId:keyId,
            keyType:keyType,
            usagePlanId:usagePlanId
            
        };
        
        const command = new CreateUsagePlanKeyCommand(params);
        const linkResponse = await client.send(command);
        
        return {
            statusCode:200,
            body:JSON.stringify(linkResponse)
        };
        
    }catch(err){
        console.log(err);
        throw err;
    }

    
}
const { APIGatewayClient, CreateApiKeyCommand, CreateUsagePlanKeyCommand } = require("@aws-sdk/client-api-gateway");
const client = new APIGatewayClient({ region: "us-west-2" });

exports.handler = async (event) => {
    try{
        //Create Api key
        let {name,description,keyType,usagePlanId,enabled}= JSON.parse(event.body);
        
        let paramsCreateKey = {
            name:name,
            enabled:enabled,
            description:description,
            
        };
        
        let commandCreate = new CreateApiKeyCommand(paramsCreateKey);
        let apiRes = await client.send(commandCreate);
        
        //Add to usage plan
        //It would be nice to validate if the usage plan exists if not then create one or return the exception
        
        let paramsAddKey = {
            keyId:apiRes.id,
            keyType:keyType,
            usagePlanId:usagePlanId
            
        };
        
        let commandAdd = new CreateUsagePlanKeyCommand(paramsAddKey);
        await client.send(commandAdd);
        
        return {
            statusCode:200,
            body:JSON.stringify("Successfully created Api key " + apiRes.id + " and added to the plan " + usagePlanId)
        };
        
    }catch(err){
        console.log(err);
        throw err;
    }

    
}
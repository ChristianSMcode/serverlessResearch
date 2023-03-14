const { APIGatewayClient, CreateApiKeyCommand } = require("@aws-sdk/client-api-gateway");
const client = new APIGatewayClient({ region: "us-west-2" });

exports.handler = async (event) => {
    try{
        let {name,description}= JSON.parse(event.body);
        
        let params = {
            name:name,
            description:description,
            
        };
        
        const command = new CreateApiKeyCommand(params);
        const apiRes = await client.send(command);
        
        return {
            statusCode:200,
            body:JSON.stringify(apiRes)
        };
        
    }catch(err){
        console.log(err);
        throw err;
    }

    
}
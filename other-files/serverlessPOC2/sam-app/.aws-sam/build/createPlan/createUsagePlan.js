const { APIGatewayClient, CreateUsagePlanCommand } = require("@aws-sdk/client-api-gateway");
const client = new APIGatewayClient({ region: "us-west-2" });

exports.handler = async (event) => {
    try{
        let {apiStage,description,name}= JSON.parse(event.body);
        
        let params = {
            name:name,
            apiStages:[apiStage],
            description:description,
            
        };
        
        const command = new CreateUsagePlanCommand(params);
        const usageRes = await client.send(command);
        
        return {
            statusCode:200,
            body:JSON.stringify(usageRes)
        };
        
    }catch(err){
        console.log(err);
        throw err;
    }

    
}
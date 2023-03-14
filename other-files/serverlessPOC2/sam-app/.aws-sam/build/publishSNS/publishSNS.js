const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const client = new SNSClient({ region: "us-west-2" });

exports.handler = async(event) => {
    let data = JSON.parse(event.body);
    
    try{
        let params={
            Message:JSON.stringify(data),
            TopicArn:process.env.TOPIC_SNS_ARN
        }
        const command = new PublishCommand(params);
        const response = await client.send(command);
        
        return {
            statusCode:200,
            body:JSON.stringify({
                response,
                status:"Successfull"
                
            })
        };
        
    }catch(err){
        console.log('Err:',err);
        throw err;
    }
    
};
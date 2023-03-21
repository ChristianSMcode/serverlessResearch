const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const client = new SQSClient({ region: "us-west-2" });


exports.handler = async (event) => {
    let data = JSON.parse(event.body);
    try{
        
        let params = {
                MessageBody:JSON.stringify(data),
                QueueUrl: process.env.WRITE_QUEUE_URL
            };
            
        const command = new SendMessageCommand(params);
        const queueRes = await client.send(command);
        
        return {
        statusCode:200,
        body:JSON.stringify(queueRes)
        };
        
    }catch(err){
        console.log('Err:',err);
        throw err;
    }
    
};
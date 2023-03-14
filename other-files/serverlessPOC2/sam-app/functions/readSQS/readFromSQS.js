const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");

const client = new SQSClient({ region: "us-west-2" });


exports.handler = async (event) => {
    try{
        //Read Message
        let receiveParams = {
                MaxNumberOfMessages: 1,
                QueueUrl: process.env.WRITE_QUEUE_URL
            };
            
        const commandReceive = new ReceiveMessageCommand(receiveParams);
        const readMessageResponse = await client.send(commandReceive);
        let responsePayload = JSON.parse(readMessageResponse.Messages[0].Body);
        
        //Delete Message
        let delParams={
            ReceiptHandle:readMessageResponse.Messages[0].ReceiptHandle,
            QueueUrl: process.env.WRITE_QUEUE_URL
        }
        const commandDelete = new DeleteMessageCommand(delParams);
        const response = await client.send(commandDelete);
        
        return {
        statusCode:200,
        body:JSON.stringify(
            {
                message:responsePayload,
                delStatus:response
            })
        };
        
    }catch(err){
        console.log('Err:',err);
        throw err;
    }
    
};

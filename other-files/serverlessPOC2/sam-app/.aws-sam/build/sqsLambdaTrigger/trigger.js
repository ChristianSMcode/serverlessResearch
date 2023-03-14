exports.handler = async(event) => {
    
    console.log(`${event.Records.length} messages were received and the same messages will not be available anymore in the sqs queue`);
    //throw exception to check when a message is considered to being unable to get processed.
    //throw new Error('Error to test');
    
    //El siguiente codigo no es necesario pero lo comento porque puede ser util en otra forma de aplicacion manual
    //Cuando un lambda actua como trigger el mensage se elimina automaticamente a no ser que la funcion termine erroneamente.
    /*let delPromises=event.Records.map((message)=>{
        let delParams={
            ReceiptHandle:message.receiptHandle,
            QueueUrl: "https://sqs.us-west-2.amazonaws.com/420001443519/manualFromSNSconsole"
        }
        
        const commandDelete = new DeleteMessageCommand(delParams);
        return client.send(commandDelete);
    });

    await Promise.all(delPromises);*/
    
    
};
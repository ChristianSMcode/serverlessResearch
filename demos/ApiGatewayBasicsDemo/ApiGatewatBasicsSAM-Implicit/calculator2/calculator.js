exports.handler = async (event,context) => {
    try {
    
        let body = JSON.parse(event.body)
        let num1 = body.input.operand1;
        let num2 = body.input.operand2;
        let operation = event.pathParameters.operation;
        let result = undefined;

        switch(operation){
            case 'add':
                result = num1 + num2;
                break;
            case 'substract':
                result = num1 - num2;
                break;
            default:
                result = 'Operation not supported'
        }

        return {
            statusCode:200,
            body:JSON.stringify(
                {
                    result:result,
                    headerTest:event.headers['Header-Test'],
                    queryParam: event.queryStringParameters.test                
                })
        }
                

    } catch (err) {
        console.log(err);
        return err;
    }
};

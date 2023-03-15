exports.handler = async (event) => {
    try {
        let num1 = event.input.operand1;
        let num2 = event.input.operand2;
        let operation = event.operation;
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
            body:JSON.stringify({result:result})
        }
                

    } catch (err) {
        console.log(err);
        return err;
    }
};

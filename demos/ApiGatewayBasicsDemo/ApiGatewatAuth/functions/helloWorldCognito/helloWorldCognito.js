exports.lambdaHandler = async (event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world Cognito auth',
            })
        }
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
};

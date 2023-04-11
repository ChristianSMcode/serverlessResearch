exports.lambdaHandler = async (event, context) => {
    let response;
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
            }),
            'headers':{
                'Access-Control-Allow-Origin':'*' 
            }
        }
        return response;
    } catch (err) {
        response = {
            'statusCode': 500,
            'body': JSON.stringify({
                message: err,
                customMessage:'error in lambda'
            }),
            'headers':{
                'Access-Control-Allow-Origin':'*' 
            }
        }
        return response;
    }
};

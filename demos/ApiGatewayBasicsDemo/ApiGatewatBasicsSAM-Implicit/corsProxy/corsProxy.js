exports.handler = async (event) => {
    try {

        return {
            statusCode:200,
            body:JSON.stringify('Hello from cors proxy'),
            headers:{
                'Access-Control-Allow-Origin':'*'
            }
        }
                

    } catch (err) {
        console.log(err);
        return err;
    }
};

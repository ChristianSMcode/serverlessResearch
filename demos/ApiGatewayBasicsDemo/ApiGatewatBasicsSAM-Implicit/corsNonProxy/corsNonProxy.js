exports.handler = async (event) => {
    try {

        let name = event.name

        return {
            statusCode:200,
            body:JSON.stringify(`Hello ${name} from cors non proxy`),
            headers:{
                'Access-Control-Allow-Origin':'*' //Even with this 
                // header this will not work since its not a simple request
                // because it has a custom header, its necessary to configure options method 
                // for the preflight request, also note that this value must be mapped in the integration
                //response because is a non proxy integration whos invoking it
            }
        }
                

    } catch (err) {
        console.log(err);
        return err;
    }
};

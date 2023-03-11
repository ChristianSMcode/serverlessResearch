const moment = require('moment');

const langGreetings = {
    en:"Hello",
    es:"Hola",
    in:"Namastee"
};

exports.handler = async (event, context) => {
    try {
        let name = event.pathParameters.name; // Here is how path parameters are read from the event of a lambda with proxy Integration
        let {lang,...info} = event.queryStringParameters; // here is how query String parameters are read from event of a lambda with proxy integration
        let message = `${moment().unix()}----${langGreetings[lang] ? langGreetings[lang] : langGreetings['en']} ${name}`;
        let bodyReq = event.body; // here is how we get the body from the event in a lambda proxy integration
        let response = {
            message:message,
            info:info,
            bodyReq:bodyReq
        };
        // we need to return a valid http response since we are using lambda proxy integration
        return {
            statusCode:200,
            body:JSON.stringify(response)
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    
};

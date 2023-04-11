const apigClient = apigClientFactory.newClient();

const log = document.querySelector('.log');
log.addEventListener('click',()=>{
    let params = {};
    let additionalParams = {
        headers:{},
        queryParams:{}
    } 

    let body ={
        "email": "david.sierra@gmail.com",
        "password": "r1v2l3P4B5O667.."
    }

    apigClient.usersLogInPost(params,body,additionalParams)
        .then( (result) => {
            console.log(result)})
        .catch((err)=>{
            console.log(err)
        })

})
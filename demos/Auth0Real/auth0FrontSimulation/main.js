const apigClient = apigClientFactory.newClient();

const log = document.querySelector('.log');
const nameInput = document.querySelector('.nameInput');
const passwordInput = document.querySelector('.passwordInput');
const resultData = document.querySelector('.resultData');
const testAction = document.querySelector('.testAction');
const statusSet = document.querySelector('.status');
//LogUser-Save token
log.addEventListener('click',()=>{
    let params = {};
    let additionalParams = {
        headers:{},
        queryParams:{}
    } 

    let body ={
        "email": nameInput.value,
        "password": passwordInput.value
    }

    apigClient.usersLogInPost(params,body,additionalParams)
        .then( (result) => {
            console.log(result)
            let access_token = result.data.access_token
            resultData.innerHTML = access_token.slice(0,10) + '...'
            localStorage.setItem("access_token",access_token)
        })
        .catch((err)=>{
            resultData.innerHTML = JSON.stringify(result.data)
            console.log(err)
        })

});

testAction.addEventListener('click',()=>{
    let acces_token = localStorage.getItem("access_token");
    let params = {};
    let additionalParams = {
        headers:{
            'Authorizationtoken':'Bearer ' + acces_token
        },
        queryParams:{}
    } 
    let body ={};

    apigClient.actionsAuth0Get(params,body,additionalParams)
    .then( (result) => {
        console.log(result);
        statusSet.innerHTML = 'Authenticated: ' + result.data.message;

    })
    .catch((err)=>{
        console.log(err);
        statusSet.innerHTML = 'Error aunthenticating: ' + err.data.message;
    })
})
const apigClient = apigClientFactory.newClient();
const log = document.querySelector('.log');
const nameInput = document.querySelector('.nameInput');
const passwordInput = document.querySelector('.passwordInput');
const resultData = document.querySelector('.resultData');
const testAction = document.querySelector('.testAction');
const statusSet = document.querySelector('.status');
const createName = document.querySelector('.userCreate');
const createPassword = document.querySelector('.passwordCreate');
const createUserButton = document.querySelector('.create');
const companyRadio = document.querySelector('.companyType');
const individualRadio = document.querySelector('.individualType');
const companyInput = document.querySelector('.companyInput');
const deleteUser = document.querySelector('.deleteUser');
const changePass = document.querySelector('.changePass');
const rPassEmail = document.querySelector('.rPass');
const listUsers = document.querySelector('.listUsers');
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
            let access_token = result.data.AuthUserResponse.access_token;
            let userId = result.data.userId;
            resultData.innerHTML = access_token.slice(0,10) + '...';
            localStorage.setItem("access_token",access_token)
            localStorage.setItem("user_id",userId);
            localStorage.setItem('user_email',nameInput.value)
        })
        .catch((err)=>{
            resultData.innerHTML = JSON.stringify(err.data)
            console.log(err)
        })

});
//If logged this action will work which is just a hello world in api gateway
//protected by authorizer
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
});
//Create a user it can be individual(ressolve) or company(custom)
createUserButton.addEventListener('click',()=>{
    let userName = createName.value;
    let password = createPassword.value;
    let userType = document.querySelector('input[name="userType"]:checked').value;

    //Create individual
    if(userType == 'Individual'){
        let body ={
            "email": userName,
            "password": password
        };
        let params = {};
        let additionalParams = {
            headers:{},
            queryParams:{}
        };
        apigClient.usersCreateUserPost(params,body,additionalParams)
        .then( (result) => {
            console.log(result)
            resultData.innerHTML = result.data.message;
        })
        .catch((err)=>{
            console.log(err)
            resultData.innerHTML = err.data;
        })

    };
    //Create company
    if(userType == 'Company'){
        let body ={
            "email": userName,
            "password": password,
            "organizationName": companyInput.value
        };
        let params = {};
        let additionalParams = {
            headers:{},
            queryParams:{}
        };

        apigClient.usersCreateRootUserPost(params,body,additionalParams)
        .then( (result) => {
            console.log(result)
            resultData.innerHTML = JSON.stringify(result.data);
        })
        .catch((err)=>{
            console.log(err)
            resultData.innerHTML = JSON.stringify(err.data);
        })
    };


});
//Show new input for company name
companyRadio.addEventListener('change',()=>{
    companyInput.removeAttribute('hidden',true)
    
});
//Removes new input for company name
individualRadio.addEventListener('change',()=>{
    companyInput.setAttribute('hidden',false)
});

//Delete loged user
deleteUser.addEventListener('click',()=>{
    let access_token = localStorage.getItem("access_token");
    let userEmail = localStorage.getItem('user_email')

    let params = {};
    let additionalParams = {
        headers:{
            'Authorizationtoken':'Bearer ' + access_token
        },
        queryParams:{}
    } 

    let body ={
        "email":userEmail
    }
   
    apigClient.usersDeleteUserPost(params,body,additionalParams)
    .then( (result) => {
        console.log(result)
        resultData.innerHTML = JSON.stringify(result.data);
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
    })
});
//change password withoud sending Email
changePass.addEventListener('click',()=>{
    let newPassword = window.prompt('Insert new password:')
    let access_token = localStorage.getItem("access_token");
    let userEmail = localStorage.getItem('user_email')

    let params = {};
    let additionalParams = {
        headers:{
            'Authorizationtoken':'Bearer ' + access_token
        },
        queryParams:{}
    } 

    let body ={
        "email":userEmail,
        "new_password":newPassword
    };
    
    
    apigClient.usersChangePasswordPost(params,body,additionalParams)
    .then( (result) => {
        console.log(result)
        resultData.innerHTML = JSON.stringify(result.data);
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
    })
});
// Send email pass reset
rPassEmail.addEventListener('click',()=>{
    let email = window.prompt('Insert your email:');

    let params = {};
    let additionalParams = {
        headers:{},
        queryParams:{}
    };

    let body ={
        "email":email,
    };

    apigClient.usersResetPasswordPost(params,body,additionalParams)
    .then( (result) => {
        console.log(result)
        resultData.innerHTML = JSON.stringify(result.data);
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
    })
})
//List users
listUsers.addEventListener('click',()=>{
    let email = localStorage.getItem('user_email');
    let acces_token = localStorage.getItem("access_token");

    let params = {};
    let additionalParams = {
        headers:{
            'Authorizationtoken':'Bearer ' + acces_token
        },
    }

    let body ={
        "email":email,
    };

    apigClient.usersListUsersPost(params,body,additionalParams)
    .then( (result) => {
        resultData.innerHTML = 'Users fetched';
        const cardContainer = document.getElementById("card-container");
        cardContainer.innerHTML = "";
        for(let i = 0; i < result.data.length;i++){
            let user = result.data[i];
            
  
            const card = document.createElement("div");
            card.className = "card";
            card.style.width = "18rem";
            
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";
            
            const cardTitle = document.createElement("h5");
            cardTitle.className = "card-title";
            cardTitle.textContent = user.email;
            
            const cardText = document.createElement("p");
            cardText.className = "card-text";
            cardText.textContent = user.user_id;
            
            const cardButton = document.createElement("a");
            cardButton.className = "btn btn-primary";
            cardButton.href = "#";
            cardButton.textContent = "ModifyUserDetails";
            
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardButton);
            
            card.appendChild(cardBody);
            
            cardContainer.appendChild(card);
        }
        window.location.href = "#card-container"
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
    })

})
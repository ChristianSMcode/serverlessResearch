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
const createOrgUser = document.querySelector('.create-org-user-btn');
const userCreateOrg = document.querySelector('.userCreateOrg');
const passwordCreateOrg = document.querySelector('.passwordCreateOrg');
const createRole = document.querySelector('.create-role-btn');
const roleName = document.querySelector('.roleName');
const addToRole = document.querySelector('.add-to-role-btn');
const listRP = document.querySelector('.listRP');
const roleDescription = document.querySelector('.roleDescription')
console.log(apigClient)
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
//Create org user
createOrgUser.addEventListener('click',()=>{
    
    let emailAdmin = localStorage.getItem('user_email');
    let acces_token = localStorage.getItem("access_token");

    let params = {};
    let additionalParams = {
        headers:{
            'Authorizationtoken':'Bearer ' + acces_token
        },
    }

    let body ={
        "email":emailAdmin,
        "userEmail":userCreateOrg.value,
        "userPassword":passwordCreateOrg.value
    };

    apigClient.usersCreateOrgUserPost(params,body,additionalParams)
    .then( (result) => {
        console.log(result)
        resultData.innerHTML = JSON.stringify(result.data);
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
    })
})
//Create a role
createRole.addEventListener('click',()=>{
    let emailAdmin = localStorage.getItem('user_email');
    let acces_token = localStorage.getItem("access_token");

    let params = {};
    let additionalParams = {
        headers:{
            'Authorizationtoken':'Bearer ' + acces_token
        },
    }

    let body ={
        "email":emailAdmin,
        "roleName":roleName.value,
        "description":roleDescription.value
    };

    apigClient.actionsCreateRolePost(params,body,additionalParams)
    .then( (result) => {
        console.log(result)
        resultData.innerHTML = JSON.stringify(result.data);
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
    })
})
//Assigs preExisting permisions to preExistingRole
addToRole.addEventListener('click',()=>{
    let closeButton = document.querySelector('.close-role-add');
    let scopesUl = document.querySelector('.scopesUl');
    let selectedScopesNodes = scopesUl.querySelectorAll('input[name="scopes"]:checked');
    let rolesUl = document.querySelector('.rolesUl');
    let selectedRole = rolesUl.querySelector('input[name="roles"]:checked').value;
    selectedScopesNodes=Array.from(selectedScopesNodes);
    //['read:testhelloscope', 'read:test2']
    let selectedScopes = selectedScopesNodes.map((node) => node.value)
    

    let emailAdmin = localStorage.getItem('user_email');
    let acces_token = localStorage.getItem("access_token");

    let params = {};
    let additionalParams = {
        headers:{
            'Authorizationtoken':'Bearer ' + acces_token
        },
    }

    let body ={
        "email":emailAdmin,
        "rolId":selectedRole,
        "permissions":selectedScopes
    };


    apigClient.actionsAddScopesToRolePost(params,body,additionalParams)
    .then( (result) => {
        console.log(result)
        resultData.innerHTML = JSON.stringify(result.data);
        closeButton.click()
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
        closeButton.click()
    })
    
    
    
    
})
//Opens modal which list roles and permissions
listRP.addEventListener('click',()=>{
    let emailAdmin = localStorage.getItem('user_email');
    let acces_token = localStorage.getItem("access_token");

    let params = {};
    let additionalParams = {
        headers:{
            'Authorizationtoken':'Bearer ' + acces_token
        },
    }

    let body ={
        "email":emailAdmin,
    };
  
    apigClient.actionsListRolesPost(params,body,additionalParams)
    .then( (result) => {
        console.log(result)

        const ul = document.querySelector(".rolesUl"); 
        ul.innerHTML = "";
        
        for (let i = 0; i < result.data.roles.length; i++) {
          const li = document.createElement("li");
          li.classList.add("list-group-item", "list-group-item-secondary");
        
          const radio = document.createElement("input");
          radio.classList.add("form-check-input", "me-1");
          radio.setAttribute("type", "radio");
          radio.setAttribute("name", "roles"); // set the same name for all radio inputs to create a group
          radio.setAttribute("value", result.data.roles[i].id);
          radio.setAttribute("aria-label", "...");
        
          const text = document.createTextNode(result.data.roles[i].name);
        
          li.appendChild(radio);
          li.appendChild(text);
        
          ul.appendChild(li); 
        }
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
    })

    apigClient.actionsListScopesApiPost(params,body,additionalParams)
    .then( (result) => {
        console.log(result)

        const ul = document.querySelector(".scopesUl"); 
        ul.innerHTML = ""

        for (let i = 0; i < result.data.scopes.length; i++) {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "list-group-item-secondary");

        const checkbox = document.createElement("input");
        checkbox.classList.add("form-check-input", "me-1");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name","scopes")
        checkbox.setAttribute("value", result.data.scopes[i].value);
        checkbox.setAttribute("aria-label", "...");

        const text = document.createTextNode(result.data.scopes[i].value);

        li.appendChild(checkbox);
        li.appendChild(text);

        ul.appendChild(li); 
        }
    })
    .catch((err)=>{
        console.log(err)
        resultData.innerHTML = JSON.stringify(err.data);
    })
})


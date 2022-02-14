async function callWebService (url, sentData = {}) {
  let data;
  let response = await fetch (url, { 
    method: "POST",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify(sentData)        
  });
  data = await response.json();
  return data;
}

let usernameTxtRef = document.querySelector("#username");
let pwdTxtRef = document.querySelector("#password");

let signInBtnRef = document.querySelector("#signIn");

let status = true;

signInBtnRef.addEventListener("click", () => {
    
    if (usernameTxtRef.value && pwdTxtRef.value) {
        let uname = usernameTxtRef.value;
        let pwd = pwdTxtRef.value;
        var valid = true;
        let condition = {
          "condition": {
              "username": uname,
              "pwd": pwd
          }
        }
        callWebService("/login/validate", condition).then((data) => {
            console.log(data); 
            if (data.message === 'go to admin page!')
              window.location = "/adminUser";
            else if (data.message === 'go to normal page!')
              window.location = "/teasearch";
            else 
            alert("Wrong password!");
        });
    } else if (!usernameTxtRef.value) {
        alert("Please provide your username");
    } else if (!pwdTxtRef.value) {
        alert("Please provide your password");
    }
});


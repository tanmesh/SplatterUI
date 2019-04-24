// function signup() {
//     let firstName = document.getElementById('firstName').value;
//     let lastName = document.getElementById('lastName').value;
//     let emailId = document.getElementById('emailId').value;
//     let password = document.getElementById('password').value;
//     signUpUser(firstName, lastName, emailId, password)
// }

const fetch = require("node-fetch");

function signUpUser(firstName, lastName, emailId, password) {
    fetch('http://localhost:39114/auth/signup', {
        method: 'post',
        body: JSON.stringify({"firstName": firstName, "lastName": lastName, "emailId": emailId, "password": password}),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => {
            if (!res.ok) {
                return [];
            }
            // window.location.replace("http://stackoverflow.com");
            return res.json();
        },
        error => {
            console.log(error);
            return [];

        }).catch(error => {
        console.log(error);
    })
}

module.exports = signUpUser;
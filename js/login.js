// function login() {
//     let emailId = document.getElementById('uname').value
//     let password = document.getElementById('psw').value
//     loginUser(emailId, password)
// }

const fetch = require("node-fetch");

function loginUser(emailId, password, next) {
    fetch('http://localhost:39114/auth/login', {
        method: 'post',
        body: JSON.stringify({"emailId": emailId, "password": password}),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => {
            if (!res.ok) {
                return [];
            }
            res.json().then(function(data) {
                return next(data);
            });
        },
        error => {
            console.log(error);
            return [];

        }).catch(error => {
        console.log(error);
    })
}

module.exports = loginUser;
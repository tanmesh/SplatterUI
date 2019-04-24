function login() {
    let emailId = document.getElementById('uname').value
    let password = document.getElementById('psw').value
    loginUser(emailId, password)
}

function loginUser(emailId, password) {
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
            return res.json();
        },
        error => {
            console.log(error);
            return [];

        }).catch(error => {
        console.log(error);
    })
}

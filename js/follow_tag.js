const fetch = require("node-fetch");

function followTag(tagName, accessToken, next) {
    console.log(tagName);
    console.log(accessToken);
    fetch('http://localhost:39114/user/followTag', {
        method: 'POST',
        body: tagName,
        headers: {
            "Content-Type": "application/json",
            "x-access-token": accessToken,
        },
    }).then(res => {
            if (!res.ok) {
                return [];
            }
            res.json().then(function (data) {
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

module.exports = followTag;
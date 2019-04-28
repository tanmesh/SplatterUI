const fetch = require("node-fetch");

function getUserFeed(accessToken, next) {
    fetch('http://localhost:39114/user/feed', {
        method: 'get',
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


module.exports = getUserFeed;

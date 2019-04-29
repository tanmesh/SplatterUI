/* eslint-disable new-cap */
'use strict';

const debug = require('debug')('info');

var signUpUser = require('../js/signup');
var loginUser = require('../js/login');
var getAllTags = require('../js/get_all_tags');
var followTag = require('../js/follow_tag');
var getProfile = require('../js/get_profile');
var getUserFeed = require('../js/user_feed');

const PORT = process.env.PORT || 8031;

module.exports = (app, router) => {

    function authenticated(req, res, next) {
        req.cookies.user ? next() : res.redirect('/login');
    }

    function register(firstName, lastName, emailId, password, next) {
        signUpUser(firstName, lastName, emailId, password);
        next();
    }

    function login(emailId, password, next) {
        loginUser(emailId, password, next);
    }

    function tags(accessToken, next) {
        getAllTags(accessToken, next);
    }

    function follow(tagName, accessToken, next) {
        followTag(tagName, accessToken, next);
    }

    function profile(accessToken, next) {
        getProfile(accessToken, next);
    }

    function getFeed(accessToken, next) {
        getUserFeed(accessToken, next);
    }

    app.use(require('sanitize').middleware);

    router
        .get('/del', (req, res) => {
            res.cookie('user', '', {maxAge: Date.now()});
            res.redirect('/')
        });

    router
        .get('/cookies', (req, res) => {
            res.send(req.cookies);
        });

    router
        .get('/', (req, res) => {
            if (req.cookies.user) {
                // Logged in index
                res.redirect('/profile');
            } else {
                res.render('welcome', {title: 'Food Social Network', accessToken: false});
            }
        });

    router
        .get('/register', (req, res) => {
            if (req.cookies.user) {
                return res.redirect('/');
            }

            res.render('register', {title: 'Register',  accessToken: false});
        })
        .post('/register', (req, res) => {
            if (req.cookies.user) {
                console.log("Already logged in");
                return res.redirect('/');
            }

            if (!req.body.first_name || !req.body.last_name || !req.body.email_id || !req.body.password) {
                req.flash('info', 'Input not provided');

                return res.render('register');
            }
            register(req.body.first_name, req.body.last_name, req.body.email_id, req.body.password, () => {
                console.log(`user "${req.body.email_id}" registered successfully`);

                res.redirect('/')
            });
        });

    router
        .get('/profile', (req, res) => {
            profile(req.cookies.user.accessToken, (resp) => {
                console.log(resp);
                res.render('profile', {user: resp,  accessToken: true});
            });
        });

    router
        .get('/feed', (req, res) => {
            getFeed(req.cookies.user.accessToken, (resp) => {
                console.log(resp);
                res.render('feed', {feed: resp, user: req.cookies.user, accessToken: true});
            });
        });

    router
        .get('/tags', (req, res) => {
            tags(req.cookies.user.accessToken, resp => {
                console.log(resp);
                res.render('tag', {tags: resp, accessToken: true});
            });
        });

    router
        .post('/followTag', (req, res) => {
            console.log(Object.keys(req.body)[0]);
            follow(Object.keys(req.body)[0], req.cookies.user.accessToken, resp => {
                res.redirect('/tags')
            });
        });


    router
        .get('/login', (req, res) => {
            if (req.cookies.user) {
                return res.redirect('/');
            }

            res.render('login', {title: 'Login'});
        })
        .post('/login', (req, res) => {
            // if the user is already logged in just redirect home
            if (req.cookies.user) {
                return res.redirect('/');
            }

            if (!req.body.emailId || !req.body.password) {
                req.flash('info', 'Username/password not provided');
                return res.render('login');
            }

            login(req.body.emailId, req.body.password, (user) => {
                console.log(user);
                if (!user) {
                    console.log('user doesnt exist');
                    // user probably doesn't even exist lol
                    req.flash('info', 'User does not exist');
                    return res.render('login');
                }

                // Authentication cookie lasts 60 mins
                res.cookie('user', user, {maxAge: 1000 * 60 * 60});

                res.redirect('/')
            });
        });

    router
        .get('/logout', (req, res) => {
            res.clearCookie('user');
            res.redirect('/');
        });

    app
        .get('/404', (req, res) => {
            // just redirect home for now. TODO: Change this to warning message
            res.redirect('/');
        })
    app
        .listen(PORT, () => {
            debug(`Watching ${PORT} for changes`);
        });

    app.use('/', router);
};

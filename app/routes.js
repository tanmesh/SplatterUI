/* eslint-disable new-cap */
'use strict';

const debug = require('debug')('info');

var signUpUser = require('../js/signup');
var loginUser = require('../js/login');
var getAllTags = require('../js/get_all_tags');
var followTag = require('../js/follow_tag');
var getProfile = require('../js/get_profile');

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

    function tags(next) {
        getAllTags(next);
    }

    function follow(tagName, accessToken, next) {
        followTag(tagName, accessToken, next);
    }

    app.use(require('sanitize').middleware);

    router
        .get('/cookies', (req, res) => {
            res.send(req.cookies);
        });

    router
        .get('/', (req, res) => {
            if (req.cookies.user) {
                // Logged in index
                res.render('profile', {title: 'Feed'})
                // User.find({}, (err, users) => {
                //     if (err) throw err;
                //     // just list all users at the moment
                //     res.render('home', {title: 'Home', users: users})
                // })
            } else {
                res.render('welcome', {title: 'Food Social Network'});
            }
        });

    router
        .get('/register', (req, res) => {
            if (req.cookies.user) {
                return res.redirect('/');
            }

            res.render('register', {title: 'Register'});
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
        .get('/tags', (req, res) => {
            tags(resp => {
                res.render('tag', {tags: resp});
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
        .get('/delete/:id', (req, res) => {
            res.render('delete');
        })
        .post('/delete/:id', (req, res) => {
            console.log('deleting: ' + req.params.id);
            User
                .findById(req.params.id)
                .remove()
                .exec()
                .then(user => {
                    res.clearCookie('user', {path: '/'})
                    req.flash('info', 'Your account has been deleted')
                    res.render('index')
                })
                .catch(err => {
                    throw err
                });
        });

    app
        .get('/@:username', (req, res) => {
            if (!req.params.username) res.redirect('/404');

            User.findOne({username: req.params.username}, (err, user) => {
                if (err) throw err;
                var admin;

                if (req.cookies.user == user._id) {
                    // this is the logged in user
                    admin = true;
                } else {
                    // this is just a user viewing a profile
                    admin = false;
                }

                res.render('profile', {user: user, admin: admin})
            })
        })
        .post('/@:username', authenticated, (req, res) => {
            if (!req.body.bio) res.redirect('/@' + req.params.username);

            User.findById(req.cookies.user, (err, user) => {
                if (user.username == req.params.username) {
                    // this user is authorized to edit bio
                    user.bio = req.body.bio;
                    user.save((err) => {
                        if (err) throw err;

                        console.log('Saved bio');
                    })
                } else {
                    redirect('/@' + req.params.username)
                }
            })
        })

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

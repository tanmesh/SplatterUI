var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// var logger = function (req, res, next) {
//     console.log('Logging...');
//     next();
// };
//
// app.use(logger);

// app.use(require('./routes'));
//

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// View Engine
// app.set('view engine', 'ejs');
// app.set('views1', path.join(__dirname, 'views1'));

// Set static path
app.use(express.static(path.join(__dirname, '/public')));

var person = [{
    name: 'Nilesh',
    age: 30
}];

var users = [
    {
        id: 1,
        first_name: 'Nilesh',
        last_name: 'Mishra',
        email: 'nilmish.iit@gmail.com',
    },
    {
        id: 2,
        first_name: 'Nilesh1',
        last_name: 'Mishra1',
        email: 'nilmish.iit@gmail.com',
    },
    {
        id: 3,
        first_name: 'Nilesh2',
        last_name: 'Mishra2',
        email: 'nilmish.iit@gmail.com',
    },
];

app.get('/', function (req, res) {
    // // res.send('hello');
    // var title = 'Customer';
    // res.render('index', {
    //     title: 'Customers',
    //     users: users
    // });
    // res.render('index');
    // res.json(person);
    res.sendFile(path.join(__dirname+'/public/signup.html'));
    res.redirect('/')
});

app.post('/users/add', function (req, res) {
    var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
    };
    console.log(newUser)
});

app.get('/hello', function (req, res) {
    res.send('hello world');
});

app.listen(3000, function () {
    console.log('server started on port 3000');
});
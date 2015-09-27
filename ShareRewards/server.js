var express = require('express'),
    //appUtil = require('./utility.js');
    bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//login = require('./routes/login');
//app.set('appUtil',appUtil);
requestrewards = require('./routes/request');
users = require('./routes/users');
bids = require('./routes/bids');


app.get('/users/:id', users.findById);
app.get('/requestrewards/', requestrewards.addRequest);
app.get('/getreqstatus/:id',requestrewards.findById);


//app.post('/login', login.doLogin);

app.listen(3000);
console.log('Listening on port 3000...');

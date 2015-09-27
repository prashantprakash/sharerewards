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
bids = require('./routes/bid');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/users/:id', users.findById);
app.get('/getallrequests/:uname',requestrewards.getRequests)
app.post('/requestrewards/', requestrewards.addRequest);
app.get('/getreqstatus/:id',requestrewards.findById);
app.get('/getbidsrequest/:id',requestrewards.getBidsForRequest);
app.get('/getreqstatusrewards/:userid',requestrewards.getRequestsRewards);

app.post('/bids/:id', bids.bidForRequest);
app.post('/bids/accept', bids.acceptBid);

//app.post('/login', login.doLogin);

app.listen(3000);
console.log('Listening on port 3000...');

var express = require('express'),
	requestrewards = require('./routes/request'),
    users = require('./routes/users');

var app = express();

app.get('/users/:id', users.findById);
app.get('/requestrewards/', requestrewards.addRequest)
app.get('/getreqstatus/:id',requestrewards.findById)

app.listen(3000);
console.log('Listening on port 3000...');
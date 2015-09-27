var express = require('express'),
    wines = require('./routes/users');

var app = express();

app.get('/users/:id', wines.findById);

app.listen(3000);
console.log('Listening on port 3000...');
var express = require('express'),
    appUtil = require('./utility.js');
    bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

wines = require('./routes/users');
login = require('./routes/login');

app.set('appUtil',appUtil);

app.get('/users/:id', wines.findById);

app.post('/login', login.doLogin);

app.listen(3000);
console.log('Listening on port 3000...');

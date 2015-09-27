var mongo = require('mongodb');
var url = require('url');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('sharerewards', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'sharerewards' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'sharerewards' collection doesn't exist. Creating it with sample data...");
       
            }
        });
    }
});

exports.findById = function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var uname = query.username;
    var pwd = query.password
    console.log('Retrieving user: ' + uname);
    db.collection('users', function(err, collection) {
        collection.findOne({'username':uname,'password':pwd}, function(err, item) {
            res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
            res.send(item);
        });
    });
};
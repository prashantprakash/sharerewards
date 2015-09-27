var mongo = require('mongodb');

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
    var uname = req.params.username;
    var pwd = req.params.password
    console.log('Retrieving user: ' + uname);
    db.collection('users', function(err, collection) {
        collection.findOne({'username':uname,'password':pwd}, function(err, item) {
            res.send(item);
        });
    });
};
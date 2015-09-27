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
        db.collection('rewardrequest', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'sharerewards' collection doesn't exist. Creating it with sample data...");
       
            }
        });
    }
});



exports.addRequest = function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var reqObj = {cust_id : query.cust_id , reward_amt : query.reward_amt , request_status:"pending", request_date:query.request_date,return_date:"",bid_cust_id:"",bid_reward_amt:"",bit_days:"",bid_return_amt:""}
    db.collection('rewardrequest', function(err, collection) {
        collection.insert(reqObj, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
                res.send(result);
            }
        });
    });
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving status: ' + id);
    db.collection('rewardrequest', function(err, collection) {
        collection.findOne({'_id':new mongo.ObjectID(id)}, function(err, item) {
            res.send(item);
        }); 
    });
};

exports.getRequests = function(req, res) {
    var uname = req.params.uname;
    db.collection('users', function(err, collection) {
        collection.findOne({'username':uname}, function(err, item) {
            console.log(item);
            console.log(item.amount)
            db.collection('rewardrequest', function(err, collection) {
                collection.find({$where: function() { return ( this.amount >   item.amount); } }).toArray(function(err, items) {
                res.send(items);
                });
            });
        }); 
    });
    
};



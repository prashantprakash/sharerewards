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
    var cust_id = parseInt(query.cust_id,10);
    var reward_amt = parseInt(query.reward_amt,10);
    var reqObj = {cust_id : cust_id , reward_amt : reward_amt , request_status:"pending", request_date:query.request_date,return_date:"",bid_cust_id:"",bid_reward_amt:"",bid_days:"",bid_return_amt:""}
    db.collection('rewardrequest', function(err, collection) {
        collection.insert(reqObj, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                collection.find({cust_id:cust_id,request_status:"pending"}).toArray(function(err, items) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
                res.send(items);
                });
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
    var cust_id = parseInt(req.params.id,10);
    console.log("asdasdas");
    db.collection('users', function(err, collection) {
        collection.findOne({'cust_id':cust_id}, function(err, item) {
            var amount = parseInt(item.amount);
            console.log(amount);
            db.collection('rewardrequest', function(err, collection) {
                collection.find({$and :[ { 'cust_id': { $ne: cust_id } }, { 'reward_amt': { $lte: amount } } ]}).toArray(function(err, items) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
                res.send(items);
                });
            });
        }); 
    });
    
};


exports.getBidsForRequest = function(req, res) {
    var requestid = req.params.id;
    console.log(requestid);
    db.collection('bids', function(err, collection) {
        collection.find({request_id: requestid}).toArray(function(err, items) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
                res.send(items);
        });
    });
    
};


exports.getRequestsRewards = function(req, res) {
    var userid = parseInt(req.params.userid,10);
    db.collection('rewardrequest', function(err, collection) {
        collection.find({cust_id: userid}).toArray(function(err, items) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
                res.send(items);
        });
    });
    
};

exports.getLendRewards = function(req, res) {
    var userid = parseInt(req.params.userid,10);
    db.collection('rewardrequest', function(err, collection) {
        collection.find({bid_cust_id: userid , request_status : {$ne :'pending'}}).toArray(function(err, items) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
                res.send(items);
        });
    });
    
};




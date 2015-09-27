/**
 * Created by himanshusoni on 9/27/15.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
  Db = mongo.Db,
  BSON = mongo.BSONPure;

var server = new Server('10.33.62.106', 27017, {auto_reconnect: true});
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

exports.bidForRequest = function(req,res){
  var request_id = req.body.request_id;
  var bid_cust_id = req.body.bid_cust_id;
  var bid_reward_amt = req.body.bid_reward_amt;
  var bid_data = req.body.bid_data;
  var currentTime = new Date();

  db.collection('bids', function(err, collection) {
    db.collection.insert({
        request_id: request_id,
        bid_cust_id: bid_cust_id,
        bid_reward_amt: bid_reward_amt,
        bid_days: bid_days,
        bid_date: bid_date
      }, {safe: true},
      function (err, result) {
        if (err) {
          res.send({'error': 'An error has occurred'});
        } else {
          console.log('Success: ' + JSON.stringify(result));
          res.send(result);
        }
      });
  });
};

// Not needed, Can use bid for re-bid
exports.reBidForRequest = function(){

};

exports.acceptBid = function(req,res){
  var request_id = req.body.request_id;
  var bid_accepted = req.body.bid_acepted;

  var performTransaction = function(){

  };

  db.collection('rewardrequest', function(err, collection) {
    db.collection.update(
      {"request_id": request_id},
      {
        $set: {"request_status": "Reward Loaned"}
      },function(err,result){
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          console.log('Success: ' + JSON.stringify(result));
          res.send(result);
        }
    });
  });
};

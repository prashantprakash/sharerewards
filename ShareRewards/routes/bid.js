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
  var request_id = req.body.id;
  var bid_cust_id = req.body.bid_cust_id;
  var bid_reward_amt = req.body.bid_reward_amt;
  var bid_days = req.body.bid_days;
  var currentTime = new Date();

  db.collection('bids', function(err, table) {
    if(err){
      console.log(err);
    }else {
      table.insert({
          request_id: request_id,
          bid_cust_id: bid_cust_id,
          bid_reward_amt: bid_reward_amt,
          bid_days: bid_days,
          bid_date: currentTime
        }, {safe: true},
        function (err, result) {
          if (err) {
            res.send({'error': 'An error has occurred'});
          } else {
            console.log('Success: ' + JSON.stringify(result));
            res.send(result);
          }
        });
    }
  });
};

// Not needed, Can use bid for re-bid
exports.reBidForRequest = function(){

};

exports.acceptBid = function(req,res){
  var request_id = req.body.request_id;
  var bid_accepted = req.body.bid_accepted;
  var cust_id = req.body.cust_id;
  var bid_cust_id = req.body.bid_cust_id;
  var reward_amt = req.body.reward_amt;

  var performTransaction2 = function(table){
    table.update(
      {"cust_id": cust_id},
      {
        $inc: {"amount": reward_amt}
      },function(err,result){
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          console.log('Success - update : ' + JSON.stringify(result));
          //res.send(result);

          // Second transaction complete.
          // Now notify the bidder.
        }
      });
  };
  var performTransaction1 = function(){
    db.collection('users', function(err, table) {
      table.update(
        {"cust_id": cust_id},
        {
          $inc: {"amount": reward_amt}
        },function(err,result){
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            console.log('Success - update : ' + JSON.stringify(result));
            //res.send(result);

            performTransaction2(table);
          }
        });
    });
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
          console.log('Success - update : ' + JSON.stringify(result));
          //res.send(result);
          performTransaction1();
        }
    });
  });
};

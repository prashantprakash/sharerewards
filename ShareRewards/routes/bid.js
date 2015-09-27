/**
 * Created by himanshusoni on 9/27/15.
 */

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

exports.bidForRequest = function(req,res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  console.log(query); 
  var request_id = query.id;
  var bid_cust_id = parseInt(query.bid_cust_id,10);
  var bid_reward_amt = parseInt(query.bid_reward_amt,10);
  var bid_days = parseInt(query.bid_days,10);
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
            // update request table to bidon
            db.collection('users', function(err, collection) {
                collection.update({'_id':new mongo.ObjectID(request_id)},{$set : {request_status : "bidon"}}, {safe:true}, function(err, result) {
                  if (err) {
                    console.log('Error updating wine: ' + err);
                    res.send({'error':'An error has occurred'});
                  } else {
                    console.log('' + result + ' document(s) updated');
                }
            });
          });
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
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
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  console.log(query); 
  var bid_id = query.bid_id;
  var request_id = query.request_id;
  var bid_accepted = query.bid_accepted;
  var cust_id = query.cust_id;
  var bid_cust_id = query.bid_cust_id;
  var reward_amt = parseInt(query.reward_amt);

  var updateRequest = function(){
    db.collection('bids', function(err, table) {
      table.findOne({'_id':new mongo.ObjectID(bid_id)}, function(err, item) {
        if(err){
          res.send({'error':'An error has occurred'});
        } else {
          console.log('Success - update : ' + JSON.stringify(item));
          delete item._Id;

          db.collection('rewardrequest',function(err,table){
            table.update({'_Id' : new mongo.ObjectID(request_id)},{$set : {bid_cust_id:bid_cust_id,request_status:bid_accepted,bid_reward_amt:reward_amt}}),function(err,item){
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
              res.send(item);
            };
          });
        }
      });
    });
  };

  var performTransaction2 = function(table){
    table.update(
      {"cust_id": cust_id},
      {
        $inc: {"amount": -reward_amt}
      },function(err,result){
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          console.log('Success - update : ' + JSON.stringify(result));
          //res.send(result);

          // Second transaction complete.
          // Now notify the bidder.
          updateRequest();
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
    collection.update(
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

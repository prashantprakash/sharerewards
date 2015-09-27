/**
 * Created by himanshusoni on 9/27/15.
 */

var mongo = require('mongodb');
var url = require('url');

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
  //var bid_accepted = query.bid_accepted;
  var cust_id = query.cust_id;
  var bid_cust_id = query.bid_cust_id;
  var reward_amt = parseInt(query.reward_amt);

  var updateRequest = function(){
    // Get the details for the bid using bid_id
    db.collection('bids', function(err, table) {
      table.findOne({'_id':new mongo.ObjectID(bid_id)}, function(err, result) {
        if(err){
          res.send({'error':'An error has occurred in finding bid for update request'});
        } else {
          console.log('Success - update : ' + JSON.stringify(result));
          delete result._id;
          delete result.request_id;

          // update the rewardrequest row with bid values.
          db.collection('rewardrequest', function (err, table) {
            console.log('Now, update in rewards request ',JSON.stringify(result));
            result.request_status = "Reward Loaned";
            table.update({'_id': new mongo.ObjectID(request_id)}, {$set: result}, function (err, result) {
              if (err) {
                res.send({'error': 'An error has occurred in update request'});
              } else {
                console.log('Success - update in update request : ' + JSON.stringify(result));
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

                res.send(result);
              }
            });
          });
        }
    });
    });
  };

  var performTransaction2 = function(table){
    table.update(
      {"cust_id": parseInt(bid_cust_id)},
      {
        $inc: {"rewards_points": -reward_amt}
      },function(err,result){
        if (err) {
          res.send({'error':'An error has occurred in performTransaction 2'});
        } else {
          console.log('Success - update in performTransaction 2 : ' + JSON.stringify(result));
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
        {"cust_id": parseInt(cust_id)},
        {
          $inc: {"rewards_points": reward_amt}
        },function(err,result){
          if (err) {
            res.send({'error':'An error has occurred in performTransaction 1' + err});
          } else {
            console.log('Success - update in performTransaction 1 : ' + JSON.stringify(result));
            //res.send(result);

            performTransaction2(table);
          }
        });
    });
  };


/*  db.collection('rewardrequest', function(err, collection) {
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

        }
    });
  });*/

  performTransaction1();
};

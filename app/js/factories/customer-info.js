(function() {
  'use strict';

  angular
  .module('myApp')
  .factory('customerInfo', customerInfo);

  customerInfo.$inject = ['$http', '$q'];

  function customerInfo($http, $q){

    var IPADDRESS = "10.33.62.106:3000";
    var loginCustomer = "1123";
    var bidDays = "10";
    var Uname = "Alex",
        password = "Alex";

    var service = {
      getcustomerProfileData: getcustomerProfileData,
      sendRequestInformation: sendRequestInformation,
      getTables: getTables,
      getNotifications: getNotifications,
      placeBid: placeBid,
      getBidsRequest : getBidsRequest,
      setBidAcceptedData : setBidAcceptedData,
      getLendTable: getLendTable
    };
    return service;

    function getTables(){
      var myDataDeferred = $q.defer();
      $http({
        method : 'GET',
        url : "http://"+IPADDRESS+"/getreqstatusrewards/"+loginCustomer,
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      }).success(function(result) {
        myDataDeferred.resolve(result);
      }).error(function(error) {
        myDataDeferred.reject(error);
      });
      return myDataDeferred.promise;
    }

    function getNotifications(){
      var myDataDeferred = $q.defer();
      $http({
        method : 'GET',
        url : "http://"+IPADDRESS+"/getallrequests/"+loginCustomer,
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      }).success(function(result) {
        myDataDeferred.resolve(result);
      }).error(function(error) {
        myDataDeferred.reject(error);
      });
      return myDataDeferred.promise;
    }

    function getBidsRequest(id){
      var myDataDeferred = $q.defer();
      $http({
        method : 'GET',
        url : "http://"+IPADDRESS+"/getbidsrequest/"+id,
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      })
      .success(function(result) {
        myDataDeferred.resolve(result);
      }).error(function(error) {
        myDataDeferred.reject(error);
      });
      return myDataDeferred.promise;
    }

    function setBidAcceptedData(data){
      var myDataDeferred = $q.defer();
      $http({
        method : 'POST',
        url : "http://"+IPADDRESS+"/bids/accept/?bid_id="+data[0]._id+"&request_id="+data[0].request_id+"&bid_accepted="+"Accepted"+"&cust_id="+loginCustomer+"&bid_cust_id="+data[0].bid_cust_id+"&reward_amt="+data[0].bid_reward_amt,
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      })
      .success(function(result) {
        myDataDeferred.resolve(result);
      }).error(function(error) {
        myDataDeferred.reject(error);
      });
      return myDataDeferred.promise;
    }

    function placeBid(amount, id){
      var myDataDeferred = $q.defer();
      $http({
        method : 'POST',
        url : "http://"+IPADDRESS+"/placebids/?id="+id+"&bid_cust_id="+loginCustomer+"&bid_reward_amt="+amount+"&bid_days="+bidDays,
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      })
      .success(function(result) {
        myDataDeferred.resolve(result);
      }).error(function(error) {
        myDataDeferred.reject(error);
      });
      return myDataDeferred.promise;
    }

    function getcustomerProfileData(){
      var myDataDeferred = $q.defer();
      $http({
        method : 'GET',
        url : "http://"+IPADDRESS+"/users/?username="+Uname+"&password="+password,
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      })
      .success(function(result) {
        myDataDeferred.resolve(result);
      }).error(function(error) {
        myDataDeferred.reject(error);
      });
      return myDataDeferred.promise;
    }

    function getLendTable(url){
      var myDataDeferred = $q.defer();
      $http({
        method : 'GET',
        url : "http://"+IPADDRESS+"/getlendrewards/"+loginCustomer,
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      })
      .success(function(result) {
        myDataDeferred.resolve(result);
      }).error(function(error) {
        myDataDeferred.reject(error);
      });
      return myDataDeferred.promise;
    }

    function sendRequestInformation(sendData){
      var myDataDeferred = $q.defer();
      $http({
        method : 'POST',
        url : "http://"+IPADDRESS+"/requestrewards/?cust_id="+sendData.cust_id+"&reward_amt="+sendData.reward_amt+"&request_date="+sendData.request_date,
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      })
      .success(function(result) {
        myDataDeferred.resolve(result);
      }).error(function(error) {
        myDataDeferred.reject(error);
      });
      return myDataDeferred.promise;
    }

  }

})();

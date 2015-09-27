(function() {
  'use strict';
  angular
  .module('myApp')
  .controller('DashBoardController', DashBoardController);

  DashBoardController.$inject = ['$stateParams', 'customerInfo', '$interval'];

  function DashBoardController($stateParams, customerInfo, $interval) {
    var vm = this;
    var GETCUSTOMERPROFILEURL = "/app/url/";
    vm.customerId = $stateParams.customerId;
    vm.placeNotification = placeNotification;
    vm.removeNotification= removeNotification;

    // $interval(function(){
    //   init();
    // },1000);

    vm.borrowTotal = 0;
    vm.lendTotal = 0;

    init();
    function init() {
      getCustomerProfileData(); // Get customer Profile Data
      getTables();
      getNotifications();
      getLendTable();
    }

    function getTables(){
      customerInfo.getTables().then(function(response) {
        vm.activityTable = response;
        vm.borrowTable = response;
        getBidsRequest();
        if(vm.borrowTable){
          for(var i = 0 ;i < vm.borrowTable.length; i++){
              vm.borrowTotal += vm.borrowTable[i].reward_amt;
          }
        }
      });
    }

    function getNotifications(){
      vm.bidData=[];
      customerInfo.getNotifications().then(function(response) {
        vm.notificationData = response;
        console.log(response);
        for(var i in vm.notificationData){
          vm.bidData.push(null);
        }
      });
    }

    function placeNotification(index, amount, id){
      if(amount && (!isNaN(parseFloat(amount)) && isFinite(amount))){
        vm.bidData[index] = amount;
        customerInfo.placeBid(amount, id);
      }
    }

    function removeNotification(id){
      console.log(id);
    }

    vm.submitRequest = function() {
      var date = getDate();
      if(vm.requestAmount && (!isNaN(parseFloat(vm.requestAmount)) && isFinite(vm.requestAmount))){
        var sendData = {
          cust_id: 112,
          reward_amt: vm.requestAmount,
          request_date: date
        }
        customerInfo.sendRequestInformation(sendData).then(function(response) {
          vm.requestAmount="";
          vm.activityTable = response;
          vm.borrowTable = response;
          console.log(response);
        });
      }
    }

    function getDate(){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) {
        dd='0'+dd
      }
      if(mm<10) {
        mm='0'+mm
      }
      today = mm+'/'+dd+'/'+yyyy;

      return today;
    }

    function getBidsRequest(){
      vm.getAllBids = [];
      for(var i = 0; i <vm.borrowTable.length; i++){
        customerInfo.getBidsRequest(vm.borrowTable[i]._id).then(function(response) {
          vm.getAllBids.push(response);
        });
      }
    }

    vm.acceptBid = function(bidDataAccepted, index){
      customerInfo.setBidAcceptedData(bidDataAccepted).then(function(response) {
      });
      vm.getAllBids.splice(index, 1);
      init();
    }

    vm.declineBid = function(index){
      vm.getAllBids.splice(index, 1);
    }

    vm.bidOpenModal = function(index){
      vm.bidIndexModalOpen = index;
    }

    function getCustomerProfileData () {
      customerInfo.getcustomerProfileData().then(function(response) {
        vm.customerProfileData = response;
      });
    }

    vm.activityTable = 	{};
    vm.lendTable = 	{};
    vm.borrowTable = 	{};

    vm.sortActivityTable = {
      column: '',
      descending: false
    };
    vm.sortLendTable = {
      column: '',
      descending: false
    };
    vm.sortBorrowTable = {
      column: '',
      descending: false
    };

    function getLendTable(){
      customerInfo.getLendTable().then(function(response) {
        vm.lendTable = response;
        if(vm.lendTable){
          for(var i = 0 ;i < vm.lendTable.length; i++){
            vm.lendTotal += vm.lendTable[i].bid_reward_amt;
          }
        }
      });
    }

    vm.changeSorting = function(column, tableNumber) {
      if(tableNumber === 1){
        var sort = vm.sortActivityTable;
        if (sort.column == column) {
          sort.descending = !sort.descending;
        } else {
          sort.column = column;
          sort.descending = false;
        }
        vm.sortActivityTable = sort;
      } else if(tableNumber === 2){
        var sort = vm.sortLendTable;
        if (sort.column == column) {
          sort.descending = !sort.descending;
        } else {
          sort.column = column;
          sort.descending = false;
        }
        vm.sortLendTable = sort;
      } else if(tableNumber === 3){
        var sort = vm.sortBorrowTable;
        if (sort.column == column) {
          sort.descending = !sort.descending;
        } else {
          sort.column = column;
          sort.descending = false;
        }
        vm.sortBorrowTable = sort;
      }
    };

    vm.payBack = function(id) {
      console.log(id);
    }

  }
})();

(function() {
  'use strict';

  angular
  .module('myApp')
  .directive('chartsDisplay', chartsDisplay);

  function chartsDisplay() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'views/chart.html',
      scope: {},
      link: linkFunc,
      controller: chartDirectiveController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function linkFunc(scope, element, attribute, controller) {
      var elementResult = element[0].getElementsByClassName('container');
      controller.init(elementResult, attribute.data);
    }
  }

  chartDirectiveController.$inject = ['$scope','highChartDataService', '$q'];

  function chartDirectiveController($scope, highChartDataService, $q) {
    var vm = this;
    vm.init = init;

    function init(elementResult, data) {
      vm.elementResult = elementResult;
      vm.data = data;
      displayGraph(vm.elementResult, data);
    }

    function displayGraph(elementResult, data) {
      $(elementResult).highcharts({
        chart: {
          type: drillDownGraph,
          zoomType: 'x',
          panning: true,
          panKey: 'shift'
        },

        exporting: {
          enabled: true
        },

        legend: {
          borderRadius: 5,
          borderWidth: 1
        },

        credits: {
          text: 'ADP',
          href: 'http://www.adp.com'
        },

        title: {
          text: dataMTD.metricName
        },

        xAxis: {
          title: {
            enabled: true,
            style: {
              fontWeight: 'normal'
            }
          },
          type: 'category'
        },

        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat: '<small>{series.name}</small><table>',
          pointFormat: '<tr><td style="color: {point.color}">{point.name}: </td> <td style="text-align: right"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          valueDecimals: 2
        },

        yAxis: {
          title: {
            enabled: true,
            text: dataMTD.yaxisTitle,
            style: {
              fontWeight: 'normal'
            }
          }
        },

        plotOptions: {
          series: {
            animation: {
              duration: 2000,
              easing: 'easeOutBounce',
              shadow: true
            },
            cursor: 'pointer'
          },
          pie: {
            showInLegend: true,
            allowPointSelect: true,
            slicedOffset: 20,
            cursor: 'pointer',
            sliced: true,
            innerSize: 100,
            depth: 45
          }
        },


        series: [{
          name: dataMTD.metricValues.columns[0].columnName,
          colorByPoint: true,
          data: [{
            name: 'Month',
            y: dataMTD.summary.bindings[0].value,
            drilldown: 'month'
          }, {
            name: 'Quarter',
            y: dataQTD.summary.bindings[0].value,
            drilldown: 'quarter'
          }, {
            name: 'Year',
            y: dataYTD.summary.bindings[0].value,
            drilldown: 'year'
          }],
          type: originalGraph
        }],
        drilldown: {
          series: [{
            name: dataMTD.metricValues.columns[drillDownIdIndex].columnName,
            id: 'month',
            data: highChartDataService.convertAdapter(dataMTD.metricValues.rows, drillDownIdIndex, drillDownValueIndex)
          }, {
            name: dataMTD.metricValues.columns[drillDownIdIndex].columnName,
            id: 'quarter',
            data: highChartDataService.convertAdapter(dataQTD.metricValues.rows, drillDownIdIndex, drillDownValueIndex)
          }, {
            name: dataMTD.metricValues.columns[drillDownIdIndex].columnName,
            id: 'year',
            data: highChartDataService.convertAdapter(dataYTD.metricValues.rows, drillDownIdIndex, drillDownValueIndex)
          }]
        }
      },function(chart){
      });
    }

  }
})();

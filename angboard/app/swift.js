/*
Questions for Richard:

1/ Are GETs cached?

*/


var appControllers = angular.module('appControllers');


appControllers.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/swift', {
      templateUrl: 'app/partials/swift.html'
    });
  }
]);


appControllers.run([
  'menuService',
  function (menuService) {
    var menu = {'title': 'Swift', 'action': '#', 'menus': []};
    menu.menus.push({'title': 'Swift', 'action': '#/swift'});
    menuService.menus.push(menu);
  }
]);


// the name prefixes on some elements cause trNgGrid to have issues, so just
// strip them off
function filterNames(array) {
  var narray = [];
  angular.forEach(array, function (object) {
    var nobj = {};
    angular.forEach(object, function (value, key) {
      var nkey = key.replace(/(^.+?:)/, '');
      nobj[nkey] = value;
    });
    narray.push(nobj);
  });
  return narray;
}


//appControllers.controller('ImagesCtrl', [
  //'$scope', 'apiService', 'alertService',
  //function ($scope, apiService, alertService) {
    //$scope.$root.pageHeading = "Images";
    //alertService.clearAlerts();

  //$scope.apiService = apiService;

  //apiService.GET('nova', "images/detail", function (data) {
    //$scope.images = filterNames(data.images);
  //});
//}
//]);

// Stolen from
function humanFileSize(bytes, si) {
    // Note does not cope with -ve bytes
    var thresh = si ? 1000 : 1024;    
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
}


appControllers.controller('SwiftContainersCtrl', [
  '$scope', 'apiService', 'alertService', '$modal', '$log',
  function ($scope, apiService, alertService, $modal, $log) {
    $scope.$root.pageHeading = "Containers";
    alertService.clearAlerts();

  $scope.apiService = apiService;
  
  $scope.open = function (containerDetails) {

    var modalInstance = $modal.open({
      templateUrl: 'viewDetails.html',
      controller: ViewDetailsCtrl,
      resolve: {
        containerDetails: function () {
          return containerDetails;
        }
      }
    });
    
  };

  apiService.GET(
    'swift',
    "",
    function (data, status, headers) {
      var access = 'Private',  // FIXME
          i,
          container,
          size;
      
      $log.info(data);
      $log.info(headers());
      
      for (i=0;i<data.length;i++) {
        apiService.HEAD('swift', data[i].name, function (container_data, container_status, container_headers) {$log.info(container_headers())});
        
        container = data[i];
        size = humanFileSize(container.bytes);
        container.details = 'Object Count: ' + container.count +'\nSize: ' + size + '<br>Access: ' + access;
        
        //TRNGGrid does not support html in cells so we will have to render things a little differently.
        container.size = size;
        container.access = access
      }
      
      $scope.containers = filterNames(data);
    }
  );
}
]);


var ViewDetailsCtrl = function ($scope, $modalInstance, $log, containerDetails) {

  $log.info(containerDetails);
  $scope.containerDetails = containerDetails;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
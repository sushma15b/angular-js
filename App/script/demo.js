  
var app = angular.module('basic', ['ab']);

app.controller('MyCtl', ['$scope', '$element', '$binder', function($scope, $element, $binder) {
    
    $binder.$init($scope, $element);
}]);

zk.afterMount(function() {
    angular.bootstrap(document, [ 'basic']);
});
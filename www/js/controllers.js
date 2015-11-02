angular.module('app.controllers', [])
.controller('miCompra', function($scope, $http) {
  $scope.valorTotal = 0;
  $scope.valorCompra = 1;
  $scope.comisionBanco = 2.5;
  $scope.comisionDolar = 20;
  $scope.factorComision = function(total) {
    return total * (($scope.comisionBanco / 100) + 1);
  } 
  $scope.valorEstimado = 0;
  $scope.valorDolar = 690.32;
  $scope.guardado = '2015-11-02';
  $scope.actualizarTotal = function() {
    $scope.valorTotal = $scope.factorComision((($scope.valorEstimado > 0 ? $scope.valorEstimado : $scope.valorDolar) + $scope.comisionDolar) * ($scope.valorCompra));
  }
  $http({
    method: 'GET'
  , url: 'http://mindicador.cl/api'
  })
  .then(function(response) {
    $scope.valorDolar = response.data.dolar.valor;
    $scope.actualizarTotal();
  })
  .catch(function(err) {
  });

  $scope.actualizarTotal();
})

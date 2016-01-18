angular.module('app.controllers', [])
.controller('miCompra', function($scope, $http, $ionicPopup) {
  $scope.valorTotal = 0;
  $scope.valorCompra = 1;
  $scope.comisionBanco = 2.5;
  $scope.comisionDolar = 20;
  $scope.factorComision = function(total) {
    return total * (($scope.comisionBanco / 100) + 1);
  } 
  $scope.valorEstimado = 0;
  $scope.valorDolar = 710.16;
  $scope.guardado = '2015-12-31';
  $scope.dolarCambiado = false;
  $scope.actualizarTotal = function() {
    $scope.valorTotal = $scope.factorComision((($scope.valorEstimado > 0 ? $scope.valorEstimado : $scope.valorDolar) + $scope.comisionDolar) * ($scope.valorCompra));
  }

  var fecha = new Date() 
    , mesActual = fecha.getMonth()
    , anioActual = fecha.getFullYear()
    , mesAnterior = mesActual
    , anioAnterior = anioActual
    , apiKey = '36fabbfba30a60a47700fe0a4fd91e005730b98a'
  ;

  $http({
    method: 'GET'
  , url: 'http://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=' + apiKey + '&formato=json'
  })
  .then(function(response) {
    /* Si es que la petición envía un mensaje de error pero con código 201 */
    if(typeof response.data.Mensaje != 'undefined') {
      var confirmPopup = $ionicPopup.alert({
        title: '¡Atención!',
        template: responde.data.Mensaje,
      });
    } else {
      $scope.valorDolar = parseFloat(response.data.Dolares[0].Valor.replace(',', '.'), 10);
      $scope.dolarCambiado = true;
      $scope.actualizarTotal();
    }
  })
  .catch(function(err) {
    /* En caso de que el día actual sea fin de semana o festivo, buscamos el último valor del dólar guardado */
    if(mesActual == 0) {
      mesAnterior = 11;
      anioAnterior--;
    } else {
      mesAnterior--;
    }
    /* Seleccionamos el periodo a buscar (último mes) seleccionando el último valor guardado */
    $http({
      method: 'GET'
    , url: 'http://api.sbif.cl/api-sbifv3/recursos_api/dolar/periodo/' + anioAnterior + '/' + (mesAnterior + 1) + '/' + anioActual + '/' + (mesActual + 1) + '?apikey=' + apiKey + '&formato=json'
    })
    .then(function(response) {
      $scope.valorDolar = parseFloat(response.data.Dolares[response.data.Dolares.length-1].Valor.replace(',', '.'), 10);
      $scope.dolarCambiado = true;
      $scope.actualizarTotal();
    })
    /* En caso de que ambas peticiones fallen, mostramos el mensaje de error mostrado por la página del SBIF */
    .catch(function(err) {
      var confirmPopup = $ionicPopup.alert({
        title: '¡Atención 2!',
        template: err.data.Mensaje,
      });
    })
    .finally(function() {
      console.log($scope.dolarCambiado);
      if(!$scope.dolarCambiado) {
        var confirmPopup = $ionicPopup.alert({
          title: '¡Atención 3!',
          template: 'Se ha cargado el valor del dólar del día ' + $scope.guardado + ' (CLP $' + $scope.valorDolar + ').<br /><br /><b>Recuerda que se necesita una conexión Wi-Fi para poder acceder al valor del dólar actual.</b>',
        });
      }
    });
  });

  $scope.actualizarTotal();
})
.controller('informacionCtrl', function($scope) {})

$(function () {
    var APPID = 'AIzaSyCgawMBLa80266sqkpZIBJeAMpNj4HJhuI';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    }
    else {
        handleError("Your browser does not support Geolocation!");
    }

    function locationSuccess(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        var googleGeoAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&location_type=ROOFTOP&key=' + APPID;

        var getLocation = $.get(googleGeoAPI);

        getLocation.done(function (data) {

            var address = data.results[0].address_components;

            var city = address[3].long_name;
            var country = address[6].short_name;

            $('#location').text(city + ', ' + country);

            var wsql = 'select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + city + ', ' + country + '") and u = "c"';
            var endpoint = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(wsql) + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';


            var getLocation = $.get(endpoint).done(function(data){
                $('#weather').text(data.query.results.channel.item.condition.temp + 'ºC');
            });
        });
    }

    function locationError(error) {
        switch (error.code) {
            case error.TIMEOUT:
                handleError("Erro de timeout ao recuperar informações de clima.");
                break;
            case error.POSITION_UNAVAILABLE:
                handleError("Não foi possível determinar sua localização.");
                break;
            case error.PERMISSION_DENIED:
                handleError("Por favor, autorize a geolocalização no navegador.");
                break;
            case error.UNKNOWN_ERROR:
                handleError('Algo deu errado');
                break;
        }
    }

    function handleError(error) {
        console.log(error);
    }




});
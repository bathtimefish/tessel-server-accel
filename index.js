var tessel = require('tessel');
var wifi = require('wifi-cc3000');
var accel = require('accel-mma84').use(tessel.port['A']); // Replace '../' with 'accel-mma84' in your own code

var http = require('http');

var intervalSec = 3000;
var accelJson = undefined;

var serverIP = "[Server IP Address]";
var serverPort = "3000";
var requestURL = "http://" + serverIP + ":" + serverPort + "/?data=";

// See https://github.com/tessel/docs/blob/master/hardware-api.md#wifi
var wifiSettings = {
    ssid: "[SSID]",
    password: "[PASS PHRASE]",
    security: "wpa2", // optional
    timeout: 20 // optional
};

// Initialize the accelerometer.
accel.on('ready', function () {
    console.log("Ambient sensor is ready.");
    console.log("Connecting wifi...");
    wifi.connect(wifiSettings, startClient);
});

// Stream accelerometer data
accel.on('data', function (xyz) {
    accelJson = {
        'x': xyz[0].toFixed(2),
        'y': xyz[1].toFixed(2),
        'z': xyz[2].toFixed(2)
    };
});

accel.on('error', function(err){ console.log('Error:', err); });

var startClient = function(err, res) {
    console.log("Wifi connected, IP address is", res.ip);
    /* main loop */
    var queryString = undefined;
    request = undefined;
    tessel.led[0].output(0);
    tessel.led[1].output(1);
    setImmediate(function loop() {
        //console.log(accelJson);
        if (accelJson) {
            console.log(accelJson);
            queryString = encodeURIComponent(JSON.stringify(accelJson));
            //console.log(queryString);
            //console.log(JSON.parse(decodeURI(queryString)));
            request = requestURL + queryString;
            //console.log(request);
            http.get(request, function (res) {
                /* LED Signal sign */
                tessel.led[0].output(1);
                tessel.led[1].output(0);
                setTimeout(function() {
                    tessel.led[0].output(0);
                    tessel.led[1].output(1);
                }, 50);
                //console.log('# statusCode', res.statusCode)
                var bufs = [];
                res.on('data', function (data) {
                    bufs.push(new Buffer(data));
                    //console.log('# received', new Buffer(data).toString());
                    setImmediate(loop);
                });
                res.on('close', function () {
                    console.log('done.');
                    setImmediate(loop);
                });
            }).on('error', function (e) {
                console.log('not ok -', e.message, 'error event');
                setImmediate(loop);
            });
        }
    });
};

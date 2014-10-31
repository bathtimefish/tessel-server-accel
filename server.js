var os = require('os');
var http = require('http');
var url = require('url');
var port = 3000;
var ipAddr = getLocalAddress();

var server = http.createServer();

console.log("IP address: " + ipAddr);

server.on('request', function(req, res) {
    var urlElem = url.parse(req.url, true);
    var q = urlElem.query;
    console.log(q);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write('OK');
    res.end();
});

server.listen(port, function() {
    console.log("Starting HTTP server on port: " + port);
    console.log("Request this URL by Tessel client: " + 'http://' + ipAddr + ":" + port + '/?' + 'data=[query]');
});


function getLocalAddress() {
    var ifacesObj = {}
    ipv4Address = undefined;
    var interfaces = os.networkInterfaces();
    for (var dev in interfaces) {
        interfaces[dev].forEach(function(details){
            if (!details.internal){
                if (details.family == "IPv4") {
                    if (dev == 'en0') {
                        ipv4Address = details.address;
                    }
                }
            }
        });
    }
    return ipv4Address;
};

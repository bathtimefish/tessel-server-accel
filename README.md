# tessel-server-accel

## Setup

```
$ npm install
```

## Run

Connecting your tessel machine to PC via USB.
Next, start server.

```
$ node server.js
IP address: [SERVER IP ADDRESS]
Starting HTTP server on port: 3000
Request this URL by Tessel client: http://[SERVER IP ADDRESS].57:3000/?data=[query]
```

Open `index.js` by text editor.
Edit `[Server IP Address]`, `[SSID]` and `[PASS PHRASE]`.

```
var serverIP = "[Server IP Address]";
...
var wifiSettings = {
    ssid: "[SSID]",
    password: "[PASS PHRASE]",
    security: "wpa2", // optional
    timeout: 20 // optional
};
```

After saving `index.js`, run it on tessel.

```
$ tessel run index.js
```

Few second after, logging to accel data on server console.

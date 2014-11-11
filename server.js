var dgram = require('dgram');

var PORT = 41234;
var server = dgram.createSocket('udp4');

var clientSockets = {};

server.bind(PORT, function onBound() {
    console.log('bound to', PORT);

    server.on('message', function onMessage(msg, rinfo) {
        console.log('incoming msg', String(msg));

        if (!clientSockets[rinfo.host]) {
            clientSockets[rinfo.host] = dgram.createSocket('udp4');
        }

        var sock = clientSockets[rinfo.host];
        sock.send(msg, 0, msg.length, rinfo.port, rinfo.host);
    });
});

server.on('error', function (err) {
  console.log('wat?', err);
});

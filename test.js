var SDC = require('statsd-client');
var process = require('process');
var parseArgs = require('minimist');
var console = require('console');
var dgram = require('dgram');
var Buffer = require('buffer').Buffer;
require('heapdump');

var argv = parseArgs(process.argv.slice(2));
var UDP_HOST = process.env.DNS_NODEJS_TEST_HOST;
var UDP_PORT = 41234;

var LOOP_COUNT = 5;
var SLEEP_DELAY = 100;

/*  Try the statsrelay style DNS thing

    Try DNS just being down.
*/

function testWithStatsd() {
    var cli = new SDC({
        host: UDP_HOST,
        port: UDP_PORT,
        debug: false
    });

    setTimeout(function loop() {
        for (var i = 0; i < LOOP_COUNT; i++) {
            var s = cli._ephemeralSocket;
            var socket = s && s._socket;
            var queue = socket && socket._sendQueue;
            var length = queue ? queue.length : 0

            console.log('Write (statsd) value', length);
            cli.increment('systemname.subsystem.value');
        }

        setTimeout(loop, SLEEP_DELAY);
    }, SLEEP_DELAY);
}

function testWithUDP() {
    var socket = dgram.createSocket('udp4');

    socket.on('message', function (buf) {
        console.log('got', String(buf));
    })

    setTimeout(function loop() {
        for (var i = 0; i < LOOP_COUNT; i++) {
            console.log('Write value.\n');
            var message = new Buffer('systemname.subsystem.value\n');

            socket.send(message, 0, message.length,
                UDP_PORT, UDP_HOST);
        }

        setTimeout(loop, SLEEP_DELAY);
    }, SLEEP_DELAY);
}

if (argv.statsd) {
    testWithStatsd();
} else {
    testWithUDP();
}

process.on('uncaughtException', function () {
    // we log & continue in production.
    console.log('wat?');

    // much sad.
});

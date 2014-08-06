# dns-memory-leak

Test repository to reproduce & debug node dns memory leak.

## Problem

When DNS fails or when using certain DNS records like a list of
    IPs we notice that our production machines balloon in RAM.

This repo is supposed to reproduce those two cases.

## Code / commands

The first thing you need to do is set up a UDP echo server 
    somewhere on the internet.

Then:

```sh
export DNS_NODEJS_TEST_HOST {{some host}}
export DNS_NODEJS_TEST_IP {{some ip}}
```

There is an `npm run echo-server` that shows how to use ncat
    to set up an echo server.


Once you have set up a UDP echo server you can run `node test.js`
    to connect to it and send traffic to it.

### `npm run watch-memory`

Assuming only one `node` process is running currently, you can
    use `npm run watch-memory` which polls the RSS out of your
    proc files and lets you see what the memory usage of your
    UDP client is.

Alternatively just inspect the memory of the node client by
    any means wanted.

### `npm run internet-die`

There is an internet-die command to emulate DNS failures.

It actually just kills everything using iptables.

There is also an `npm run internet-come-back` that you will need

### `npm run strace`

There are two commands, `npm run strace` and `npm run strace-stats`
    to run the UDP client with strace on.

The stats variant uses a statsd client library instead of direct
    UDP sockets

### `npm run tcpdump`

There is a `npm run tcpdump` command you can use to dump tcp
    traffic for inspecting whats going on.

There is also an `npm run inspect-tcpdump` that you can use
    to inspect DNS (port 53) traffic.


## Reproduction workflow

Spin up a UDP echo server somewhere (`npm run echo-server`)

Make sure to set the `DNS_NODEJS_TEST_HOST` and `DNS_NODEJS_TEST_IP`
    environment variables.

Run `npm run strace` to emulate connecting to the UDP server
    i.e. emulating high volume statsd traffic.

Run `npm run watch-memory` to see memory and see it being constant.

Run `npm run internet-die` to kill the internet through iptables.

Now you should see RSS going up in `npm run watch-memory`.
    This should reproduce the memory leak.

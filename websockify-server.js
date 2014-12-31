var Net = Npm.require('net');
var Buffer = Npm.require('buffer').Buffer;

// A proxy from WebSocket to TCP
// Browser can connect at '/websockify*'
WebSockifyServer = function (findProxyDestination, options) {
  var self = this;
  if (! (self instanceof WebSockifyServer))
    throw new Error("use 'new' to construct a WebSockifyServer");

  var log = options && options.debug && console.log || function (){};

  var ProxyHandler = function (url, ws) {
    log("Client connect, url = ", url, "ws = ", ws);

    var dest = findProxyDestination(url);

    if (!dest) {
      log("No destination, closing web socket");
      ws.close();
      return;
    } else {
      log("Connecting to port", dest.port, " on host ", dest.host);
    }

    var tcp = Net.createConnection(dest.port, dest.host, function() {
      log('Connected to VNC target');
    });

    tcp.on('data', function (data) {
      try {
        if (ws.protocol === 'base64') {
          ws.send(new Buffer(data).toString('base64'));
        } else {
          ws.send(data);
        }
      } catch (e) {
        log("WebSocket was closed ", e);
        tcp.end();
      }
    });

    tcp.on('end', function () {
      log("Tcp closed connection");
      ws.close();
    });

    ws.on('message', function (msg) {
      if (ws.protocol === 'base64') {
        tcp.write(new Buffer(msg.data, 'base64'));
      } else {
        tcp.write(msg.data, 'binary');
      }
    });

    ws.on('close', function () {
      log("Web socket close connection");
      tcp.end();
    });

    var onError = function (msg) {
      log("Unexpected error", msg);
      tcp.end();
      ws.close();
    };

    tcp.on('error', onError);
    ws.on('error', onError);
  }

  var server = new WebSocketServer('/websockify', ProxyHandler);

  self.close = function () {
    server.close();
  };
}

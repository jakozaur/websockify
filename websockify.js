var Net = Npm.require('net');
var Buffer = Npm.require('buffer').Buffer;

WebSockifyServer = function (options) {
  var self = this;
  if (! (self instanceof WebSockifyServer))
    throw new Error("use 'new' to construct a WebSockifyServer");

  var log = options && options.debug && console.log || function (){};

  var ProxyHandler = function (url, ws) {
    log("Client connect, url = ", url, "ws = ", ws);

    var tcp = Net.createConnection(5555, '192.168.59.103', function() {
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

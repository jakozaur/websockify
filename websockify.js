var Net = Npm.require('net');
var Buffer = Npm.require('buffer').Buffer;

WebSockifyServer = function () {
  var self = this;

  var ProxyHandler = function (url, ws) {
    console.log("Client connect, url = ", url, "ws = ", ws);

    var tcp = Net.createConnection(5555, '192.168.59.103', function() {
      console.log('Connected to VNC target');
    });

    tcp.on('data', function (data) {
      try {
        if (ws.protocol === 'base64') {
          ws.send(new Buffer(data).toString('base64'));
        } else {
          ws.send(data);
        }
      } catch (e) {
        console.log("WebSocket was closed ", e);
        tcp.close();
      }
    });

    tcp.on('end', function () {
      console.log("Tcp closed connection");
      ws.close();
    });

    ws.on('message', function (data) {
      if (client.protocol === 'base64') {
        tcp.write(new Buffer(msg, 'base64'));
      } else {
        tcp.write(msg, 'binary');
      }
    });

    ws.on('close', function () {
      console.log("Web socket close connection");
      tcp.close();
    });

    var onError = function (msg) {
      console.log("Unexpected error", msg);
      tcp.close();
      ws.close();
    };

    tcp.on('error', onError);
    ws.on('error', onError);
  }

  var server = WebSocketServer('/websockify', ProxyHandler);

  self.close = function () {
    server.close();
  };
}

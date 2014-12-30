var WebSocket = Npm.require('faye-websocket');

WebSocketServer = function (prefix, ClientHandler) {
  var self = this;
  if (! (self instanceof WebSocketServer))
    throw new Error("use 'new' to construct a WebSocketServer");

  var openSockets = [];

  var onUpgrade = function(request, socket, body) {
    if (request.url.substring(0, prefix.length) !== prefix) {
      return;
    }
    if (!WebSocket.isWebSocket(request)) {
      return;
    }

    var ws = new WebSocket(request, socket, body);

    openSockets.push(ws);

    ws.on('close', function(event) {
      openSockets = _.without(self.openSockets, ws);
      ws = null;
    });

    new ClientHandler(ws);
  };

  var onClose = function () {
    _.each(openSockets, function (socket) {
      socket.end();
    });
  };

  // Setup listeners
  Package.webapp.WebApp.httpServer.on('upgrade', onUpgrade);
  Package.webapp.WebApp.httpServer.on('meteor-closing', onClose);

  self.close = function () {
    Package.webapp.WebApp.httpServer.removeListener('upgrade', onUpgrade);
    Package.webapp.WebApp.httpServer.removeListener('meteor-closing', onClose);
    onClose();
  }
}

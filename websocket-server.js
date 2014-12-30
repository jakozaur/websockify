var WebSocket = Npm.require('faye-websocket');

WebSocketServer = function (prefix, ClientHandler) {
  var self = this;
  if (! (self instanceof WebSocketServer))
    throw new Error("use 'new' to construct a WebSocketServer");

  var openSockets = [];

  var httpServer = Package.webapp.WebApp.httpServer;
  var oldUpdateListeners = httpServer.listeners('upgrade').slice(0);
  httpServer.removeAllListeners('upgrade');

  var onUpgrade = function(request, socket, body) {
    if (request.url.substring(0, prefix.length) !== prefix) {
      // Call regular websocket
      var args = arguments;
      _.each(oldUpdateListeners, function (listener) {
        listener.apply(httpServer, args);
      })
      return;
    }
    if (!WebSocket.isWebSocket(request)) {
      return;
    }

    var ws = new WebSocket(request, socket, body, ['binary', 'base64']);

    openSockets.push(ws);

    ws.on('close', function(event) {
      openSockets = _.without(self.openSockets, ws);
      ws = null;
    });

    new ClientHandler(request.url.substr(prefix.length), ws);
  };

  var onClose = function () {
    _.each(openSockets, function (socket) {
      socket.end();
    });
  };

  // Setup listeners
  httpServer.on('upgrade', onUpgrade);
  httpServer.on('meteor-closing', onClose);

  self.close = function () {
    httpServer.removeListener('upgrade', onUpgrade);
    _.each(oldUpdateListeners, function (listener) {
      httpServer.on('upgrade', listener);
    });
    httpServer.removeListener('meteor-closing', onClose);
    onClose();
  }
}

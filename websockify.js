var WebSocket = Npm.require('faye-websocket');

Package.webapp.WebApp.httpServer.on('upgrade', function(request, socket, body) {
  var prefix = "/websockify"
  if (request.url.substring(0, prefix.length) !== prefix) {
    return;
  }
  if (!WebSocket.isWebSocket(request)) {
    return;
  }

  var ws = new WebSocket(request, socket, body);

  ws.on('message', function(event) {
    ws.send(event.data);
  });

  ws.on('close', function(event) {
    ws = null;
  });
});

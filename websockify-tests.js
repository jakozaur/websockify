
var EchoService = function (url, ws) {
  ws.on('message', function(event) {
    ws.send(event.data);
  });
}

Tinytest.addAsync("echo service works", function (test, next) {
  var server = new WebSocketServer('/websockify', EchoService);
  var WebSocket = Npm.require('faye-websocket');
  var ws        = new WebSocket.Client(Meteor.absoluteUrl('websockify'));

  var helloWebSocket = "Hello Web Sockets!";
  var wasMessage = false;

  ws.on('open', function(event) {
    ws.send(helloWebSocket);
  });

  ws.on('message', Meteor.bindEnvironment(function (event) {
    test.equal(event.data, helloWebSocket);
    wasMessage = true;
    ws.close();
  }));

  ws.on('close', Meteor.bindEnvironment(function (event) {
    test.equal(event.code, 1000);
    test.equal(wasMessage, true);
    server.close();
    next();
  }));
});

Tinytest.addAsync("stop socket on server close", function (test, next) {
  var server = new WebSocketServer('/websockify', EchoService);
  var WebSocket = Npm.require('faye-websocket');
  var ws        = new WebSocket.Client(Meteor.absoluteUrl('websockify'));

  var helloWebSocket = "Hello Web Sockets!";

  ws.on('open', function(event) {
    ws.send(helloWebSocket);
  });

  ws.on('message', Meteor.bindEnvironment(function (event) {
    test.equal(event.data, helloWebSocket);
    server.close();
  }));

  ws.on('close', Meteor.bindEnvironment(function (event) {
    test.equal(event.code, 1000);
    next();
  }));
});

Tinytest.addAsync("can connect only to specfic url", function (test, next) {
  var server = new WebSocketServer('/websockify', EchoService);
  var WebSocket = Npm.require('faye-websocket');
  var ws        = new WebSocket.Client(Meteor.absoluteUrl('some-random'));

  ws.on('close', Meteor.bindEnvironment(function (event) {
    test.equal(event.code, 1006);
    server.close();
    next();
  }));
});

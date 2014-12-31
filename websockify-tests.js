
var EchoService = function (url, ws) {
  ws.on('message', function(event) {
    ws.send(event.data);
  });
}

Tinytest.add("WebSocketServer must be created with new", function (test) {
  var ex1;
  try {
    WebSocketServer();
  } catch (e) {
    ex1 = e
  }
  test.instanceOf(ex1, Error);
});

Tinytest.add("WebSockifyServer must be created with new", function (test) {
  var ex;
  try {
    WebSockifyServer();
  } catch (e) {
    ex = e
  }
  test.instanceOf(ex, Error);
});

Tinytest.addAsync("WebSocketServer works with echo", function (test, next) {
  var server    = new WebSocketServer('/websockify', EchoService);
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

Tinytest.addAsync("WebSocketServer stop socket on close",
    function (test, next) {
  var server    = new WebSocketServer('/websockify', EchoService);
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

Tinytest.addAsync("WebSocketServer can connect only to valid url",
    function (test, next) {
  var server    = new WebSocketServer('/websockify', EchoService);
  var WebSocket = Npm.require('faye-websocket');
  var ws        = new WebSocket.Client(Meteor.absoluteUrl('some-random'));

  ws.on('close', Meteor.bindEnvironment(function (event) {
    test.equal(event.code, 1006);
    server.close();
    next();
  }));
});

Tinytest.addAsync("WebSockifyServer closes connection if can't find dest",
    function (test, next) {
  var server    = new WebSockifyServer(function () {});
  var WebSocket = Npm.require('faye-websocket');
  var ws        = new WebSocket.Client(Meteor.absoluteUrl('/websockify'));

  ws.on('close', Meteor.bindEnvironment(function (event) {
    test.equal(event.code, 1006);
    server.close();
    next();
  }));
});

Tinytest.addAsync("echo service works", function (test, next) {
  var WebSocket = Npm.require('faye-websocket');
  var ws        = new WebSocket.Client(Meteor.absoluteUrl('websockify'));

  var helloWebSocket = "Hello Web Sockets!";
  var wasMessage = false;

  ws.on('open', function(event) {
    ws.send(helloWebSocket);
  });

  ws.on('message', Meteor.bindEnvironment(function(event) {
    test.equal(event.data, helloWebSocket);
    wasMessage = true;
    ws.close();
  }));

  ws.on('close', Meteor.bindEnvironment(function(event) {
    ws = null;
    test.equal(event.code, 1000);
    test.equal(wasMessage, true);
    next();
  }));
});

Tinytest.addAsync("can connect only to specfic url", function (test, next) {
  var WebSocket = Npm.require('faye-websocket');
  var ws        = new WebSocket.Client(Meteor.absoluteUrl('some-random'));

  ws.on('close', Meteor.bindEnvironment(function (event) {
    test.equal(event.code, 1006);
    next();
  }));
});

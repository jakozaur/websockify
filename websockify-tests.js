// Write your tests here!
// Here is an example.
Tinytest.addAsync('echo service works', function (test, next) {
  var WebSocket = Npm.require('faye-websocket'),
    ws        = new WebSocket.Client('ws://localhost:8000/');

  var helloWebSocket = "Hello Web Sockets!";

  ws.on('open', function(event) {
    console.log('open');
    ws.send(helloWebSocket);
  });

  ws.on('message', Meteor.bindEnvironment(function(event) {
    console.log('message', event.data);
    test.equal(event.data, helloWebSocket);
    ws.close();
  }));

  ws.on('close', Meteor.bindEnvironment(function(event) {
    console.log('close', event.code, event.reason);
    ws = null;
    next();
  }));
  test.equal(true, true);
});

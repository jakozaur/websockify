WebSockify
==========
WebSocket to TCP proxy in Meteor. E.g. use with [noVNC](https://github.com/jakozaur/noVNC).

Example usage in server code:
```JavaScript

Meteor.startup(function () {
  var httpMaster = new WebSockifyServer(function (url) {
    return {host: '127.0.0.1', port: 5555};
  });
});
```

That allows browser to use WebSocket by connecting to `/websockify` url.
The WebSocket acts as a proxy to any TCP server.

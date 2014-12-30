Package.describe({
  name: 'jakozaur:websockify',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Npm.depends({
  'faye-websocket': '0.9.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use(['webapp'], 'server');
  api.addFiles(['websocket-server.js', 'websockify.js'], 'server');
  api.export('WebSocketServer');
  api.export('WebSockifyServer');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jakozaur:websockify');
  api.addFiles('websockify-tests.js', 'server');
});

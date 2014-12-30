Package.describe({
  name: 'websockify',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Npm.depends({
  'faye-websocket': '0.9.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use(['webapp', 'routepolicy'], 'server');
  api.addFiles('websockify.js', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('websockify');
  api.addFiles('websockify-tests.js', 'server');
});

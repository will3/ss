var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Start server game
require('../src/startserver')(http);

http.listen(3000, function() {
  console.log(':3000');
});

var express = require('express');
var path = require('path');

var app = express();

app.use('/assets', express.static('./assets'));

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'main.html'));
});

console.log('Starting shooter game server');
console.log('Listening on port 8002');

app.listen(8002);
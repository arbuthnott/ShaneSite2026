/* This is the file to start the express server */

const express = require('express');
const app = express();
const port = 80;

app.use(express.static('public', {extensions: ['html', 'htm']}));

app.listen(port, function() {
    console.log('Shane Author Site 2026 listening on port ' + port);
});

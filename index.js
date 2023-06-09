var portal = 3000;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function homepage(req, res) {
    res.sendFile(__dirname+'/Templates/index.html');
})

app.listen(portal, function () {
    console.log("server is now running on port "+portal);
})
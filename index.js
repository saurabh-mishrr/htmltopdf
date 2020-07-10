const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var htmlToPdfRoutes = require('./Routes/HtmlToPdfRoutes');
htmlToPdfRoutes(app);

app.listen(5001);
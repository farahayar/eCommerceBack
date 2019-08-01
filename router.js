const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");


var app = express();
var port = "3000";


const product= require('./controllers/productController');


app.use(bodyParser.json());
app.use(cors());

app.use(express.static('assets'))

app.use('/product',product);



app.listen(port, () => console.log(`Listening on port ${port}`));

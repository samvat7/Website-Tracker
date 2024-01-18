const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const pingService = require('./services/pingService');

const port = 8001;

const app = express();

const cors = require('cors');

app.set('view engine', 'ejs');

app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors({
    origin: '*',  // application origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));


app.use('/', require('./routes'));




app.listen(port, () => { 

    console.log('Server successfully running on port: ', port);
});
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

// set pug
app.set('views', './views');
app.set('view engine', 'pug');

// set router
const routerClient = require("./router/client/index.router");
routerClient.index(app);

//set mongoose
const mongoose = require('./config/database.config');
mongoose();

// set stactic file
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`running ${port}`);
})
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

// set link admin
const systemConfig = require("./config/system");


// set pug
app.set('views', './views');
app.set('view engine', 'pug');

// set router
const routerAdmin = require("./router/admin/index.router");
const routerClient = require("./router/client/index.router");
routerClient.index(app);
routerAdmin.index(app);

//set mongoose
const mongoose = require('./config/database.config');
mongoose.connect();

// set stactic file
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`running ${port}`);
})
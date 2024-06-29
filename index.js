const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

// set bodyParser
var bodyParser = require('body-parser');
var flash = require('express-flash');

// set method-overide
var methodOverride = require('method-override')
app.use(methodOverride('_method'))

// set express-flash : show alert
var session = require('express-session')
var cookieParser = require('cookie-parser')
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// set body - parser
app.use(bodyParser.json())  // use for json
app.use(bodyParser.urlencoded({ extended: false })) // use for form


// set link admin
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;  // set local varialble "admin"

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
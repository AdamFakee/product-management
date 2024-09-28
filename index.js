const express = require('express');
const app = express();
const passport = require('passport');
require('dotenv').config();
const port = process.env.PORT;
const http = require('http');
const { Server } = require("socket.io");

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io; // biến toàn cục dùng cho server
// End SocketIO

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

// set session : giao thức đảm bảo việc giữ kết nối giữa client's bowrse với serve khi chuyển trang, kiểu lưu thông tin tạm thời trong trình duyệt
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

// set Passport.js
app.use(passport.initialize()); // để thực hiện được serializeUser và deserializeUser
app.use(passport.session()); // initialize và session giống như middleware thôi

// set link admin
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;  // set local varialble "admin"

// set pug
app.set('views', `${__dirname}/views`); // biến dirname : trên onl sẽ k bt đứng tại thư mục nào nên cần truy vấn từ thư mực gốc
app.set('view engine', 'pug'); // nhưng cũng k bt thư mục gốc là cái nào => biến dirname là thư mục gốc

// set tinyMCE
const path = require('path');
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//set mongoose
const mongoose = require('./config/database.config');
mongoose.connect();



// set stactic file
app.use(express.static(`${__dirname}/public`));

// set router
const routerAdmin = require("./router/admin/index.router");
const routerClient = require("./router/client/index.router");
routerClient.index(app);
routerAdmin.index(app);

// 404 page
app.get("*", (req, res) => {
    res.render("client/pages/error/404", {
      pageTitle: "404 Not Found"
    });
});



server.listen(port, () => {
    console.log(`running ${port}`);
})
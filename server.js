var express = require("express");
var cors = require ("cors");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require("MD5");
var login = require("./login.js");
var user = require("./user.js");
var absen = require("./absen.js")
var app  = express();

var spdy = require('spdy')
var path = require('path')
var fs = require('fs')

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 50,
        waitForConnection: true,
        host     : 'npspgmanagement.co.id',
        user     : 'root',
        password : 'npspg2017',
        database : 'npspg',
        debug    :  false
    });
    //pool.getConnection(function(err,connection){
    //    if(err) {
    //      self.stop(err);
    //    } else {
          self.configureExpress(pool);
    //    }
    //});
}

REST.prototype.configureExpress = function(pool) {
      var self = this;
      app.use(cors());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var login_router = new login(router,pool,md5);
      var user_router = new user(router,pool);
      var absen_router = new absen(router,pool);
      // Handle 404 - Keep this as a last route
      app.use(function(req, res, next) {
          res.status(400);
          res.json({"error" : true, "error_msg" : "Method Not Found"});
      });
      self.startServer();
      self.startHTTPSserver();
}

const options = {
    key: fs.readFileSync(__dirname + '/cert/server.key'),
    cert:  fs.readFileSync(__dirname + '/cert/server.crt')
}

REST.prototype.startServer = function() {
      app.listen(3001,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.startHTTPSserver = function(){
  spdy
  .createServer(options, app)
  .listen(3011, (error) => {
    if (error) {
      console.error(error)
      return process.exit(1)
    } else {
      console.log('Listening on port: ' + 3011 + '.')
    }
  })
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();

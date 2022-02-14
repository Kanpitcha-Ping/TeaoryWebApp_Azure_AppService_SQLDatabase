var express = require('express');
var router = express.Router();

const bp = require("body-parser");
var jsonParser = bp.json();

const { Connection, Request } = require("tedious");
let status = false;

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "teaory-admin", // update me
      password: ""// update me
    },
    type: "default"
  },
  server: "teaory-server.database.windows.net", // update me
  options: {
    database: "teaory-db", //update me
    encrypt: true,
    rowCollectionOnRequestCompletion: true
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("db connected");
  }
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('index.html');
});

router.get('/shop', function(req, res, next) {
  res.sendfile('Shop.html');
});

router.get('/order', function(req, res, next) {
  res.sendfile('order.html');
});

router.get('/register', jsonParser, function(req, res, next) {
  res.sendfile('Register.html');
});

router.get("/newID", function (req, res) {
  const request = new Request(
    "SELECT MAX(user_id) AS id FROM UserInfo",
    (err, rowCount, results) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(results[0]);
        return res.send({
          error: false,
          data: results[0],
        });
      }
    }
  );
});

router.get("/email", function (req, res) {
  const request = new Request(
    "SELECT user_id, user_email FROM UserInfo",
    (err, rowCount, results) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("sent email list");
        console.log(results);
        return res.send({
          error: false,
          data: results,
        });
      }
    }
  );
});

router.get('/login', jsonParser, function(req, res, next) {
  res.sendfile('log in.html');
});

router.post('/login/validate', jsonParser, function(req, res, next) {
  
  let uname_ = req.body.condition.username;
  let pwd_ = req.body.condition.pwd;

  const request = new Request(
    "SELECT login_user, login_pwd, login_role FROM logininfo",
    (err, rowCount, results) => {
      if (err) {
        console.error(err.message);
      } else {
        //console.log(results);
      }
    }
  );
  request.on("row", element => {
    if (uname_ === element[0].value && pwd_ === element[1].value) {
      console.log(uname_ +" : "+element[0].value+" : "+element[1].value+" : "+element[2].value);
        if (element[2].value == 'A') { //Admin
            //go search page
            console.log("role: "+element[2].value);
            return res
            .status(200)
            .send({ error: false, message: 'go to admin page!' });
        } else { //normal user (customer)
            //go search page
            return res
            .status(200)
            .send({ error: false, message: 'go to normal page!' });
        }
    } else if (uname_ === element[0].value && pwd_ != element[1].value) {
            valid = false;
            return res
            .status(400)
            .send({ error: false, message: 'Wrong password!' });
    }   
  });
  connection.execSql(request);
});

router.get('/adminUser', function(req, res, next) {
  res.sendfile("adminUserManagement.html");
});

router.get('/adminProd', function(req, res, next) {
  res.sendfile("adminProductManagement.html");
});

router.get('/teasearch', function(req, res, next) {
  res.sendfile("normalUserSearch.html");
});

router.get("/typtea", jsonParser, function (req, res) {
  const request = new Request(
    "SELECT * FROM typetea",
    (err, rowCount, results) => {
      if (err) {
        console.error(err.message);
      } else {
        //console.log(results);
        return res
            .status(200)
            .send({ error: false, data: results });
      }
    }
  );
  connection.execSql(request);
});

router.post("/search", jsonParser, function (req, res) {

  let productT = "%"+req.body.condition.product.toLowerCase()+"%";
    let typT = req.body.condition.typTea;
    let minp = req.body.condition.min;
    let maxp = req.body.condition.max;
    let unitT = req.body.condition.unit;
    let unitCondition = " AND (product_details.prod_unit = 'box' OR product_details.prod_unit = 'bag');";
    let typCondition = "";

    if (typT != "all") {
        typCondition = " AND (tt_name = '"+typT+"')";
    } 

    if (unitT == "bag") {
        unitCondition = " AND (product_details.prod_unit = 'bag');"
    } else if (unitT == "box") {
        unitCondition = " AND (product_details.prod_unit = 'box');"
    } 
  
    let qur = "SELECT tt_name, product.prod_name, product_details.prod_price, product_details.prod_unit FROM typetea"
              + " INNER JOIN product ON typetea.tt_id = product.tt_id"
              + " INNER JOIN product_details ON product.prod_id = product_details.prod_id"
              + " WHERE (LOWER(product.prod_name) LIKE '" + productT + "')"
              + typCondition
              + " AND (product_details.prod_price BETWEEN '" + minp + "' AND '" + maxp + "')"
              + unitCondition;

  const request = new Request(
    qur,
    (err, rowCount, results) => {
      if (err) {
        console.error(err.message);
      } else {
        //console.log(results);
        return res
            .status(200)
            .send({ error: false, data: results, message: 'Items retrieved' });
      }
    }
  );
  connection.execSql(request);
});


router.get('/about', function(req, res, next) {
  res.sendfile('About us.html');
});

router.get('/products', function(req, res, next) {
  res.sendfile('product.html');
});

router.get('/delivery', function(req, res, next) {
  res.sendfile('delivery.html');
});


module.exports = router;

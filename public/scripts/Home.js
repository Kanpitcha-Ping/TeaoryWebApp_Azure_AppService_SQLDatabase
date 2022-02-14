function showLang() {

    var listLang = document.getElementById("dropdown-lang").getElementsByTagName("li");
    console.log(listLang[0]);

    for (var i = 0; i < listLang.length; i++) {
        if (listLang[i].style.visibility === "") {
            listLang[i].style.visibility = "inherit";
        } else {
            listLang[i].style.visibility = "";
        }
    }
}

function ShowPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function gotohome() {

    var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
    res.sendfile('index.html');
    });

    module.exports = router;
}



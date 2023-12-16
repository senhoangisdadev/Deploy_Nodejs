const express = require('express');
var mysql = require('mysql');
const app = express();
const post = 3000;
app.get('/', (req, res) => {
    res.send('Hello this is sample server');
});
app.get('/mysql', (req, res) => {
    var con = mysql.createConnection({
        host: "lab1.cypy9rzv0wtk.ap-southeast-1.rds.amazonaws.com",
        user: "admin",
        password: "mMr8hB0S7qYZgPD"
    });
    con.connect(function (err) {
        if (err) {
            res.send('Connection error: ' + err);
            return;
        }

        con.query("SHOW DATABASES;", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
})
app.listen(post, (req, res) => {
    console.log(`Example app listening on port ${post}!`);
})
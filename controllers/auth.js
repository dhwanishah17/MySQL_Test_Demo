const mysql = require('mysql');
const express = require('express');
const app = express();
const hbs = require('hbs')
var jwt = require("jsonwebtoken");
const decode = require('jwt-decode');

app.set("view engine", hbs);
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "Company",
    multipleStatements: true
});

exports.login = (req, res) => {
    try {
        let email = req.body.email;
        let passsword = req.body.passsword;

        connection.query("SELECT * FROM EMPLOYEES Where email=?", [email], (error, results) => {
            if (results[0].password === passsword) {
                let email = req.body.email;
                let passsword = req.body.passsword;

                const token = jwt.sign(
                    {
                        email: email,
                        passsword1: passsword
                    },
                    "seceret",
                    {
                        expiresIn: "1h"
                    }
                );
                console.log("token", token);
                var decoded = decode(token);
                // console.log(decoded);
                var mail = decoded.email
                // console.log("mail",mail)
                if (mail) {
                    connection.query("SELECT department FROM EMPLOYEES WHERE email = ?", [email], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Department", results[0].department);
                            return res.render('loggedin')
                        }
                    })
                }
            }
            else {
                return res.render('login',
                    { message: "Invalid password or email" })
            }
        })
    } catch (err) {
        console.log(err);
    }
}
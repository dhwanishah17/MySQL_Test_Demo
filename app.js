const express = require('express');
const mysql = require('mysql');
const parser = require('body-parser');
const app = express();
const path = require('path');
const multer = require('multer');
const helpers = require('./helpers');

app.use(express.static(path.join(__dirname, "./public")));
app.use(parser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "Company",
    multipleStatements: true
})
connection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected")
    }
})

const port = process.env.PORT || 5000;
app.listen(port);
console.log("App is listening to port 5000");

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.post('/employees', (req, res) => {
    var upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_image');
    upload(req, res, function (err) {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var date_of_joining = req.body.date_of_joining;
        var dob = req.body.dob;
        var department = req.body.department;
        var email = req.body.email;
        var passsword = req.body.passsword;
        var confirmpassword = req.body.confirmpasssword;

        connection.query("SELECT email FROM EMPLOYEES WHERE email = ?", [email], async (error, results) => {
            if (error) {
                console.log(error);
            } if (results.length > 0) {
                return res.render('register',
                    { message: "Email already exists" })
            }
            if (passsword.length < 7) {
                return res.render('register',
                    { message: "Password should be atleast 7 characters" })
            }
            else if (passsword !== confirmpassword) {
                return res.render('register',
                    { message: "Passwords do not match" })
            }
            // let profile_image = req.file.profile_image;
            let profile_image = __dirname + req.file.filename;
            let sql = 'INSERT INTO Employees( profile_image, first_name, last_name, date_of_joining , dob , department, email, password) VALUES(?,?,?,?,?,?,?,?)'
            connection.query(sql, [profile_image, first_name, last_name, date_of_joining, dob, department, email, passsword], (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                    return res.render('register',
                        { message: " User Registered " })
                }
            })
        })
    });
});


let sql = 'SELECT Employees.first_name AS Name, Department.name AS Department FROM Employees \
JOIN \
Department ON Employees.department = Department.name'
connection.query(sql, (err, result, fields) => {
    if (err) throw err;
    // console.log(result);
});


app.get('/employees', (req, res) => {
    connection.query('SELECT * FROM Employees', [req.params.emp_id], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
        }
    })
})

app.get('/department', (req, res) => {
    connection.query('SELECT * FROM Department', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
        }
    })
})

app.get('/department/:name', (req, res) => {
    connection.query('SELECT * FROM Department WHERE name = ?', [req.params.name], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
        }
    })
})
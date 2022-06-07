const express = require('express');
const { file,body, validationResult } = require('express-validator');
const mysql = require('mysql');
const parser = require('body-parser');
const app = express();
const path = require('path');
const multer = require('multer');
const helpers = require('./helpers');

app.use(express.static(path.join(__dirname,"./public")));
app.use(parser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine","hbs")
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
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

const port = process.env.PORT || 500;
app.listen(port);
console.log("App is listening to port 500");

 app.use('/',require('./routes/pages')); 
 app.use('/auth',require('./routes/auth')); 


app.post('/employees',(req, res) => {
    var upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_image');
    upload(req, res, function(err) {

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
    
    
    // 'profile_pic' is the name of our file input field in the HTML form
    // let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_image');
    // upload(req, res, function(err) {

    //     if (req.fileValidationError) {
    //         return res.send(req.fileValidationError);
    //     }
    //     else if (!req.file) {
    //         return res.send('Please select an image to upload');
    //     }
    //     else if (err instanceof multer.MulterError) {
    //         return res.send(err);
    //     }
    //     else if (err) {
    //         return res.send(err);
    //     }

    //     // let profile_image = req.file.profile_image;
    //     let profile_image = __dirname + req.file.filename;
    
            // let sql = `UPDATE Employees  SET profile_image = "${profile_image}"  WHERE email = ?`
            // connection.query(sql, [profile_image], (err, rows, fields) => {
            //     if (!err) {
            //         //    console.log(rows);
            //         return res.status(200).json({ message: "Added" });
            //     } else {
            //         return res.status(500).json(err);
            //     }
            // })
    });

});



































// app.post('/employees',(req, res) => {
//         // 'profile_pic' is the name of our file input field in the HTML form
//         let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_image');
//         upload(req, res, function(err) {

//             if (req.fileValidationError) {
//                 return res.send(req.fileValidationError);
//             }
//             else if (!req.file) {
//                 return res.send('Please select an image to upload');
//             }
//             else if (err instanceof multer.MulterError) {
//                 return res.send(err);
//             }
//             else if (err) {
//                 return res.send(err);
//             }

//             // let profile_image = req.file.profile_image;
//             let profile_image = __dirname + req.file.filename;
        
//                 let sql = `UPDATE Employees  SET profile_image = "${profile_image}"  WHERE email = ?`
//                 connection.query(sql, [profile_image], (err, rows, fields) => {
//                     if (!err) {
//                         //    console.log(rows);
//                         return res.status(200).json({ message: "Added" });
//                     } else {
//                         return res.status(500).json(err);
//                     }
//                 })
//         });

//     });

    
// app.post('/employees', body('first_name').exists(),
// body('last_name').exists(),
// body('email').isEmail(),
// body('passsword').isLength({ min: 5 }),
// body('dob').isDate(),(req, res) => {
//     // 'profile_pic' is the name of our file input field in the HTML form
//     let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_image');
//     upload(req, res, function(err) {

//         if (req.fileValidationError) {
//             return res.send(req.fileValidationError);
//         }
//         else if (!req.file) {
//             return res.send('Please select an image to upload');
//         }
//         else if (err instanceof multer.MulterError) {
//             return res.send(err);
//         }
//         else if (err) {
//             return res.send(err);
//         }

//         // let profile_image = req.file.profile_image;
//         let profile_image = __dirname + req.file.filename;
//             let first_name = req.body.first_name;
//             let last_name = req.body.last_name;
//             let date_of_joining = req.body.date_of_joining;
//             let dob = req.body.dob;
//             let department = req.body.department;
//             let email = req.body.email;
//             let passsword = req.body.passsword;

//             let sql = 'INSERT INTO Employees(profile_image, first_name, last_name, date_of_joining , dob , department, email, password) VALUES(?,?,?,?,?,?,?,?)'
//             connection.query(sql, [profile_image, first_name, last_name, date_of_joining, dob, department, email, passsword], (err, rows, fields) => {
//                 if (!err) {
//                     //    console.log(rows);
//                     return res.status(200).json({ message: "Added" });
//                 } else {
//                     return res.status(500).json(err);
//                 }
//             })
//         // }
//         // console.log(req.file);
//         // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="100" height= "100"><hr /><a href="./">Upload another image</a>`);
//     });
// });
    
//     app.delete('/employees/:emp_id', (req, res) => {
//     connection.query('DELETE FROM Employees WHERE emp_id = ? ', [req.params.emp_id], (err, rows, fields) => {
//         if (!err) {
//             console.log(rows);
//             res.send("Deleted Successfully")
//         } else {
//             console.log(err);
//         }
//     })
// })


// app.post('/employees', (req, res) => {
//     let first_name = req.body.first_name;
//     let last_name = req.body.last_name;
//     let date_of_joining = req.body.date_of_joining;
//     let dob = req.body.dob;
//     let department = req.body.department;
//     let email = req.body.email;
//     let passsword = req.body.passsword;
//     var date = moment(date_of_joining).utc().format('YYYY-MM-DD')
//     let sql = 'INSERT INTO Employees( first_name, last_name, date_of_joining , dob , department, email, passsword) VALUES(?,?,?,?,?,?,?)'
//     connection.query(sql, [first_name, last_name, date, dob, department, email, passsword], (err, rows, fields) => {
//         if (!err) {
//             //    console.log(rows);
//             return res.status(200).json({ message: "Added" });
//         } else {
//             return res.status(500).json(err);
//         }
//     })
// })


// app.put('/employees/:emp_id', (req, res) => {
//     const emp_id = req.params.emp_id;
//     let profile_image = req.body.profile_image;
//     let first_name = req.body.first_name;
//     let last_name = req.body.last_name;
//     let date_of_joining = req.body.date_of_joining;
//     let dob = req.body.dob;
//     let department = req.body.department;
//     let email = req.body.email;
//     let passsword = req.body.passsword;
//     let sql = 'UPDATE Employees SET profile_image = ?, first_name = ?, last_name = ?,  date_of_joining = ?, dob = ?, department = ?, email =?, passsword =? WHERE emp_id =?'
//     connection.query(sql, [profile_image, first_name, last_name, date_of_joining, dob, department, email, passsword, emp_id], (err, result, fields) => {
//         if (!err) {
//             if (result.affectedRows == 0) {
//                 return res.status(404).json({ message: "emp_id doesn,t exixts" });
//             }
//             return res.status(200).json({ message: "Updated Successfully" });
//         } else {
//             res.status(500).json(err);
//         }
//     });
// });


// //DEPARMENT

// // connection.query('CREATE TABLE Department(name VARCHAR(25))', (err, rows) => {
// //     if (err) {
// //         throw err;
// //     } else {
// //         console.log("DATA SENT")
// //         console.log(rows)
// //     }
// // })

// // connection.query('INSERT INTO Department(name) VALUES("NodeJs")', (err, rows) => {
// //     if (err) {
// //                 throw err;
// //             } else {
// //                 console.log("DATA SENT")
// //                 console.log(rows)
// //             }
// //         })

// app.get('/department', (req, res) => {
//     connection.query('SELECT * FROM Department', (err, rows, fields) => {
//         if (!err) {
//             console.log(rows);
//             res.send(rows)
//         } else {
//             console.log(err);
//         }
//     })
// })

// app.get('/department/:name', (req, res) => {
//     connection.query('SELECT * FROM Department WHERE name = ?', [req.params.name], (err, rows, fields) => {
//         if (!err) {
//             console.log(rows);
//             res.send(rows)
//         } else {
//             console.log(err);
//         }
//     })
// })


// app.delete('/department/:name', (req, res) => {
//     connection.query('DELETE FROM Department WHERE name = ? ', [req.params.name], (err, rows, fields) => {
//         if (!err) {
//             console.log(rows);
//             res.send("Deleted Successfully")
//         } else {
//             console.log(err);
//         }
//     })
// })

// app.post('/department', (req, res) => {
//     let name = req.body.name;
//     var sql = "INSERT INTO Department(name) VALUES(?)"
//     connection.query(sql, [name], (err, rows, fields) => {
//         if (!err) {
//             //    console.log(rows);
//             return res.status(200).json({ message: "Added" });
//         } else {
//             return res.status(500).json(err);
//         }
//     })
// })

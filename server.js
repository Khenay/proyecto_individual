const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'EldenRing'
});

const funciones = require("./funciones/funciones.js");
const router = require("./routes/routes");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mydb = "EldenRing";

app.use(express.static('public')); //enroutamientos
// app.use('/favicon.ico', express.static('favicon.ico'));
app.set('view engine', 'ejs');//paginas EJS
var urlencodedParser = bodyParser.urlencoded({ extended: false }) //para coger elementos de req.body...

app.use(express.json());

// app.get('/', function (req, res) {
//     // res.render('./pages/home.ejs');
// });
// app.get('/home', urlencodedParser, (req, res) => {
//     // res.render('./pages/home.ejs');
// });
// app.get('/register', urlencodedParser, (req, res) => {
//     res.render('./pages/register.ejs');
// });
// app.get('/place_order', urlencodedParser, (req, res) => {
//     res.render('./pages/place_order.ejs');
// });
// app.get('/registro', urlencodedParser, (req, res) => {
//     res.render('./pages/registro.ejs');
// });
// app.get('/tracking', urlencodedParser, (req, res) => {
//     res.render('./pages/tracking.ejs');
// });
// app.get('/contact', urlencodedParser, (req, res) => {
//     res.render('./pages/contact.ejs');
// });

app.post('/register', urlencodedParser, (req, res) => {
    let queryE = `SELECT email from Usuarios WHERE email = '${req.body.email}' `;
    let queryN = `SELECT nic from Usuarios WHERE nic = '${req.body.nic}'`;
    //hacer dos búsquedas
    connection.query(queryE, async (err, rowsE) => {
        if (err) throw err;

        connection.query(queryN, async (err, rowsN) => {
            if (err) throw err;

            console.log(rowsE)
            console.log(rowsN)
            if (rowsE[0] == undefined && rowsN[0] == undefined) {


                const sql = `INSERT INTO Usuarios VALUES (null,'${req.body.nic}',false,'${req.body.email}','${req.body.build}',SHA('${req.body.pass}'))`;
                connection.query(sql, (err, response) => {
                    if (err) throw err;

                    res.send(`Hello ${req.body.nic}`);
                });


            } else {
                res.send(`The email ${req.body.email} or the nic ${req.body.nic} are already being used`)
            }
        });
    });
});

app.post('/login', urlencodedParser, (req, res) => {
    //contraseña encriptada
    let query = `SELECT pass from Usuarios WHERE email = '${req.body.email}'`;
    connection.query(query, async (err, rows) => {
        if (err) throw err;

        if (rows[0] != undefined) {

            if (await rows[0].pass == funciones.SHA1(req.body.pass)) {

                res.send(`Hello, ${req.body.email}. You've been succesfully logged in`);
            } else {
                res.send(`Either the password or the email are incorrect`)
            }
        } else {
            res.send(`Either the password or the email are incorrect`)
        }
    });
});



app.listen(3000);
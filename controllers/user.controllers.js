const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'EldenRing'
});
const functions = require("../functions/functions.js");
const mongo = require('mongodb');
const url = "mongodb://localhost:27017/";
const MongoClient = mongo.MongoClient;
const mydb = "EldenRing";

const user = {

    register: (req, res) => {

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

                        res.json({
                            message: 'right'
                        });
                    });


                } else {
                    res.json({
                        message: 'wrong'
                    });
                }
            });
        });


        // console.log('hola')
        //da fallo de proxy al actualizar
        //el documento unicamente después de
        //haberle dado al botón
    },
    login: (req, res) => {







        //contraseña encriptada
        let query = `SELECT * from Usuarios WHERE email = '${req.body.email}'`;
        // let queryI = `SELECT id from Usuarios WHERE email = '${req.body.email}'`;

        
            connection.query(query, async (err, rows) => {
                if (err) throw err;

                if (rows[0].id != undefined) {
                    MongoClient.connect(url, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db(mydb);
                        dbo.collection("Armas").findOne({ usuario: rows[0].id.toString() }, function (err, result) {
                            if (err) throw err;
                            ;
                            if (rows[0].pass != undefined) {

                                if (rows[0].pass == functions.SHA1(req.body.pass)) {
                                    if (result != undefined) {
                                        console.log('weapon found')
                                    } else {
                                        console.log('weapon not found')
                                    }

                                    // res.json({
                                    //     name: result.nombre,
                                    //     class: result.clase
                                    // })
                                    res.json({
                                        message: 'right',
                                        nic: rows[0].nic,
                                        build: rows[0].build
                                    });
                                } else {
                                    res.json({
                                        message: 'wrong'
                                    });
                                }
                            } else {
                                res.json({
                                    message: 'wrong'
                                });
                            }
                            // db.close();
                        });
                    });
                } else {
                    res.json({
                        message: 'wrong'
                    });
                }

           

        });
    },
    // profile: (req, res) => {



    //     res.json({
    //         nic: 'wilfredo',
    //         build: 'blood mage'
    //     });
    // }
};

module.exports = user;
const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: "viaduct.proxy.rlwy.net",
    user: "root",
    port: 44657,
    password: "hDB1BDHe34Fah3ebhGh461315AAH4Agb",
    database: "railway"
});

conn.connect((err)=>{
    if(err) throw err;
    console.log("Polaczono z baza danych");
});

module.exports = conn;
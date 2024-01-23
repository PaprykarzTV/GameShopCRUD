const mysql = require("mysql");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bazaGier"
});

conn.connect((err)=>{
    if(err) throw err;
    console.log("Polaczono z baza danych");
});

module.exports = conn;
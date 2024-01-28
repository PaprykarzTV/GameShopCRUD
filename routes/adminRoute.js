const express = require("express");
const router = express.Router();
const conn = require("../connection");

function auth(req,res,next) {
    console.log("Proba polaczenia...");
    if(req.query.admin === "true") {
        console.log("Polaczenie zautoryzowane");
        res.status(200);
        next();
    } else {
        res.status(401);
        res.render('errorPage.ejs',{errorCode: 401,errorTitle: "Permission Denied"});
    }
}
router.use(express.static('assets'));
router.get("/", auth,(req,res) => {
    console.log("Polaczenie zautoryzowane /");
    var sql = "SELECT * FROM gry;";
    conn.query(sql,(error,results)=>{
        if(error) throw error;
        res.status(200);
        res.render("adminPanel.ejs",{test:results});
    });
});

router.get("/getData", auth,(req,res) => {
    console.log("Polaczenie zautoryzowane /");
    var sql = "SELECT * FROM gry;";
    conn.query(sql,(error,results)=>{
        if(error) throw error;
        res.status(200);
        res.send(results);
    });
});

router.post("/",(req,res) => {
    var nazwa = req.body.nazwa;
    var wydawca = req.body.wydawca;
    var cena = req.body.cena;

    var sql = `INSERT INTO gry(nazwa,producent,cena) VALUES ('${nazwa}','${wydawca}',${cena});`;

    conn.query(sql,(err,result)=>{
        if(err) throw err;
        console.log("Dane zostały przesłane");
        res.status(200);
        res.redirect("/administrator?admin=true");
    });
});


router.get("/delete",(req,res)=>{
    var id = req.query.id;
    var sql = `DELETE FROM gry WHERE id = ${id}`;
    conn.query(sql,(err)=>{
        if(err) throw err;
        console.log(sql);
        res.redirect("/administrator?admin=true");
    });
});

module.exports = router;
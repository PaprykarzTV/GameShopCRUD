const express = require("express");
const router = express.Router();
const conn = require("../connection");
router.use(express.static('assets'));

function auth(req,res,next) {
    console.log("Proba polaczenia...");
    if(req.query.admin === "true") {
        console.log("Polaczenie zautoryzowane");
        res.status(200);
        next();
    } else {
        res.status(401);
        console.log("Polaczenie odrzucone");
        res.render('errorPage.ejs',{errorCode: 401,errorTitle: "Permission Denied"});
    }
}

router.get("/", auth,(req,res) => {
    var sql = "SELECT * FROM konta;";
    conn.query(sql,(error,results)=>{
        if(error) throw error;
        res.status(200);
        res.render("adminPanel.ejs",{test:results});
    });
});

router.post("/validatelogin",(req,res) => {
    var login = req.body.login;
    var password = req.body.password;
    var sql = `SELECT * FROM konta WHERE login="${login}" AND password="${password}";`;
    console.log(sql);
    conn.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length === 0) {
            res.status(401).send("Nieudane logowanie");
        } else res.status(200).send(`${results[0].step_count}`);   
    });
});

router.post("/uploaddata",(req,res) => {
    var stepCount = req.body.stepCount;
    var login = req.body.login;
    var password = req.body.password;

    var sql = `UPDATE konta SET step_count=${stepCount} WHERE login="${login}" AND password="${password}";`;
    console.log(sql);
    conn.query(sql,(error,results)=>{
        if(error) throw error;
    });
});

router.post("/",(req,res) => {
    var login = req.body.login;
    var password = req.body.password;

    var sql = `INSERT INTO konta(login,password) VALUES ('${login}','${password}');`;

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
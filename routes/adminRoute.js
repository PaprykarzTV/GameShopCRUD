const express = require("express");
const router = express.Router();
const conn = require("../connection");
router.use(express.static('assets'));

function auth(req,res,next) {
    console.log("Proba polaczenia...");
    if(req.query.admin === "true123") {
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
        } else {
            var getStepsFromTodaySql = `SELECT * FROM kroki WHERE user_id = ${results[0].id} AND date = CURRENT_DATE()`;
            console.log(getStepsFromTodaySql);
            conn.query(getStepsFromTodaySql, (error2,results2) => {
                if(error2) throw error2;
                if(results2.length === 0) {
                    res.status(200).send(`0`);
                } else {
                    res.status(200).send(`${results2[0].steps}`)
                }
            })
        } 
        //res.status(200).send(`${results[0].step_count}`);   
    });
});

router.post("/uploaddata",(req,res) => {
    var stepCount = parseInt(req.body.stepCount);
    var login = req.body.login;
    var password = req.body.password;
    getIdSql = `SELECT id FROM konta WHERE login="${login}" AND password="${password}"`;
    conn.query(getIdSql, (error, results) => {
        if (error) {
            throw error;
        }

        if (results.length > 0) {
            var userId = results[0].id;

            var searchForUploadedDataTodaySql = `SELECT * FROM kroki WHERE user_id=${userId} AND date=CURRENT_DATE()`
            conn.query(searchForUploadedDataTodaySql, (error2,results2) =>{
                if(error2) throw error2;

                //Jesli pierwszy raz dane sa zapisywane w ciagu dnia tworzy rekord do dnia
                if(results2.length === 0) {
                    var uploadSql = `INSERT INTO kroki(user_id,steps,date) VALUES (${userId},${stepCount},CURRENT_DATE()) `
                    conn.query(uploadSql,(error3,results3) => {
                        if(error3) throw error3;
                        console.log("Data inserted");
                        res.sendStatus(200);
                    });
                } else {
                    //Jesli dane z aktualnego dnia sa, zaktualizuje baze danych 
                    uploadSql = `UPDATE kroki SET steps = ${stepCount} WHERE user_id=${userId} AND date=CURRENT_DATE()`
                    console.log(uploadSql)
                    conn.query(uploadSql,(error3,results3) => {
                        if(error3) throw error3;
                        console.log("Data updated");
                        // res.sendStatus(200);
                        res.status(200).send("Wysłano pomyślnie dane");
                    });
                }
            });
            
        } else {
            console.log("Użytkownik nie znaleziony.");
            res.sendStatus(401);
        }
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
        res.redirect("/administrator?admin=true123");
    });
});

router.get("/delete",(req,res)=>{
    var id = req.query.id;
    var sql = `DELETE FROM konta WHERE id = ${id}`;
    conn.query(sql,(err)=>{
        if(err) throw err;
        res.redirect("/administrator?admin=true123");
    });
});

module.exports = router;
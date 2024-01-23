const express = require("express");
const app = express();
var conn = require("./connection");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const defaultRoute = require("./routes/adminRoute");
app.use("/administrator",defaultRoute);

app.set("view engine","ejs");
app.use(express.static('assets'));

app.get("/",(req,res)=> {
    res.render('index.ejs');
});

app.listen(3002,()=> {
    console.log("Serwer dziala");
});






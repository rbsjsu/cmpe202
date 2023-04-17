const express = require('express');
const mongoose = require('mongoose');


const config = require('./config.json');
const router = require('./routes/router');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/', router);



mongoose.connect(config.db.url,  { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "db connection error: "));
db.once("open", function () {
  console.log("DB Connected successfully");
});

app.listen(config.port, () =>{
  console.log("Server running on " + config.port + " !!!");
});





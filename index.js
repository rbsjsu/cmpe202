const express = require('express');
const mongoose = require('mongoose');


const config = require('./config.json');
const router = require('./routes/router');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/', router);


try {
    mongoose.connect(config.db.url,  { useUnifiedTopology: true, useNewUrlParser: true });
  } catch (err) {
    console.log("Error Connecting to Database !!!")
  }

const connection = mongoose.connection;

connection.once("open", () =>{
    console.log("Database Connection established Successfully !!!!");
});

app.listen(config.port, () =>{
  console.log("Server running on " + config.port + " !!!");
});





const express = require("express");
const morgan = require("morgan");

const app = express();


const accessRoutes = require ("./routes/accessRoutes");

app.use(express.json());

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use("/access", accessRoutes);

module.exports = app; 

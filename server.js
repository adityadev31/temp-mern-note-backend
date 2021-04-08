// imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const DBURL = process.env.DBURL;
const encrypt = require('mongoose-encryption');
const app = express();

// switches
app.use(express.json());
app.use(cors());

// db connection
mongoose
.connect(DBURL, {useCreateIndex:true, useFindAndModify:false, useNewUrlParser:true, useUnifiedTopology:true})
.then(() => console.log('db connected successfully'))
.catch(err => console.log('db not connected'));

// import routes
const userRoutes = require("./src/routes/userRoutes");
const noteRoutes = require("./src/routes/noteRoutes");

// use routes
app.use("/auth", userRoutes);
app.use("/notes", noteRoutes);

// listen server
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
//import express
const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const multer = require("multer");
const cors = require("cors");

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../src/assets/Reference");
  },
  filename: (req, file, cb) => {
    console.log(file);
    //console.log("filename");
    cb(null, "reference" + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//app.set("view engine");

app.get("/upload", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  //res.render("upload");
});

app.post("/upload", upload.single("image"), (req, res) => {
  res.send("Image Uploaded");
});

app.listen(3002);

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://lyztw.synology.me:7778",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// Set response access control headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://lyztw.synology.me:7778");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use((req, res, next) => {
  console.log(
    "\x1b[32m",
    `${new Date().toLocaleTimeString()} ${req.connection.remoteAddress
    } requested the api:`
  );
  console.log("\x1b[33m", `${req.method}  ${req.originalUrl}`);
  console.log("\x1b[33m", `Session ID: ${req.sessionID}`);
  console.log("\x1b[35m", req.body);
  console.log("\x1b[35m", req.params);
  console.log("\x1b[35m", req.query);

  next();
});

app.get("/", (req, res) => {
  res.send("hello, this is corgi");
});

app.use("/players", require("./routes/player"));

async function mongodbConnect() {
  mongoose
    .connect("mongodb+srv://admin:admin@unify.mmecmn0.mongodb.net", {
      dbName: "aaa",
      useNewUrlParser: true,
      autoIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connect success");
    })
    .catch((err) => {
      console.log(err);
    });
}


require('https').createServer({
  key: fs.readFileSync('./ssl/RSA-privkey.pem'),
  cert: fs.readFileSync('./ssl/RSA-cert.pem'),
}, app).listen(7777, async () => {
  await mongodbConnect();
  console.log("app is running");
});
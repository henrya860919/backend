const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const whiteList = ["https://lyztw.synology.me:7778", "http://localhost:7778"];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: whiteList,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// Set response access control headers
app.use((req, res, next) => {
  if (req.header("origin") !== undefined) {
    const index = whiteList.indexOf(req.header("origin"));
    if (index !== -1) {
      const allowedOrigin = whiteList[index];
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Origin", allowedOrigin);
      res.header("Access-Control-Allow-Private-Network", true);
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Set-Cookie,Content-Type,Authorization,Location"
      );
    }
  }

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

app.use("/reserves", require("./routes/reserve"));
app.use("/users", require("./routes/user"));
app.use("/schedules", require("./routes/schedule"));

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

// require('https').createServer({
//   key: fs.readFileSync('./ssl/RSA-privkey.pem'),
//   cert: fs.readFileSync('./ssl/RSA-cert.pem'),
// }, app).listen(7777, async () => {
//   await mongodbConnect();
//   console.log("app is running");
// });
// app.listen(7777, async () => {
//   await mongodbConnect();
//   console.log("app is running");
// });


require('https').createServer({
  key: fs.readFileSync('./ssl/RSA-privkey.pem'),
  cert: fs.readFileSync('./ssl/RSA-cert.pem'),
}, app).listen(7777, async () => {
  await mongodbConnect();
  console.log("app is running");
});
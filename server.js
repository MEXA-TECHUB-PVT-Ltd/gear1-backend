const express = require("express");
// const fileupload = require("express-fileupload");

// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const bodyParser = require("body-parser"); /* deprecated */
// const client = require("./app/models/db");
const app = express();
const dbConfig = require('./app/config/db.config')
require('dotenv').config()
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
var corsOptions = {
  // origin: "http://localhost:8081"
};
app.use(cors()) // Use this
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
// app.use(fileupload());
app.use(express.static("files"));
// parse requests of content-type - application/json
// app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */
app.use("/images_uploads", express.static("images_uploads"))

// server.listen(80);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Gear 1" });
});

require("./app/routes/admin")(app);
require("./app/routes/auth")(app);
require("./app/routes/SocialMedia")(app);
require("./app/routes/Screen")(app);
require("./app/routes/Ads")(app);
require("./app/routes/Categories")(app);
require("./app/routes/Items")(app);
require("./app/routes/SaveItem")(app);
require("./app/routes/ShareItem")(app);
require("./app/routes/LikeItem")(app);
require("./app/routes/RateUser")(app);
require("./app/routes/Merchandise")(app);
require("./app/routes/Follow")(app);
require("./app/routes/Notifications")(app);
require("./app/routes/Location")(app);
require("./app/routes/DailyDeals")(app);
require("./app/routes/Orders")(app);
require("./app/routes/Logos")(app);
require("./app/routes/image_cache")(app);
require("./app/routes/report_ads")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


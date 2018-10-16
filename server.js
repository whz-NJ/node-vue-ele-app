const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//引入 users.js
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");

// DB Config
const db = require("./config/keys").mogoURI;
// Connect to mongodb
mongoose.connect(db)
    .then( () => console.log("MongoDB connected."))
    .catch(err => console.log(err));

const app = express();
// app.get("/", (req, res) =>{
//     res.send("Hello World!");
// })

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//passport初始化
app.use(passport.initialize());
require("./config/passport")(passport);

// 使用 routes
// app.use("api/users", users); 不能使用双引号！！！
app.use('/api/users', users);
app.use('/api/profiles', profiles);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);


})

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/UserModel");
const AppError = require("./utils/AppError");
const Redis = require('redis');
const axios = require("axios")

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(logger("dev"));


const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
})

redisClient.connect().catch(console.error);

app.delete("/api/v1/externalUsers", async(req, res, next)=>{
  try{
    const reply = await redisClient.flushAll()
    res.status(200).json({status: "success", message: "Data Cleared from Redis DB", data: reply})
  }catch(err){
    res.status(400).json({status: "failure", message: err })
  }
})

app.get("/api/v1/externalUsers", async(req, res, next)=>{
  const data = await redisClient.get("externalUsers")
  if(data === null) {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/users`
    );
    const externalUsers = JSON.stringify(data);
    await redisClient.set("externalUsers", externalUsers);
    res.json({ src: "typicode", externalUsers: data });
  }else{
    const parsedData = JSON.parse(data)
    res.status(200).json({status: "success", src: "redis", data: parsedData})
  }
})
app.get("/api/v1/users", async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ status: "success", data: users });
});

app.delete("/api/v1/users", async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.body.userid);
  res
    .status(200)
    .json({
      status: "success",
      message: "User deleted successfully",
      data: user,
    });
});

app.patch("/api/v1/users/", async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.body.userid, req.body);
  res
    .status(200)
    .json({
      status: "success",
      message: "User updated sucessfully",
      data: user,
    });
});

app.post("/api/v1/users/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(`A user must provide email and password`, 400));
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return next(new AppError(`The user with this email does not exist`, 400));
    }

    const passwordCheck = password === user.password;

    if (!user || !passwordCheck) {
      return next(new AppError(`Email or password is incorrect`, 400));
    }

    res.status(200).json({ status: "success", user });
  } catch (err) {
    return next(new AppError(`${err.message}`, 400));
  }
});

app.post("/api/v1/users/signup", async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(200).json({ status: "success", user: newUser });
  } catch (err) {
    return next(new AppError(`${err.message}`, 400));
  }
});

//Error Handler
app.use((err, req, res, next) => {
  if (err) {
    if (process.env.NODE_ENV === "production") {
      res.status(400).json({ status: "fail", message: "Bad request" });
    } else {
      console.log(err);
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
      });
    }
  }
});

module.exports = app;

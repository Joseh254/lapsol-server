import express from "express";
import dotenv from "dotenv";

import login from "./Routes/Login/Login.Route.js";
import signup from "./Routes/SignUp/SignUp.Route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to jovatech server!");
});
app.use("/api/login", login);
app.use("/api/signup", signup);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

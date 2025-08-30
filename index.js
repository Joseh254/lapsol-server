import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'

import login from "./Routes/Login/Login.Route.js";
import signup from "./Routes/SignUp/SignUp.Route.js";
import logout from './Routes/Logout/Logout.Route.js'
import reflesh from './Routes/RefleshToken/RefleshToken.Route.js'
import fetchAllUsers from './Routes/FetchAllUsers/FetchAllUsers.Route.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5432", // adjust to your frontend URL
  credentials: true,
}));
app.get("/", (req, res) => {
  res.send("Welcome to jovatech server!");
});


app.use("/api/login", login);
app.use("/api/signup", signup);
app.use('/api/reflesh',reflesh)
app.use('/api/logout',logout)
app.use('/api/fetchallUsers',fetchAllUsers)


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

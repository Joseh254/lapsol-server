import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import login from "./Routes/Login/Login.Route.js";
import signup from "./Routes/SignUp/SignUp.Route.js";
import logout from "./Routes/Logout/Logout.Route.js";
import reflesh from "./Routes/RefleshToken/RefleshToken.Route.js";
import fetchAllUsers from "./Routes/FetchAllUsers/FetchAllUsers.Route.js";
import updateprofile from "./Routes/UpdateProfile/UpdateProfileRoutr.js";
import deleteproduct from "./Routes/DeleteProduct/DeleteProduct.Route.js";
import updateproduct from "./Routes/UpdateProduct/UpdateProduct.Route.js";
import addproduct from "./Routes/AddProduct/AddProduct.Route.js";
import fetchallproducts from "./Routes/FetchAllProducts/FetchAllProducts.Route.js";
import fetchoneproduct from "./Routes/FetchOneProduct/FetchOneProduct.Route.js";
import addcustomer from "./Routes/AddCustomer/AddCustomer.Route.js";
import updatecustomer from "./Routes/UpdateCustomer/UpdateCustomer.Route.js";
import createsale from "./Routes/CreateSale/CreateSale.Route.js";
import viewcustomerbalance from "./Routes/ViewCustomerBalance/ViewCustomerBalance.Route.js";
import returnproduct from "./Routes/ReturnProduct/ReturnProduct.Route.js";
import recordcustomerpayment from "./Routes/RecordCustomerPayment/RecordCustomerPayment.Route.js";
import fetchallcustomers from "./Routes/FetchAllCustomers/FetchAllCustomers.Route.js";
import fetchonecustomer from "./Routes/FetchOneCustomer/FetchOneCustomer.Route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:[ "http://localhost:5173","https://lapsol-technologies.vercel.app/"], 
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.send("Welcome to jovatech server!");
});

app.use("/api/login", login);
app.use("/api/signup", signup);
app.use("/api/reflesh", reflesh);
app.use("/api/logout", logout);
app.use("/api/fetchallUsers", fetchAllUsers);
app.use("/api/updateprofile", updateprofile);
app.use("/api/deleteproduct", deleteproduct);
app.use("/api/updateproduct", updateproduct);
app.use("/api/addproduct", addproduct);
app.use("/api/fetchallproducts", fetchallproducts);
app.use("/api/fetchoneproduct", fetchoneproduct);
app.use("/api/addcustomer", addcustomer);
app.use("/api/updatecustomer", updatecustomer);
app.use("/api/createsale", createsale);
app.use("/api/viewcustomerbalance", viewcustomerbalance);
app.use("/api/returnproduct", returnproduct);
app.use("/api/recordcustomerpayment", recordcustomerpayment);
app.use("/api/fetchallcustomers", fetchallcustomers);
app.use("/api/fetchonecustomer", fetchonecustomer);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

//sell products to customers on credit
//view customer balances for individual customer
//when customer pay it deduct from balances
// receive products from other sellers on credit
// sell products on cash to customers
// create account for customers
//
// ,once i sell product it  deduct from database,
// ,they can return product and adjust database records,,when they pay,
// ,system  adjust balances,,i can view individual customer balances,,
// which user was logged in at that time,

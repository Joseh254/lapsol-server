import { Router } from "express";
import { GetTokenMiddleware } from "../../Middleware/GetTokenMiddleware/GetToken.Middleware.js";
import { sendStkPush } from "../../Controller/StkPushController/StkPush.Controller.js";
import 
const router = Router();

router.post("/stkPush", GetTokenMiddleware, sendStkPush);
export default 
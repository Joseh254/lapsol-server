import { Router } from "express";
import { GetTokenMiddleware } from "../../Middleware/GetTokenMiddleware/GetToken.Middleware.js";
import { sendStkPush } from "../../Controller/StkPushController/StkPush.Controller.js";
import { UserAuth } from "../../../Auths/User/UserAuth.js";
const router = Router();

router.post("/stkPush", UserAuth,GetTokenMiddleware, sendStkPush);
export default router;

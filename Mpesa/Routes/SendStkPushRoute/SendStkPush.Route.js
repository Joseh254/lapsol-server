import { Router } from "express";
import { GetTokenMiddleware } from "../../Middleware/GetTokenMiddleware/GetToken.Middleware.js";
import { sendStkPush } from "../../Controller/StkPushController/StkPush.Controller.js";
import { UserAuth } from "../../../Auths/User/UserAuth.js";
import { ValidateInputsMiddleware } from "../../Middleware/ValidateInputsMiddleware/ValidateInputs.Middleware.js";
const router = Router();

router.post("/", ValidateInputsMiddleware, GetTokenMiddleware, sendStkPush);
export default router;

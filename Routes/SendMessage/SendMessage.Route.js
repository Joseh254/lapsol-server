import { SendMessageController } from "../../Controllers/SendMessage/SendMessage.Controller.js";

import { Router } from "express";
import { SendMessageMiddleware } from "../../Middlewares/SendMessage/SendMessage.Middleware.js";

const router = Router();

router.post("/", SendMessageMiddleware, SendMessageController);
export default router;

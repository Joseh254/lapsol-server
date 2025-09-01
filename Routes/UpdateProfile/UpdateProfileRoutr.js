import { Router } from "express";

import { UpdateProfileController } from "../../Controllers/UpdateProfile/UpdateProfile.Controller.js";
import {UpdateProfileMiddleware} from "../../Middlewares/Update/UpdateProfile.Middleware.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();

router.patch("/:id",UserAuth,UpdateProfileMiddleware, UpdateProfileController);

export default router;

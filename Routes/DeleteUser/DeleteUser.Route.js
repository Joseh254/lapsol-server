import { Router } from "express";
import { deleteUserController } from "../../Controllers/DeleteUser/DeleteUser.Controller.js";
import AdminAuth from "../../Auths/Admin/AdminAuth.js";
const router = Router();
router.delete("/:id", AdminAuth, deleteUserController);
export default router;

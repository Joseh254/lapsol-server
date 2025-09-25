import { Router } from "express";
import { AddSupplierController } from "../../Controllers/AddSupplier/AddSupplier.Controller.js";

const router = Router()
router.post('/',AddSupplierController)
export default router;
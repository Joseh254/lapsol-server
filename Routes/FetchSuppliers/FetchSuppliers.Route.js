import { Router } from "express";
import { FetchSuppliersController } from "../../Controllers/FetchSuppliers/FetchSuppliers.Controller.js";

const router = Router()
router.get('/',FetchSuppliersController)
export default router;
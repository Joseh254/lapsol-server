import { Router} from 'express';

import { UpdateProductController } from '../../Controllers/UpdateProduct/UpdateProduct.Controller.js';

const router = Router()

router.patch('/',UpdateProductController)
export default router;
import { Router} from 'express';

import { DeleteProductController } from '../../Controllers/DeleteProduct/DeleteProduct.Controller.js';

const router = Router()
router.delete('/',DeleteProductController)

export default router;
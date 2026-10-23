
import { Router } from 'express';
import * as controller from '../controllers/authController.js';

const router = Router();

router.post('/cadastro', controller.cadastrar);
router.post('/login', controller.login);

export default router;

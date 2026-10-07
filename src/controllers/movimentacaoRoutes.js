import { Router } from 'express';
import * as controller from './movimentacaoController.js';

const router = Router();

router.post('/', controller.movimentar);
router.get('/', controller.listar);
router.get('/produto/:produtoId', controller.listarPorProduto);

export default router;

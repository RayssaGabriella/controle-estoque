
import { Router } from 'express';
import * as controller from '../controllers/produtoController.js';
import { autenticar, permitirPerfis } from '../middlewares/auth.js';

const router = Router();

router.use(autenticar);

router.get('/baixo-estoque', controller.listarAbaixoDoLimite);
router.post('/', controller.cadastrar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', permitirPerfis('ADMINISTRADOR'), controller.deletar);

export default router;

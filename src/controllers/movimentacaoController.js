
import * as movimentacaoService from '../movimentacaoService.js';

export async function movimentar(req, res, next) {
  try {
    const movimentacao = await movimentacaoService.movimentar(
      req.body,
      req.usuario.id
    );

    res.status(201).json(movimentacao);
  } catch (erro) {
    next(erro);
  }
}


export async function listar(req, res, next) {
  try {
    res.json(await movimentacaoService.listar(req.query));
  } catch (erro) {
    next(erro);
  }
}


export async function listarPorProduto(req, res, next) {
  try {
    res.json(
      await movimentacaoService.listarPorProduto(
        Number(req.params.produtoId)
      )
    );
  } catch (erro) {
    next(erro);
  }
}

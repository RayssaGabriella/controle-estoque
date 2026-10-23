
import * as authService from '../services/authService.js';

export async function cadastrar(req, res, next) {
  try {
    const usuario = await authService.cadastrar(req.body);
    res.status(201).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

export async function login(req, res, next) {
  try {
    const resultado = await authService.login(req.body);
    res.json(resultado);
  } catch (erro) {
    next(erro);
  }
}

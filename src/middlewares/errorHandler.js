export function errorHandler(erro, req, res, next) {
  console.error(erro);
  res.status(400).json({
    timestamp: new Date().toISOString(),
    status: 400,
    erro: erro.message || 'Erro interno'
  });
}

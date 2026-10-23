
export function errorHandler(erro, req, res, next) {
  console.error(erro);

  if (erro.code === 'P2002') {
    return res.status(409).json({
      timestamp: new Date().toISOString(),
      status: 409,
      erro: 'Já existe um registro com esses dados.'
    });
  }

  if (erro.code === 'P2003') {
    return res.status(409).json({
      timestamp: new Date().toISOString(),
      status: 409,
      erro: 'Não é possível realizar esta operação porque existem registros vinculados.'
    });
  }

  if (erro.code === 'P2025') {
    return res.status(404).json({
      timestamp: new Date().toISOString(),
      status: 404,
      erro: 'Registro não encontrado.'
    });
  }

  if (
    erro.message?.includes('não encontrado') ||
    erro.message?.includes('não encontrada')
  ) {
    return res.status(404).json({
      timestamp: new Date().toISOString(),
      status: 404,
      erro: erro.message
    });
  }

  if (
    erro.message?.includes('Não é possível excluir') ||
    erro.message?.includes('já está cadastrado')
  ) {
    return res.status(409).json({
      timestamp: new Date().toISOString(),
      status: 409,
      erro: erro.message
    });
  }

  if (erro instanceof Error && erro.constructor === Error) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      erro: erro.message || 'Dados inválidos.'
    });
  }

  return res.status(500).json({
    timestamp: new Date().toISOString(),
    status: 500,
    erro: 'Erro interno do servidor.'
  });
}

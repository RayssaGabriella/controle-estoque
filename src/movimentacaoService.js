import prisma from './lib/prisma.js';

export async function movimentar(dto) {
  const produtoId = Number(dto.produtoId);
  const tipo = String(dto.tipo ?? '').toUpperCase();
  const quantidade = Number(dto.quantidade);

  if (!Number.isInteger(produtoId) || produtoId <= 0) {
    throw new Error('produtoId inválido');
  }
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new Error('Quantidade deve ser um número inteiro maior que zero');
  }
  if (!['ENTRADA', 'SAIDA'].includes(tipo)) {
    throw new Error('Tipo de movimentação inválido. Use ENTRADA ou SAIDA');
  }

  return prisma.$transaction(async (tx) => {
    const produto = await tx.produto.findUnique({ where: { id: produtoId } });
    if (!produto) throw new Error('Produto não encontrado');

    if (tipo === 'SAIDA' && produto.quantidade < quantidade) {
      throw new Error('Estoque insuficiente');
    }

    const novaQuantidade = tipo === 'ENTRADA'
      ? produto.quantidade + quantidade
      : produto.quantidade - quantidade;

    const produtoAtualizado = await tx.produto.update({
      where: { id: produtoId },
      data: { quantidade: novaQuantidade }
    });

    return tx.movimentacao.create({
      data: { tipo, quantidade, produtoId },
      include: { produto: true }
    });
  });
}

export async function listar() {
  return prisma.movimentacao.findMany({
    include: { produto: true },
    orderBy: { id: 'asc' }
  });
}

export async function listarPorProduto(produtoId) {
  return prisma.movimentacao.findMany({
    where: { produtoId },
    include: { produto: true },
    orderBy: { id: 'asc' }
  });
}

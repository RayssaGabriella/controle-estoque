
import prisma from './lib/prisma.js';

export async function movimentar(dto, usuarioId) {
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
    const produto = await tx.produto.findUnique({
      where: { id: produtoId }
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    if (tipo === 'SAIDA' && produto.quantidade < quantidade) {
      throw new Error(
        `Saída não permitida: estoque insuficiente. Disponível: ${produto.quantidade}. Solicitado: ${quantidade}.`
      );
    }

    const novaQuantidade = tipo === 'ENTRADA'
      ? produto.quantidade + quantidade
      : produto.quantidade - quantidade;

    await tx.produto.update({
      where: { id: produtoId },
      data: { quantidade: novaQuantidade }
    });

    return tx.movimentacao.create({
      data: {
        tipo,
        quantidade,
        produtoId,
        usuarioId
      },
      include: {
        produto: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true
          }
        }
      }
    });
  });
}


export async function listar({ dataInicial, dataFinal } = {}) {
  const where = {};

  if (dataInicial || dataFinal) {
    where.dataMovimentacao = {};

    if (dataInicial) {
      const inicio = new Date(`${dataInicial}T00:00:00.000Z`);

      if (Number.isNaN(inicio.getTime())) {
        throw new Error('Data inicial inválida');
      }

      where.dataMovimentacao.gte = inicio;
    }

    if (dataFinal) {
      const fim = new Date(`${dataFinal}T23:59:59.999Z`);

      if (Number.isNaN(fim.getTime())) {
        throw new Error('Data final inválida');
      }

      where.dataMovimentacao.lte = fim;
    }
  }

  return prisma.movimentacao.findMany({
    where,
    include: {
      produto: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
          perfil: true
        }
      }
    },
    orderBy: { dataMovimentacao: 'desc' }
  });
}

export async function listarPorProduto(produtoId) {
  return prisma.movimentacao.findMany({
    where: { produtoId },
    include: {
      produto: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
          perfil: true
        }
      }
    },
    orderBy: { dataMovimentacao: 'desc' }
  });
}


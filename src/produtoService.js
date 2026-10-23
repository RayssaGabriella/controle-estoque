import prisma from './lib/prisma.js';

function validarProduto(dto) {
  const { nome, quantidade, limiteMinimo } = dto;

  if (!nome || typeof nome !== 'string') {
    throw new Error('Nome do produto é obrigatório');
  }

  if (!Number.isInteger(quantidade) || quantidade < 0) {
    throw new Error('Quantidade deve ser um número inteiro maior ou igual a zero');
  }

  if (!Number.isInteger(limiteMinimo) || limiteMinimo < 0) {
    throw new Error('Limite mínimo deve ser um número inteiro maior ou igual a zero');
  }
}

export async function cadastrar(dto) {
  validarProduto(dto);
  return prisma.produto.create({ data: dto });
}


export async function listar({ pagina = 1, limite = 10, nome = '' } = {}) {
  const paginaNumero = Math.max(1, Number(pagina) || 1);
  const limiteNumero = Math.min(100, Math.max(1, Number(limite) || 10));
  const filtroNome = String(nome).trim();

  const where = filtroNome
    ? { nome: { contains: filtroNome } }
    : {};

  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      orderBy: { id: 'asc' },
      skip: (paginaNumero - 1) * limiteNumero,
      take: limiteNumero
    }),
    prisma.produto.count({ where })
  ]);

  return {
    dados: produtos,
    pagina: paginaNumero,
    limite: limiteNumero,
    total,
    totalPaginas: Math.ceil(total / limiteNumero)
  };
}


export async function buscarPorId(id) {
  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) throw new Error('Produto não encontrado');
  return produto;
}

export async function atualizar(id, dto) {
  validarProduto(dto);
  await buscarPorId(id);
  return prisma.produto.update({ where: { id }, data: dto });
}


export async function deletar(id) {
  await buscarPorId(id);

  const movimentacoes = await prisma.movimentacao.count({
    where: { produtoId: id }
  });

  if (movimentacoes > 0) {
    throw new Error(
      'Não é possível excluir este produto porque existem movimentações vinculadas a ele.'
    );
  }

  await prisma.produto.delete({ where: { id } });
}


export async function listarAbaixoDoLimite() {
  
  return prisma.$queryRaw`
    SELECT id, nome, quantidade, limite_minimo AS limiteMinimo
    FROM produto
    WHERE quantidade <= limite_minimo
    ORDER BY id
  `;
}

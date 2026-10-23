
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function cadastrar(dto) {
  const nome = String(dto.nome ?? '').trim();
  const email = String(dto.email ?? '').trim().toLowerCase();
  const senha = String(dto.senha ?? '');

  if (!nome || !email || !senha) {
    throw new Error('Nome, email e senha são obrigatórios');
  }

  if (senha.length < 8) {
    throw new Error('A senha deve ter pelo menos 8 caracteres');
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email }
  });

  if (usuarioExistente) {
    throw new Error('Este email já está cadastrado');
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
      perfil: 'OPERADOR'
    },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true
    }
  });

  return usuario;
}

export async function login(dto) {
  const email = String(dto.email ?? '').trim().toLowerCase();
  const senha = String(dto.senha ?? '');

  if (!email || !senha) {
    throw new Error('Email e senha são obrigatórios');
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    throw new Error('Email ou senha inválidos');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está configurado');
  }

  const token = jwt.sign(
    {
      perfil: usuario.perfil
    },
    process.env.JWT_SECRET,
    {
      subject: String(usuario.id),
      expiresIn: '8h'
    }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    }
  };
}

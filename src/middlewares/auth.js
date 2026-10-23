
import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      erro: 'Autenticação necessária. Informe um token válido.'
    });
  }

  const token = authorization.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está configurado');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: Number(payload.sub),
      perfil: payload.perfil
    };

    next();
  } catch {
    return res.status(401).json({
      erro: 'Token inválido ou expirado.'
    });
  }
}

export function permitirPerfis(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        erro: 'Você não tem permissão para realizar esta operação.'
      });
    }

    next();
  };
}

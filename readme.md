# API de Controle de Estoque — Node.js + Express + Prisma + MySQL

Conversão da API original em Spring Boot para JavaScript.

## Tecnologias

- Node.js
- JavaScript ES Modules
- Express
- CORS
- Prisma ORM
- MySQL / MariaDB compatível com protocolo MySQL
- mysql2 (instalado conforme solicitado; o acesso ORM da aplicação é feito pelo Prisma)

## Estrutura

```text
estoque-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── lib/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
```

## 1. Criar o banco

```sql
CREATE DATABASE IF NOT EXISTS estoque_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

## 2. Configurar o ambiente

Copie `.env.example` para `.env`.

Exemplo equivalente ao projeto Spring Boot original:

```env
PORT=3000
DATABASE_URL="mysql://root:1234@localhost:3307/estoque_db"
```

Se seu MySQL estiver na porta padrão, troque `3307` por `3306`.

## 3. Instalar e preparar o Prisma

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## 4. Executar

```bash
npm run dev
```

Servidor: `http://localhost:3000`

## Rotas

| Método | Rota | Função |
|---|---|---|
| GET | `/` | Testa o servidor |
| GET | `/teste` | Testa a API |
| POST | `/produtos` | Cadastra produto |
| GET | `/produtos` | Lista produtos |
| GET | `/produtos/:id` | Busca produto por ID |
| PUT | `/produtos/:id` | Atualiza produto |
| DELETE | `/produtos/:id` | Exclui produto |
| GET | `/produtos/baixo-estoque` | Lista produtos no/abaixo do limite |
| POST | `/movimentacoes` | Registra entrada ou saída |
| GET | `/movimentacoes` | Lista movimentações |
| GET | `/movimentacoes/produto/:produtoId` | Histórico de um produto |

## Cadastrar produto

`POST /produtos`

```json
{
  "nome": "Teclado",
  "quantidade": 10,
  "limiteMinimo": 3
}
```

## Entrada de estoque

`POST /movimentacoes`

```json
{
  "produtoId": 1,
  "tipo": "ENTRADA",
  "quantidade": 5
}
```

## Saída de estoque

```json
{
  "produtoId": 1,
  "tipo": "SAIDA",
  "quantidade": 2
}
```

A movimentação usa uma transação do Prisma: a atualização do estoque e o registro do histórico são confirmados juntos. Saída maior que o estoque retorna erro `Estoque insuficiente`.

## Prisma Studio

```bash
npx prisma studio
```
#"# EstoqueAPIJS" 
"# EstoqueAPIJS" 
"# EstoqueAPIJS1" 
"# EstoqueAPIJS1" 
"# EstoqueAPIPROVA" 
"# EstoqueAPIPROVA" 

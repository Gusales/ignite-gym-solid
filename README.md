# IGNITE GYMPASS API
Servidor HTTP desenvolvido com NodeJs durante a trilha Ignite(API Node.js com SOLID) da Rocketseat.

## Rodando o servidor
Para poder rodar o servidor, é necessário possuir o [node]('https://nodejs.org/en') e o [docker]('https://www.docker.com/') instalados em seu sistema

### Banco de Dados
A aplicação foi desenvolvida utilizando banco de dados PostgreSQL. <br />
Utilize o comando abaixo para realizar a instalação do container Docker contendo a imagem da Bitname do PostgreSQL.
```bash
docker compose up -d
```

### Rodando o servidor HTTP
Utilizando o npm (<i>Node Package Manager</i>), instale todas as dependências da aplicação.

```bash
npm install
```

Depois de instalar as dependências, crie as tabelas no banco de dados e realize as migrations utilizando o Prisma, digitando o seguinte comando:
```bash
npx prisma migrate dev
```

Agora, a aplicação estará pronta para uso, digitando o comando:
```bash
npm start:dev
```

### Utilizando as variáveis de ambiente
O servidor utiliza de variáveis de ambiente para realizar a conexão com o banco de dados. <br >
Você poderá utilizar suas próprias variáveis definindo as variáveis de ambiente a seguir:

```
# CHECK IF APP IS NOW DEVELOPING 
NODE_ENV=""

# DATABASE ENV
DATABASE_URL=""
```

Realize uma cópia do arquivo <i>.env.example</i>, renomeando-o para apenas <i>.env</i>

## Stack Utilizada

- NodeJs
- Typescript
- Prisma ORM
- PostgreSQL
- Zod
- BcryptJs
- Vitest (Testes)

## Links

- <a href="https://www.notion.so/RoadMap-Ignite-Gympass-API-c1b83f62f37a4d3faefae6f20531a8d8?pvs=4">Requisitos funcionais e regras de negócio</a>

- <a href="https://app.rocketseat.com.br">Rocketseat Ignite</a>
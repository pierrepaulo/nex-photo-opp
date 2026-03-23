# Photo Opp

Aplicação web para **ativação em estande de evento**: o promotor conduz um fluxo rápido de captura com a câmera, revisão com moldura da marca e entrega da foto por **QR Code**. Há também um **painel administrativo** com listagem de fotos, filtros, totais e exportação de logs.

## Stack tecnológica

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, React Router |
| Backend | Node.js, Express 5, TypeScript, Prisma, PostgreSQL |
| Imagem | Canvas (cliente), Sharp (servidor) |
| Armazenamento | Disco local (`STORAGE_PROVIDER=local`) ou Firebase Storage (`STORAGE_PROVIDER=firebase`) |
| Deploy (alvo) | Frontend em Vercel; API + PostgreSQL em Railway |

## Estrutura do projeto

```text
/
├── AGENTS.md                 # Contexto e regras do projeto
├── .docs/                    # Planos de desenvolvimento
├── docker-compose.yml        # PostgreSQL local
├── .env.example              # Modelo de variáveis (copiar para server/.env)
├── client/                   # SPA React (Vite)
│   └── src/
│       ├── components/       # UI compartilhada
│       ├── features/         # auth, activation, admin, download
│       └── services/
└── server/                   # API Express (Clean Architecture)
    ├── prisma/               # schema, migrations, seed
    └── src/
        ├── application/      # casos de uso, DTOs
        ├── domain/
        ├── infrastructure/   # Prisma, storage, Sharp, JWT, etc.
        └── presentation/     # rotas, controllers, middlewares
```

## Pré-requisitos

- **Node.js** 20 LTS ou superior (recomendado)
- **Docker** e Docker Compose (para subir o PostgreSQL local)
- **Conta Firebase** apenas se for usar `STORAGE_PROVIDER=firebase` (produção ou testes com bucket real)

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd <pasta-do-repositorio>
```

### 2. Configurar variáveis de ambiente

Copie o modelo e ajuste conforme necessário (na raiz do repositório):

```bash
cp .env.example server/.env
```

No PowerShell do Windows, equivalente: `Copy-Item .env.example server/.env`.

O backend carrega o `.env` a partir do diretório de trabalho ao executar os comandos **dentro de `server/`** (por exemplo `npm run dev`).

### 3. Armazenamento: local ou Firebase

- **Padrão no código:** `STORAGE_PROVIDER=local` (ou omita a variável). As fotos ficam em disco no servidor; **não é obrigatório** configurar Firebase para desenvolvimento básico.
- **Firebase:** defina `STORAGE_PROVIDER=firebase` e preencha `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_STORAGE_BUCKET` (conta de serviço com acesso ao Storage; chave privada com `\n` escapados como em `.env.example`).

### 4. Subir o PostgreSQL

Na raiz do repositório:

```bash
docker compose up -d
```

Credenciais padrão do compose: usuário `photoopp`, senha `photoopp`, banco `photoopp`, porta `5432`. O `DATABASE_URL` de `.env.example` já aponta para esse banco.

### 5. Backend: dependências, migrações e seed

```bash
cd server
npm install
npx prisma migrate dev
npx prisma db seed
```

Equivalente com scripts do `package.json`:

```bash
npm run db:migrate
npm run db:seed
```

### 6. Frontend: dependências

```bash
cd ../client
npm install
```

### 7. Subir API e cliente em desenvolvimento

Em **dois terminais** (a partir da raiz do repositório):

```bash
cd server && npm run dev
```

```bash
cd client && npm run dev
```

- **App:** [http://localhost:5173](http://localhost:5173)  
- **API:** [http://localhost:3333](http://localhost:3333) (proxy do Vite encaminha `/api` para essa porta — ver `client/vite.config.ts`)

### Verificação antes de PR

Conforme `AGENTS.md`, nos pacotes alterados:

```bash
cd server && npm run build && npm run lint
cd client && npm run build && npm run lint
```

## Variáveis de ambiente (servidor)

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (ex.: usuário/senha do `docker-compose`) |
| `JWT_SECRET` | Segredo para assinatura do JWT |
| `JWT_EXPIRES_IN` | Expiração do token (ex.: `8h`) |
| `PORT` | Porta da API (padrão `3333`) |
| `CLIENT_URL` | Origem do frontend para CORS (ex.: `http://localhost:5173`) |
| `STORAGE_PROVIDER` | `local` (padrão) ou `firebase` |
| `FIREBASE_*` | Obrigatórias se `STORAGE_PROVIDER=firebase` |
| `CORS_EXTRA_ORIGINS` | Opcional: origens extras separadas por vírgula (ex.: IP da máquina na LAN para testar no celular) |
| `SERVER_PUBLIC_URL` | Opcional: URL pública da API para links de arquivos servidos localmente; útil quando o cliente não é `localhost` |

Comentários em `.env.example` lembram limitações de **câmera em HTTPS** em alguns celulares ao acessar por IP local; túneis (ex.: ngrok) ou HTTPS local podem ser necessários.

## Credenciais de teste (apenas desenvolvimento)

Criadas pelo seed do Prisma (`server/prisma/seed.ts`):

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | `admin@photoopp.com` | `admin123` |
| Promotor | `promotor@photoopp.com` | `promotor123` |

**Não use essas credenciais em produção.**

## Deploy

- **Frontend (Vercel):** configure o build a partir de `client/` e variáveis públicas se existirem.
- **Backend (Railway):** configure `DATABASE_URL`, segredos JWT, `CLIENT_URL` da origem do frontend e, se aplicável, Firebase.
- **Links públicos:** adicione aqui as URLs reais quando o deploy estiver disponível (ex.: `https://...`).

## Decisões técnicas relevantes

- **Backend em camadas** (domínio, aplicação, infraestrutura, apresentação) para separar regras de negócio de HTTP e persistência.
- **Frontend por features** (`auth`, `activation`, `admin`, `download`) para manter o fluxo da ativação isolado do painel admin.
- **Foto do usuário:** não é redimensionada nem distorcida; a **moldura** é aplicada pelo servidor (Sharp) sobre a imagem original preservada.
- **RBAC:** `PROMOTER` acessa a ativação; `ADMIN` acessa o painel administrativo.
- **Logs (bônus):** registro de requisições com corpo sanitizado (sem senha), IP mascarado, exportação CSV no admin.
- **Storage:** modo local simplifica o setup; Firebase alinha o ambiente ao deploy com bucket na nuvem.

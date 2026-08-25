# syntax=docker/dockerfile:1

# =========================================================
# 1. BUILD DO FRONTEND
# =========================================================

FROM node:24-alpine AS frontend-build

WORKDIR /build/frontend

# Copiamos primeiro os arquivos de dependências
# para aproveitar o cache do Docker.
COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

# Agora copiamos o código.
COPY frontend/ ./

# Gera /build/frontend/dist
RUN npm run build


# =========================================================
# 2. BUILD DO BACKEND
# =========================================================

FROM node:24-alpine AS backend-build

WORKDIR /build/backend

COPY backend/package.json backend/package-lock.json ./

RUN npm ci

COPY backend/ ./

# Compila TypeScript -> JavaScript
RUN npm run build

# Depois do build removemos dependências usadas apenas
# durante desenvolvimento/compilação.
RUN npm prune --omit=dev


# =========================================================
# 3. IMAGEM FINAL DE PRODUÇÃO
# =========================================================

FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Package metadata do backend
COPY --from=backend-build \
     --chown=node:node \
     /build/backend/package.json \
     ./package.json

# Apenas dependências necessárias em produção
COPY --from=backend-build \
     --chown=node:node \
     /build/backend/node_modules \
     ./node_modules

# Backend já compilado
COPY --from=backend-build \
     --chown=node:node \
     /build/backend/dist \
     ./dist

# Frontend React já compilado
COPY --from=frontend-build \
     --chown=node:node \
     /build/frontend/dist \
     ./public

# A aplicação não precisa rodar como root.
USER node

EXPOSE 3000

# Validação interna do container.
#
# Não instalamos curl apenas para healthcheck:
# usamos o fetch nativo do Node.
HEALTHCHECK \
  --interval=30s \
  --timeout=3s \
  --start-period=10s \
  --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", "dist/server.js"]
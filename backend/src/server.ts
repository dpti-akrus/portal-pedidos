import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';

const app = Fastify({
  logger: true
});

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';

const publicDirectory = path.join(process.cwd(), 'public');

/*
 * Healthcheck
 *
 * Será utilizado posteriormente pelo Docker Compose
 * e pelo GitHub Actions para validar o deploy.
 */
app.get('/api/health', async () => {
  return {
    status: 'ok'
  };
});

/*
 * Outras rotas da API entrarão aqui.
 *
 * Exemplo:
 *
 * app.register(clientesRoutes, {
 *   prefix: '/api/clientes'
 * });
 */

/*
 * React build
 *
 * Dentro da imagem Docker o frontend compilado
 * ficará em /app/public.
 */
await app.register(fastifyStatic, {
  root: publicDirectory,
  prefix: '/'
});

/*
 * Fallback para SPA.
 *
 * Permite acessar diretamente URLs como:
 *
 * /pedidos
 * /clientes
 * /estoque
 *
 * e deixar o React Router resolver a página.
 */
app.setNotFoundHandler(async (request, reply) => {
  if (request.url.startsWith('/api/')) {
    return reply.code(404).send({
      error: 'Not Found',
      message: 'Rota da API não encontrada'
    });
  }

  if (request.method !== 'GET') {
    return reply.code(404).send({
      error: 'Not Found'
    });
  }

  const acceptsHtml = request.headers.accept?.includes('text/html');

  if (!acceptsHtml) {
    return reply.code(404).send({
      error: 'Not Found'
    });
  }

  return reply
    .type('text/html')
    .sendFile('index.html');
});

const start = async () => {
  try {
    await app.listen({
      port: PORT,
      host: HOST
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

await start();
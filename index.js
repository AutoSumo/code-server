const Koa = require('koa');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const koaRespond = require('koa-respond');
const Router = require('koa-router');
const sanitize = require('sanitize-filename');
const fs = require('fs').promises;

const app = new Koa();

app.use(logger());
app.use(koaBody());
app.use(koaRespond());

const router = new Router();

router.post('/:id', async (ctx, next) =>
{
    const data = ctx.request.body;
    const id = sanitize(ctx.params['id']);

    await fs.writeFile(`./code/${id}.js`, data);

    ctx.ok();
    next();
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(process.env['PORT']) || 5289;
app.listen(port);
console.log(`Started listening on ${port}!`);


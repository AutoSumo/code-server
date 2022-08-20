const Koa = require('koa');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const koaRespond = require('koa-respond');
const Router = require('koa-router');
const cors = require('@koa/cors');
const sanitize = require('sanitize-filename');
const websockify = require('koa-websocket');
const fs = require('fs').promises;
require('dotenv').config();

const app = websockify(new Koa());
const robotServerID = process.env['ROBOT_SERVER_ID'];


let clients = [];
app.ws.use((ctx, next) =>
{
    ctx.websocket.once('message', message =>
    {
        try
        {
            const data = JSON.parse(message.toString());
            if(data.type === 'register' && !!data.id)
            {
                console.log(`${data.id} vs ${robotServerID}`);
                if(data.id === robotServerID)
                {
                    ctx.websocket.on('message', message =>
                    {
                        const data = JSON.parse(message.toString());
                        if(data.type === 'highlight')
                        {
                            const codeID = data.codeID;
                            for(const client of clients)
                            {
                                if(client.id === codeID)
                                {
                                    client.ws.send(JSON.stringify({
                                        type: 'highlight',
                                        statement: data.statement
                                    }));
                                }
                            }
                        }
                    });
                }
                else
                {
                    clients.push({id: data.id, ws: ctx.websocket});
                }
            }
            else
            {
                ctx.websocket.close();
            }
        }
        catch(e)
        {
            ctx.websocket.close();
        }
    });

    ctx.websocket.on('close', () =>
    {
        clients = clients.filter(c => c.ws !== ctx.websocket);
    });
});

app.use(logger());
app.use(koaBody());
app.use(koaRespond());
app.use(cors());

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


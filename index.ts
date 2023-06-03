import { Application } from "$oak"
import routerUse from './api/router/index.ts'

const port = 8000
const app = new Application()

routerUse(app)

// 前端页面
app.use(async (ctx) => {
  await ctx.send({
    root: `${Deno.cwd()}/mz-deno-fronted/dist/`,
    index: 'index.html'
  })
});

console.log('service run at： http://localhost:8000');
await app.listen({ port })
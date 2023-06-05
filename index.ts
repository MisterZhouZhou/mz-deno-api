import { Application } from "$oak"
import initRouter from './api/router/index.ts'

const port = 8000
const app = new Application()

// 初始化路由
initRouter(app)

// 前端页面
app.use(async (ctx) => {
  await ctx.send({
    root: `${Deno.cwd()}/mz-deno-fronted/dist`,
    index: 'index.html'
  })
});

console.log('service run at： http://localhost:8000');
await app.listen({ port })
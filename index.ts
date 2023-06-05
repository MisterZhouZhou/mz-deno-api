import { Application } from "$oak"
import initRouter from './api/router/index.ts'
import notFound from './api/middlewares/404.ts'

const port = 8000
const app = new Application()

// 初始化路由
initRouter(app)

// 404
app.use(notFound)

console.log('service run at： http://localhost:8000');
await app.listen({ port })
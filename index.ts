import { Session } from '$oakSession';
import { Application } from "$oak"
import initRouter from './api/router/index.ts'
import DenoAPIMiddleWares from './api/middlewares/index.ts'
import { AppState } from "./api/types/app.ts";

const port = 8000
const app = new Application<AppState>()
// session
// @ts-ignore session
app.use(Session.initMiddleware())

// 初始化路由
initRouter(app)

// 404
app.use(DenoAPIMiddleWares.notFound())

console.log('service run at： http://localhost:8000');
await app.listen({ port })
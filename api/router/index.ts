import { Application } from '$oak';
import { Router } from "$oak"
import apiRouter from './apiRouter.ts'
import socket from '../controllers/socket.ts'

// global
const router = new Router()
// socket聊天
router.get('/ws', socket)
router.get('/hello', (ctx) => {
  ctx.response.body = 'hello11'
})

function use(app: Application) {
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.use(apiRouter.routes())
  app.use(apiRouter.allowedMethods())
}

export default use
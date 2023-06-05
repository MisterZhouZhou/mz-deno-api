import { Application, Router } from '$oak';
import apiRouter from './apiRouter.ts'
import protectedRouter from './protectedRouter.ts'
import socket from '../controllers/socket.ts'
import authorization from '../middlewares/authorization.ts'
import loginController from '../controllers/login.ts';

// global
const router = new Router()

// socket聊天
router.get('/ws', socket)
// login
router.post('/login', loginController.login)

function use(app: Application) {
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.use(apiRouter.routes())
  app.use(apiRouter.allowedMethods())
  // 授权中间件
  app.use(authorization.auth)
  app.use(protectedRouter.routes())
  app.use(protectedRouter.allowedMethods())
}

export default use
import { Application } from '$oak';
import globalRouter from './globalRouter.ts'
import apiRouter from './apiRouter.ts'
import protectedRouter from './protectedRouter.ts'
import DenoAPIMiddleWares from '../middlewares/index.ts'
import { AppState } from "../types/app.ts";

function use(app: Application<AppState>) {
  // global
  app.use(globalRouter.routes())
  app.use(globalRouter.allowedMethods())
  // public
  app.use(apiRouter.routes())
  app.use(apiRouter.allowedMethods())
  // 授权中间件
  app.use(DenoAPIMiddleWares.auth())
  app.use(protectedRouter.routes())
  app.use(protectedRouter.allowedMethods())
}

export default use
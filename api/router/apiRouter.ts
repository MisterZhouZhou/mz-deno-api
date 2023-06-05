import { Router } from "$oak"
import CaptchaController from '../controllers/captcha.ts'
import { AppState } from "../types/app.ts";

// 使用session
const apiRouter = new Router<AppState>({
  prefix: '/api'
})
apiRouter.get('/hello', (ctx) => {
  ctx.response.body = 'api hello'
})

// 图形验证码
apiRouter.get('/captcha', CaptchaController.create)
apiRouter.post('/verify', CaptchaController.verify)

export default apiRouter

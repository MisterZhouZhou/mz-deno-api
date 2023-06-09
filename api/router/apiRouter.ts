import { Router } from "$oak"
import CaptchaController from '../controllers/CaptchaController.ts'
import PlaceholderController from '../controllers/PlaceholderController.ts'
import QrcodeController from "../controllers/QrcodeController.ts";
import ScreenShootController from "../controllers/ScreenShootController.ts";
import ShortLinkController from "../controllers/ShortLinkController.ts";
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

// 生成占位图
apiRouter.get("/placeholder/:size", PlaceholderController.create)

// 短链生成器
apiRouter.get("/short", ShortLinkController.create)
apiRouter.get("/short/:url", ShortLinkController.getUrl)

// 生成二维码
/// 生成二维码base64格式
apiRouter.get('/qrcode', QrcodeController.generate)
/// 生成二维码html格式
apiRouter.get('/qrcode/show', QrcodeController.showQrcode)

// 网页截图 不同尺寸，不同类型
apiRouter.get('/screenShoot', ScreenShootController.screenShoot)

export default apiRouter

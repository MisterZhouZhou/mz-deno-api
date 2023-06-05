// 授权中间件
import { Context, Next } from '$oak';
import { tokenHelper, response } from '../utils/index.ts';

export default {
  async auth(ctx: Context, next: Next) {
    // 从headers中获取authorization token
    const authorization = await ctx.request.headers.get('Authorization')
    if (!authorization) {
      ctx.response.body = response(403)
      return
    }
    const token = authorization.replace('Bearer ', '')
    // 验证token
    if (!await tokenHelper.verify(token)) {
      ctx.response.body = response(403, null, '未授权，请重新登陆')
      return
    }
    await next()
  }
}
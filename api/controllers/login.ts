import { Context } from '$oak';
import { hash, response, tokenHelper } from '../utils/index.ts';

// 登录控制器
export default {
  async login(ctx: Context) {
    const { value } = await ctx.request.body({ type: 'json'})
    const { name, password } = await value
    const pwd = await hash.create(password)
    if (!await hash.compare(pwd, '123456')) {
      ctx.response.body = response(401, null, '用户信息错误')
      return
    }
    // 生成token
    const token = await tokenHelper.generate({
      name,
      password: pwd,
    })

    ctx.response.body = response(200, {
      name,
      token
    })
  }
}

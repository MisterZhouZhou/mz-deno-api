import { Context } from '$oak';

export default (ctx: Context) => {
  ctx.response.body = 'not found'
}
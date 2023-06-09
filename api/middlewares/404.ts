import { Context } from '$oak';

export function notFound() {
  return (ctx: Context) => {
    ctx.response.body = 'not found'
  }
}

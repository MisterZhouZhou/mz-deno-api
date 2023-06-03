import { Router } from "$oak"

const apiRouter = new Router({
  prefix: '/api'
})
apiRouter.get('/hello', (ctx) => {
  ctx.response.body = 'api hello'
})

export default apiRouter

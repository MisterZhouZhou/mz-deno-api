// 需要登录授权的api
import { Router } from "$oak"
import { list, getPersonForId, addPerson } from '../controllers/person.ts'

const protectedRouter = new Router({
  prefix: '/api'
})
protectedRouter.get('/hello1', (ctx) => {
  ctx.response.body = 'api hello'
})

// person
protectedRouter.get('/person', list)
protectedRouter.get('/person/:id', getPersonForId)
protectedRouter.post('/person', addPerson)

export default protectedRouter

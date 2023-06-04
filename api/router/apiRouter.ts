import { Router } from "$oak"
import { list, getPersonForId, addPerson } from '../controllers/person.ts'

const apiRouter = new Router({
  prefix: '/api'
})
apiRouter.get('/hello', (ctx) => {
  ctx.response.body = 'api hello'
})

// person
apiRouter.get('/person', list)
apiRouter.get('/person/:id', getPersonForId)
apiRouter.post('/person', addPerson)

export default apiRouter

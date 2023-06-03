import { Router } from "$oak"
import socket from '../controllers/socket.ts'

const router = new Router()

router.get('/ws', socket)
router.get('/hello', (ctx) => {
  ctx.response.body = 'hello'
})

export default router
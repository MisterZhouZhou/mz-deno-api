import { Router } from '$oak';
import socket from '../controllers/socket.ts'
import loginController from '../controllers/LoginController.ts';
import UploadController from '../controllers/UploadController.ts';
// import DenoAPIMiddleWares from '../middlewares/index.ts'
import { upload } from '$mOakUpload'

// global
const router = new Router()

// socket聊天
router.get('/ws', socket)
// login
router.post('/login', loginController.login)

// uploads资源访问
/// 上传文件
router.post('/upload', upload("uploads") , UploadController.upload)
/// 文件访问
router.get('/uploads/:file', UploadController.getUploadsFile)
/// 文件下载
router.get('/downloads/:file', UploadController.uploadDownloadFile)

export default router
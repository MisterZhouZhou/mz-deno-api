// 文件上传控制器
import { Context } from '$oak';
import { response } from './../utils/response.ts';
import { IFile } from './../middlewares/upload.ts';

/**
 * 文件上传， POST /api/upload
 * @param ctx 
 * @returns 
 */
const upload = (ctx: any) => {
  const retArr:Omit<IFile, 'originalName'|'tmpUrl'|'path'>[] = []
  const { files, errors } = ctx.uploads
  // 处理错误
  if (errors) {
    ctx.response.body = response(400, errors)
    return
  }
  // 没有错误
  if (files) {
    const uploadFilesList = files as IFile[]
    for (const uploadFile of uploadFilesList) {
      retArr.push({
        fileName: uploadFile.fileName,
        name: uploadFile.name,
        ext: uploadFile.ext,
        size: uploadFile.size,
        url: uploadFile.url
      })
    }
  }
  ctx.response.body = response(200, retArr)
}

/**
 * 访问上传的文件资源， GEt /upload/:file
 * @param ctx 
 * @returns 
 */
const getUploadsFile = async(ctx: Context) => {
  // @ts-ignore params
  const { file } = ctx.params
  if (!file) {
    ctx.throw(404, 'file not found')
  }
  // 判断文件是否存在
  try {
    await Deno.stat(`${Deno.cwd()}/uploads/${file}`);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.log("文件不存在");
    } else {
      console.error(error);
    }
    ctx.throw(404, 'file not found')
  }
  // 发送文件
  await ctx.send({
    root: `${Deno.cwd()}/uploads`,
    path: file,
  })
}

/**
 * 上传文件资源下载， GEt /upload/:file
 * @param ctx 
 * @returns 
 */
const uploadDownloadFile = async (ctx: Context) => {
  // @ts-ignore params
  const { file } = ctx.params
  if (!file) {
    ctx.throw(404, 'file not found')
  }
  // 打开文件
  const filePath = `${Deno.cwd()}/uploads/${file}`
  const fileStream = await Deno.open(filePath)
  // 设置响应头，让浏览器生成下载链接
  ctx.response.headers.set("Content-Disposition", `attachment; filename="${file}"`);
  ctx.response.body = fileStream;
  // console.log(`文件 ${file} 已经成功下载`);
  // 不用做文件资源关闭了，会报错
}

export default {
  upload,
  getUploadsFile,
  uploadDownloadFile
}

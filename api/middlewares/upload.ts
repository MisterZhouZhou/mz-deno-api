// 文件上传中间件
import { FormDataFile, Context } from '$oak'
import { join } from '$std/path/mod.ts';
import { ensureDirSync, moveSync } from '$std/fs/mod.ts';

export interface IFile {
  originalName: string // 文件上传时的原始名称
  name: string // 文件名
  ext: string // 文件扩展名
  fileName: string // 新文件名称
  size: number // 文件大小
  tmpUrl: string|undefined // 文件临时路径
  url: string // 文件url，服务路径
  path: string // 文件所在物理路径
}

export interface IOptions {
  // max_file?: number,
  // files?: string[],
  // extensions?: string[],
  // max_file_size?: number,
  randomName: boolean // 开启随机文件名
  // datetime_subdir?: boolean,
  // move?: boolean,
  // errors?: {
  //     max_file?: string,
  //     extension?: string,
  //     size?: string
  // }
}

export function upload(path='uploads', options:IOptions={ randomName: true }) {
  return async(ctx: any, next: CallableFunction) => {
    // 从请求头中匹配文件数据
    const boundaryRegex = /^multipart\/form-data;\sboundary=(?<boundary>.*)$/;
    // 请求头
    const contentType = ctx.request.headers.get('content-type')
    if (!contentType || !contentType.match(boundaryRegex)) {
      ctx.throw(
        422,
        '请求类型错误，请确认请求类型为multipart\/form-data',
      );
    }
    // 从body value中读取表单数据
    const body = await ctx.request.body({ type: "form-data" });
    const formData = await body.value.read();
    if (!formData.files) {
      console.warn('当前请求未上传任何文件');
      await next()
      return
    }
    // 结果文件列表
    const retFileList: IFile[] = []
    const fileList: FormDataFile[] = formData.files
    // 上传文件的路径
    const uploadPath = `${Deno.cwd()}/${path}`
    if (uploadPath) {
      // 同步创建目录
      ensureDirSync(uploadPath);
    }
    for (const file of fileList) {
      // 获取临时文件的文件状态
      const stat = await Deno.stat(file.filename as string)
      // 获取文件名称及扩展
      const [name, ext] = file.originalName.split('.')
      let newFileName = name
       // 随机文件名
       if (options.randomName) {
        newFileName = `${crypto.randomUUID() }-${name}`
      }
      // 带后缀的文件名
      const newFileFullName = `${newFileName}.${ext.toLowerCase()}`
      // 构建文件对象
      const fileObj: IFile = {
        originalName: file.originalName,
        name: newFileName,
        ext: ext.toLowerCase(),
        fileName: newFileFullName,
        size: stat.size / 1048576,
        tmpUrl: file.filename,
        path: join(uploadPath, newFileFullName),
        url: `${path}/${newFileFullName}`
      }
      // 缓存文件存在会同步到上传目录
      if (fileObj.tmpUrl) {
        moveSync(fileObj.tmpUrl, fileObj.path);
      }
      retFileList.push(fileObj)
    }
    ctx['uploadFiles'] = retFileList
    await next()
  }
}
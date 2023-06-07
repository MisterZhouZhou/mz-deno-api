// 生成二维码服务
import { Context } from '$oak';
import { qrcode } from "$qrcode";

/**
 * 生成二维码 base64格式 
 * get /api/qrcode
 * 
 * @example 
 * /api/qrcode/show?data=123
 * /api/qrcode/show?data=http://www.baidu.com
 * /api/qrcode/show?data=123&size=100
 * 
 * @param {Context} ctx 网络上下文
 * @returns 
 */
const generate = async(ctx: Context) => {
  const data = ctx.request.url.searchParams.get("data");
  const size = ctx.request.url.searchParams.get("size") || 200;
  if (!data) {
    ctx.throw(400, "Invalid params, the data can't be empty")
  }
  if (!size || !Number.isFinite(+size)) {
    ctx.throw(400, "Invalid params, the size can't be empty")
  }
  // 生成二维码
  const qrData = await qrcode(data, {
    size: +size,
  });
  ctx.response.headers.set('Content-Type', 'image/png')
  ctx.response.body = qrData
}

/**
 * 生成二维码html,在浏览器中直接查看 
 * get /api/qrcode/show
 * 
 * @example 
 * /api/qrcode/show?data=123
 * /api/qrcode/show?data=http://www.baidu.com
 * /api/qrcode/show?data=123&size=300
 * 
 * @param {Context} ctx 网络上下文
 * @returns 
 */
const showQrcode = async(ctx: Context) => {
  const data = ctx.request.url.searchParams.get("data");
  const size = ctx.request.url.searchParams.get("size") || 200;
  if (!data) {
    ctx.throw(400, "Invalid params, the data can't be empty")
  }
  if (!size || !Number.isFinite(+size)) {
    ctx.throw(400, "Invalid params, the size can't be empty")
  }
  // 生成二维码
  const qrData = await qrcode(data, {
    size: +size,
  });
  ctx.response.headers.set('Content-Type', 'text/html')
  ctx.response.body = `<img src="${qrData}" />`
}

export default {
  generate,
  showQrcode
}
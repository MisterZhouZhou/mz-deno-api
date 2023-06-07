// 占位图生成控制器
import { Context } from '$oak';
import { createCanvas } from "$canvas";

/**
 * 占位图 get api/placeholder/50x50
 * @example 其他类似的网站
 * https://via.placeholder.com/50x50
 * 
 * @param {Context} ctx 网络上下文
 * @returns 
 */
const create = (ctx: Context) => {
  // @ts-ignore params
  const size = ctx.params.size || "50x50" // 如果未提供尺寸，则默认为 50x50
  const [width, height] = size.split("x").map(Number); // 解析宽度和高度参数
  // 检查width和height是否合法
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return ctx.throw(400, "Invalid image size") // 若提供的尺寸无效，则返回 400 Bad Request 错误
  }
  const canvas = createCanvas(width, height); // 创建 Canvas 实例
  const context = canvas.getContext("2d")
  // 填充矩形背景色
  context.fillStyle = "#ccc"
  context.fillRect(0, 0, width, height)
  // 绘制文本提示
  context.fillStyle = "#aaa"
  context.font = `${Math.min(width, height) / 8}px sans-serif`
  context.textAlign = "center"
  context.textBaseline = "middle"
  // 占位图文本内容
  const fontText = `${width} x ${height}`
  // 计算文本的宽度
  const fontWith = context.measureText(fontText).width;
  // 计算文本的高度
  const fontHeight = parseInt(context.font, 10)
  context.fillText(fontText, Math.abs(width-fontWith)/2, (height+fontHeight) / 2)

  // 将 Canvas 转换为 PNG 图像，并将其作为响应返回
  const buf = canvas.toBuffer()
  ctx.response.headers.set("content-type", "image/png")
  ctx.response.body = buf
}

export default {
  create
}

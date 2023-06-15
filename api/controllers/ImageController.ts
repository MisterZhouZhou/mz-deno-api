// 图片处理控制器
import { Context } from '$oak';
import { response } from '../utils/index.ts';
import { resize } from "$image";

class ImageController {
  /**
   * 调整图片大小输出image/png， GET /api/image/resize
   * @param ctx 
   * @returns 
   */
  async resize(ctx: Context) {
    // 这里参数解析后都为字符串
    const { url, auto, size } = ctx['getParams'];
    const imageSize = size || "100x100" // 如果未提供尺寸，则默认为 100x100
    const [width, height] = imageSize.split("x").map(Number); // 解析宽度和高度参数
    const imageAspectRatio = auto || 'true'
    // 检查width和height是否合法
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      return ctx.throw(400, "Invalid image size") // 若提供的尺寸无效，则返回 400 Bad Request 错误
    }
    // 读取在线图片
    const imageRes = await fetch(url);
    if (!imageRes.ok) {
      ctx.response.body = response(500, null, '图片获取失败')
      return ctx.throw(500, `Failed to fetch image, status code: ${imageRes.status}`)
    }
    const imageBytes = await imageRes.arrayBuffer();
    // 对图片大小进行调整， aspectRatio默认为true大小自动跳转，为false按自定义大小调整
    const img = await resize(new Uint8Array(imageBytes), {
      width: +width,
      height: +height,
      aspectRatio: JSON.parse(imageAspectRatio.toLowerCase())
    });
    ctx.response.headers.set("content-type", "image/png")
    ctx.response.body = img
  }
}

export default new ImageController()

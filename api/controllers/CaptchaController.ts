// 图形验证码
import { Context } from '$oak';
import { response, randomCode } from '../utils/index.ts';
import { createCanvas, EmulatedCanvas2D } from "$canvas";

/**
 * 基于数字生成canvas
 * @example
 * generateCanvas(1234)
 * @param {number} captcha The number used to generate the captcha.
 * @returns {EmulatedCanvas2D} The generated canvas object.
 */
function generateCanvas(captcha: number): EmulatedCanvas2D {
  const fontWith = 22
  const fontHeight = 30
  const canvasWidth = fontWith * captcha.toString().length + 72
  const canvasHeight = fontHeight + 50
  const marginLeft = (canvasWidth - fontWith * captcha.toString().length) / 2
  const marginTop = (canvasHeight + fontHeight) / 2
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const canvasCtx = canvas.getContext("2d");
  // 绘制背景色
  canvasCtx.fillStyle = "#ffffff";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  // 绘制四位数字验证码
  canvasCtx.font = "40px Arial";
  canvasCtx.fillStyle = "#666";
  canvasCtx.fillText(captcha.toString(), marginLeft, marginTop);
  // 画干扰线
  Array.from({length: 4}).forEach(() => {
    canvasCtx.lineWidth = Math.random() * 2;
    canvasCtx.beginPath();
    canvasCtx.lineTo(Math.random() * 30,  Math.random() * canvasHeight);
    canvasCtx.lineTo(Math.random() * 30 + canvasWidth,  Math.random() * canvasHeight);
    canvasCtx.closePath();
    canvasCtx.stroke();
  })
  return canvas
}

/**
 * 生成图形验证码 get /api/captcha
 * 
 * @example 
 * /api/captcha?count=4
 * 
 * @param {Context} ctx 网络上下文
 * @returns 
 */
const create = async(ctx: Context) => {
  const count = ctx.request.url.searchParams.get("count") || 4;
  // 生成随机字符串并转换为图形验证码
  const captcha = randomCode(+count); 
  const canvas: EmulatedCanvas2D = generateCanvas(captcha)
  // 将验证码存储到Session中
  await ctx.state.session.set('captcha', captcha);
  ctx.response.headers = new Headers({
    "content-type": "image/png",
  })
  ctx.response.body =  canvas.toBuffer()
}

/**
 * 验证图形验证码 post /api/verify
 * 
 * @example
 * /api/verify {code: xx}
 * 
 * @param {Context} ctx 网络上下文
 * @returns 
 */
const verify = async(ctx: Context) => {
  // 获取请求的验证码
  if (!ctx.request.hasBody) {
    ctx.response.body = response(400)
    return
  }
  const requestBody = await ctx.request.body()
  const { code } = await requestBody.value
  // 小于4位验证码
  if (code.toString().length !== 4) {
    ctx.response.body = response(400, null, '验证码位数错误')
    return
  }
  // 获取session中的验证码
  const captcha = await ctx.state.session.get('captcha') || ''
  if (+code !== +captcha) {
    ctx.response.body = response(400, null, '验证码错误')
    return
  }
  ctx.response.body = response(200)
}

// 图形验证码控制器
export default {
  create,
  verify
}

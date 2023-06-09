// 网页截图
import { Context } from '$oak';
import puppeteer, { devices } from '$puppeteer';
import { isValidUrl } from '$mUtils';

/**
 * 获取网页截图 GET /api/screenShoot
 * 
 * @example 
 * ```ts
 * /api/screenShoot?device=iphone6&type=png
 * /api/screenShoot?device=iphone6&type=pdf
 * ```
 * 
 * @param ctx 
 * @returns 
 */
const screenShoot = async(ctx: Context) => {
  const queryParams = await ctx.request.url.searchParams
  const pageUrl = queryParams.get('url') || ''
  if (!isValidUrl(pageUrl)) {
    ctx.throw(400, '请输入合法的url')
  }
  // 请求参数
  const device = queryParams.get('device') || 'iPhone 6'
  const type = queryParams.get('type') || 'png'
  const devicePlatform = devices[device];
  // console.log('devicePlatform===', devicePlatform);
  if (!devicePlatform) {
    ctx.throw(400, '请输入合法的device类型')
  }
  // 初始化浏览器
  const browser = await puppeteer.launch();
  // 创建一个页面
  const page = await browser.newPage();
  // 配置设备
  // await page.emulate(devicePlatform);
  // 打开一个页面
  await page.goto(pageUrl, {
    waitUntil: 'networkidle2', // 表示当页面不再有网络请求 500ms 后，视为完成加载
  });
  
  // 将截图结果发送给请求方
  if (type === 'image') {
    // 截图
    const buffer = await page.screenshot({ path: "example.png" });
     // 关闭浏览器
    await browser.close();
  
    ctx.response.headers.set('content-type', 'image/png')
    ctx.response.body = buffer
  } else if (type === 'pdf') {
    // 截图
    const buffer = await page.pdf({ format: 'A4' });
    console.log('buffer==', buffer);
     // 关闭浏览器
    // await browser.close();
  
    ctx.response.headers.set('content-type', 'application/png')
    ctx.response.body = buffer
  }
  
 
}

export default {
  screenShoot
}
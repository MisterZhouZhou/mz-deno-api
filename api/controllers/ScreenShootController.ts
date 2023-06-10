// 网页截图
import { UPLOADS } from './../config/config.ts';
import { response } from './../utils/response.ts';
import { Context } from '$oak';
import puppeteer, { devices } from '$puppeteer';
import { isValidUrl } from '$mUtils';
import { ensureDirSync } from '$std/fs/mod.ts';

const desktopDevice = {
  name: 'Desktop 1920x1080',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 1920,
    height: 1080,
  },
}; 

/**
 * 获取网页截图 GET /api/screenShoot
 * 
 * @example 
 * ```ts
 * /api/screenShoot?device=iPhone 6&type=image
 * /api/screenShoot?url=http://www.baidu.com&device=iPhone 6&type=pdf
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
  const device = queryParams.get('device') || ''
  const type = queryParams.get('type') || 'image'
  const devicePlatform = devices[device] || desktopDevice;
  if (!devicePlatform) {
    ctx.throw(400, '请输入合法的device类型')
  }
  // 同步创建uploads
  ensureDirSync(UPLOADS)
  // 初始化浏览器
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, headless: true });
  // 创建一个页面
  const page = await browser.newPage();
  // 打开一个页面
  await page.goto(pageUrl, {
    waitUntil: 'networkidle2', // 表示当页面不再有网络请求 500ms 后，视为完成加载
    // timeout: 60000,
    // waitUntil: ['load', 'domcontentloaded'],
  });
  // 设置设备类型
  await page.emulate(devicePlatform);
  let fileName;
  // 将截图结果发送给请求方
  if (type === 'image') {
    // 生成文件名称
    fileName = `${crypto.randomUUID()}.png`
    // 截图
    await page.screenshot({ path: `${UPLOADS}/${fileName}` });
   
  } else if (type === 'pdf') {
    // 生成文件名称
    fileName = `${crypto.randomUUID()}.pdf`
    // ???
    await page.emulateMediaType('screen');
    // 生成pdf
    await page.pdf({
      path: `${UPLOADS}/${fileName}`,
      format: "A4", 
      printBackground: true,
      displayHeaderFooter: false
    });
  }
  // 关闭浏览器
  await browser.close();
  ctx.response.body = response(200, { url: `uploads/${fileName}` })
}

export default {
  screenShoot
}
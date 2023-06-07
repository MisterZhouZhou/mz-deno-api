// 短链生成器
import { response } from './../utils/index.ts';
import { Context } from '$oak';
import { nanoid } from '$nanoid'

// 存储生成结果
const links = new Map<string, string>();

/**
 * 生成短链 get /api/short
 * 
 * @example 
 * /api/short?url=http://www.baidu.com
 * 
 * @param {Context} ctx 网络上下文
 * @returns 
 */
const create = (ctx: Context) => {
  const url = ctx.request.url.searchParams.get("url") || '';
  if (!url) {
    ctx.throw(400, 'Invalid params, do you men url?')
    return
  }
  const id = nanoid(8);
  // 保存到内存
  links.set(id, url);
  const shortUrl = `/api/short/${id}`;
  ctx.response.body = response(200, shortUrl);
}

/**
 * 获取短链 get /api/short/:url
 * 
 * @example 
 * /api/short/xxx
 * 
 * @param {Context} ctx 网络上下文
 * @returns 
 */
const getUrl = (ctx: Context) => {
  // @ts-ignore params
  const { url } = ctx.params;
  if (!url) {
    ctx.throw(400, 'Invalid params')
    return
  }
  // 从map中解析url
  const fullUrl = links.get(url)
  if (!fullUrl) {
    ctx.response.body = response(400, null, 'link not found') 
    return
  }
  ctx.response.body = response(200, fullUrl)
}

export default {
  create,
  getUrl
}
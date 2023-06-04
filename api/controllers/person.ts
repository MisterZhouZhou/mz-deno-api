import { Context } from "$oak"
import sqlitDb from '../db/sqlit.ts'
import { response } from '../utils/response.ts'

/**
 * 用户列表
 * @param ctx 网络请求上下文
 */
export const list = (ctx : Context) => {
  const data = []
  for (const [id, name] of sqlitDb.query<[number, string]>('SELECT id, name FROM people')) {
    data.push({ id, name })
  }
  ctx.response.body = response(200, data)
}

/**
 * 根据用户id获取用户信息
 * @param ctx 网络请求上下文
 */
export const getPersonForId = (ctx: Context) => {
  // person id
  // @ts-ignore params.id
  const id = ctx.params.id
  const data = [];
  for (const [_id, name] of sqlitDb.query<[number, string]>('SELECT id, name FROM people WHERE id = ?', [id])) {
    data.push({ id: _id, name })
  }
  if (data.length === 0) {
    ctx.response.body = response(400, null, '用户信息不存在')
    return
  }
  ctx.response.body = response(200, data[0])
}

/**
 * 创建用户记录
 * @param ctx 网络请求上下文
 */
export const addPerson = async(ctx: Context) => {
  // person id
  // @ts-ignore params.id
  const bodyRequest = ctx.request.body({ type: 'json'})
  const bodyRequestParams = await bodyRequest.value
  const { name } = bodyRequestParams
  // 插入一条记录
  sqlitDb.query("INSERT INTO people (name) VALUES (?)", [name])
  // 查询
  const data = [];
  for (const [_id, name] of sqlitDb.query<[number, string]>('SELECT id, name FROM people')) {
    data.push({ id: _id, name })
  }
  if (data.length === 0) {
    ctx.response.body = response(500, null)
    return
  }
  ctx.response.body = response(200, data.pop()!)
}
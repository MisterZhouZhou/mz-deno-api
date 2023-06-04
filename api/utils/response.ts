export const errorCode: Record<number, string> = {
  300: '鉴权失败',
  400: '请求错误',
  500: '服务器内部错误',
}

/**
 * 返回网络请求响应对象
 * @param code 状态码
 * @param data 响应数据
 * @param msg 响应消息描述
 * @returns 
 */
export const response = (code: number, data: Record<string, unknown>|Record<string, unknown>[]|null, msg='') => {
  const errMsg = msg ? msg : (errorCode[code] || '' )
  return {
    code,
    data,
    msg: errMsg
  }
}
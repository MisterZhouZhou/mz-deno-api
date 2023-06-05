// token
import { Header, Payload, create, getNumericDate, verify } from "$djwt"

// 秘钥
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const header: Header = { alg: "HS512", typ: "JWT" }

// const payload: Payload = { foo: "bar", exp: getNumericDate(7 * 60 * 60) }

export default {
  // 生成token
  // deno-lint-ignore no-explicit-any
  async generate(obj: Record<string, any>) {
    const payload: Payload = {
      ...Object.assign(obj),
      exp: getNumericDate(7 * 60 * 60)
    }
    return await create(header, payload, key);
  },
  /**
   * 验证token
   * @return 返回是否验证成功
   */
  async verify(token: string): Promise<boolean> {
    try {
      await verify(token, key);
      return true
    } catch (_) {
      return false
    }
  },
  /**
   * 解析token
   * @return 返回payload
   */
  async decode(token: string) {
    return await verify(token, key); 
  }
}
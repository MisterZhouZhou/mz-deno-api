import hash from './hash.ts'
import tokenHelper from './token.ts'
export * from './response.ts'

// 
/**
 * 随机生成四位数字作为验证码
 * @returns 
 */
function randomCode(length=4) {
  let max = 9;
  let min = 1;
  for (let i=1; i< length; i++) {
    min = min * 10
    max = max * 10 + 9
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
  hash,
  tokenHelper,
  randomCode
}
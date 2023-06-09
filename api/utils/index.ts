import hash from './hash.ts'
import tokenHelper from './token.ts'
export * from './response.ts'

/**
 * 获取一个n位数的最小值和最大值
 * @example
 * getMinMaxInt(4)
 * getMinMaxInt(5)
 * @param {number} length 生成数据的长度n
 * @returns {[min, max]} n位数对应的最大值和最小值
 */
function getMinMaxInt(length=4) {
  let max = 9;
  let min = 1;
  for (let i=1; i< length; i++) {
    min = min * 10
    max = max * 10 + 9
  }
  return [min, max]
}


/**
 * 随机生成四位随机整数
 * @example
 * randomCode(4)
 * randomCode(5)
 * @param {number} length 要生成的随机数的长度
 * @returns {num } 随机数
 */
function randomCode(length=4): number {
  const [min, max] = getMinMaxInt(length)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 获取一个指定范围内的随机整数
 * @example
 * getRandomInt(4)
 * getRandomInt(5)
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {num } 随机数
 */
function getRandomInt(min: number, max: number) {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}

export {
  hash,
  tokenHelper,
  getMinMaxInt,
  randomCode,
  getRandomInt
}
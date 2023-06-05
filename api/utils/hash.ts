import  * as bcrypt from "$bcrypt";

export default {
  /**
   * 生成hash
   * @param {string} content 需要hash的内容
   * @return {boolean} 返回hash加密后的值
   */
  async create(content: string) {
    return await bcrypt.hash(content)
  },

  /**
   * 生成hash
   * @param {string} hash 对比的hash值
   * @param {string} content 对比的内容
   * @return {boolean} 返回对比的结果
   */
  async compare(hash: string, content: string): Promise<boolean> {
    return await bcrypt.compare(content, hash)
  }
}

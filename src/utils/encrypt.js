/*
 * @Description: AES加解密
 * @Author: huanglp 
 * @Date: 2019-07-10 12:34:23 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-07-10 13:13:27
 * 
 */
let CryptoJS = require('crypto-js'); // 引入AES源码js
/*
 * 对密码进行加密，传输给后台进行验证
 * @param {String}   word  需要加密的密码
 * @return {String}   加密的密文
 * */
export function encrypt(word) { // 加密
  var key = CryptoJS.enc.Base64.parse('ZGIyMTM5NTYxYzlmZTA2OA==');
  var iv = CryptoJS.enc.Base64.parse('ZGIyMTM5NTYxYzlmZTA2OA==');
  let encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  return encrypted.ciphertext.toString();
}


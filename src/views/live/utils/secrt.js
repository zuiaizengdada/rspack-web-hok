import CryptoJS from 'crypto-js'

// 默认的 KEY 与 iv 如果没有给,可自行设定，但必须16位

const KEY = CryptoJS.enc.Utf8.parse('sdfbJKSDHG6468564_AASSFD')

const IV = CryptoJS.enc.Utf8.parse('SDLdsjg53465SDGS')

/**

 * AES加密 ：字符串 key iv  返回base64

 */

export function Encrypt(word, keyStr, ivStr) {
  let key = KEY

  let iv = IV

  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)

    iv = CryptoJS.enc.Utf8.parse(ivStr)
  }

  const srcs = CryptoJS.enc.Utf8.parse(word)

  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,

    mode: CryptoJS.mode.CBC,

    padding: CryptoJS.pad.ZeroPadding
  })

  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

/**

 1. AES 解密 ：字符串 key iv  返回base64

 2.  3. @return {string}

 */

export function Decrypt(word, keyStr, ivStr) {
  let key = KEY

  let iv = IV

  if (!word) {
    return
  }

  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)

    iv = CryptoJS.enc.Utf8.parse(ivStr)
  }

  const base64 = CryptoJS.enc.Base64.parse(word)

  const src = CryptoJS.enc.Base64.stringify(base64)

  const decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,

    mode: CryptoJS.mode.CBC,

    padding: CryptoJS.pad.ZeroPadding
  })

  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)

  return decryptedStr.toString()
}

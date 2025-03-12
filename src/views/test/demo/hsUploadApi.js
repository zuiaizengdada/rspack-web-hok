import { getHSToken, getUploadConfig } from '@/api/task/index'
import TTUploader from 'tt-uploader'
import eventBus from '@/utils/eventBus'
import store from '@/store'
import SparkMD5 from 'spark-md5'

// 火山配置参数
export const config = {
  userId: '',
  appId: '',
  spaceName: '',
  AccessKeyID: '',
  SecretAccessKey: '',
  SessionToken: '',
  ExpiredTime: '',
  CurrentTime: ''
}

/**
 * 计算md5
 */
export function doIncremental(obj) {
  return new Promise((resolve, reject) => {
    obj.status = 'parsing'
    // 这里需要用到File的slice( )方法，以下是兼容写法
    const blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice
    const chunkSize = 2097152 // 以每片2MB大小来逐次读取
    const chunks = Math.ceil(obj.file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5() // 创建SparkMD5的实例
    const fileReader = new FileReader()
    fileReader.onload = function(e) {
      console.log('Read chunk number (currentChunk + 1) of  chunks ')
      spark.appendBinary(e.target.result) // append array buffer
      currentChunk += 1
      if (currentChunk < chunks) {
        loadNext()
      } else {
        // console.log('Finished loading!')
        const md5 = spark.end()
        if (md5) {
          console.log('结束md5---', new Date())
          console.log('SparkMD5--计算->', md5)
          obj.md5 = md5
          obj.status = 'wait'
          resolve(md5)
        } else {
          console.log('md5校验异常', md5)
          reject('md5校验异常')
        }
        resolve(md5)
      }
    }
    fileReader.onerror = function(err) {
      console.log('something went wrong')
      reject('something went wrong' + err)
    }
    function loadNext() {
      var start = currentChunk * chunkSize
      var end = start + chunkSize >= obj.file.size ? obj.file.size : start + chunkSize
      fileReader.readAsBinaryString(blobSlice.call(obj.file, start, end))
    }
    loadNext()
  })
}

/**
 * 获取火山商户信息
 */
export function initUpload(obj) {
  return new Promise((resolve, reject) => {
    if (config.userId && config.appId && config.spaceName) {
      return resolve()
    } else {
      return getUploadConfig({ tenantId: 1000 }).then(res => {
        console.log(res)
        config.userId = String(res.data.userId)
        config.appId = Number(res.data.appId)
        config.spaceName = String(res.data.spaceName)
        resolve()
      }).catch((err) => {
        if (obj) {
          obj.status = 'fail'
          obj.errorReason = JSON.stringify(err)
          eventBus.$emit('failTaks', [{ ...obj }])
        }
        reject('获取火山Token失败')
      })
    }
  })
}

/**
 * 准备上传
 * @param {object} obj
 */
/**
 * 准备上传
 * @param {object} obj
 */
export function startUpload(obj = {}, completeFn = () => {}, errorFn = () => {}, progressFn = () => {}) {
  return new Promise((resolve, reject) => {
    return getHSToken().then(res => {
      config.AccessKeyID = res.data.accessKeyId
      config.SecretAccessKey = res.data.secretAccessKey
      config.SessionToken = res.data.sessionToken
      config.ExpiredTime = res.data.expiredTime
      config.CurrentTime = res.data.currentTime
      return initUploader(obj, completeFn, errorFn, progressFn)
    }).catch((err) => {
      console.log(err)
      obj.status = 'fail'
      obj.errorReason = err
      reject(err)
    })
  })
}

/**
 * 重新上传
 */
export function againUpload(obj) {
  if (!obj.md5) {
    obj.status = 'parsing-wait'
  } else {
    obj.status = 'wait'
  }
}

/**
 * 暂停上传
 */
export function Pause(obj) {
  obj.uploader.pause(obj.filekey)
  obj.status = 'pause'
}

/**
 * 恢复上传
 */
export function Reload(obj) {
  obj.status = 'wait'
}

/**
 * 初始化火山引擎
 */
export function initUploader(obj = {}, completeFn = () => {}, errorFn = () => {}, progressFn = () => {}) {
  return new Promise((resolve, reject) => {
    try {
      obj.uploader = new TTUploader({
        userId: config.userId, // 建议设置能识别用户的唯一标识id，用于上传出错时排查问题，不要传入非 ASCII编码
        appId: config.appId, // 在视频点播-应用服务中创建的AppID，视频点播的质量监控等都是以这个参数来区分业务方的，务必正确填写
        // 仅视频/普通文件上传时需要配置
        videoConfig: {
          spaceName: config.spaceName, // 在视频点播中申请的点播空间名
          processAction: [
            {
              name: 'AddOptionInfo', // 获取视频信息
              input: {
                Title: obj?.file?.fileName
              }
            }
          ]
        }
      })
      obj.uploader.on('complete', (infor) => completeFn(infor, obj))
      obj.uploader.on('error', (infor) => errorFn(infor, obj))
      obj.uploader.on('progress', (infor) => progressFn(infor, obj))
      const option = {
        file: obj.file,
        stsToken: {
          AccessKeyID: config.AccessKeyID,
          SecretAccessKey: config.SecretAccessKey,
          SessionToken: config.SessionToken,
          CurrentTime: config.CurrentTime,
          ExpiredTime: config.ExpiredTime
        },
        callbackArgs: {
          videoGroupId: obj.params.originId,
          type: obj.task === '1' ? 1 : '',
          tenantId: '1000',
          createUserId: store.getters.userInfo.userId,
          md5: obj.md5,
          optional: obj.params.optional !== undefined ? obj.params.optional : ''
        }
      }
      obj.filekey = obj.uploader.addFile(option)
      obj.uploader.start(obj.filekey)
      resolve(obj)
    } catch (err) {
      obj.status = 'fail'
      obj.errorReason = JSON.stringify(err)
      reject(err)
    }
  })
}

import SparkMD5 from 'spark-md5'
import { getHSToken, getUploadConfig, getExistsSuccess, getExistsHash, sendNotice } from '@/api/task/index'
import { existsHash } from '@/api/videoManagement/vedioSetting'
import TTUploader from 'tt-uploader'
import store from '@/store'
import eventBus from '@/utils/eventBus'

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
      // console.log('Read chunk number (currentChunk + 1) of  chunks ')
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
          return existsSuccess(obj).then(() => {
            resolve(md5)
          }).catch(() => {
            reject()
          })
        } else {
          // console.log('md5校验异常', md5)
          reject('md5校验异常')
        }
        resolve(md5)
      }
    }
    fileReader.onerror = function() {
      // console.log('something went wrong')
      reject('something went wrong')
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
export function startUpload(obj, completeFn = () => {}, errorFn = () => {}, progressFn = () => {}) {
  return getHSToken().then(res => {
    config.AccessKeyID = res.data.accessKeyId
    config.SecretAccessKey = res.data.secretAccessKey
    config.SessionToken = res.data.sessionToken
    config.ExpiredTime = res.data.expiredTime
    config.CurrentTime = res.data.currentTime
    return initUploader(obj, completeFn, errorFn, progressFn)
  }).catch((err) => {
    obj.status = 'fail'
    obj.errorReason = JSON.stringify(err)
    eventBus.$emit('failTaks', [{ ...obj }])
  })
}

/**
 * 获取视频组当前视频数量
 */
export function getExistsSum(obj = {}) {
  return getExistsSuccess({ videoGroupId: obj.params.originId }).then(res => {
    if (res.data > 49) {
      // 判断能否开始上传
      return existsHashFn(obj).then(res => {
        if (res.status === 'uploading') {
          const fileKey = obj.uploader.addFile({
            file: obj.file,
            stsToken: {
              AccessKeyID: config.AccessKeyID,
              SecretAccessKey: config.SecretAccessKey,
              SessionToken: config.SessionToken,
              CurrentTime: config.CurrentTime,
              ExpiredTime: config.ExpiredTime
            },
            callbackArgs: {
              videoGroupId: obj?.params?.originId,
              multiCameraGroupId: obj?.params?.multiCameraGroupId,
              type: obj.task === '1' ? 1 : '',
              tenantId: getOriginOrganizationId() || '1000',
              createUserId: store.getters.userInfo.userId,
              md5: obj.md5,
              optional: !obj.optional ? obj.optional : ''
            }
          })
          obj.fileKey = fileKey
          // obj.uploader && obj.uploader.start(obj.fileKey)
          return obj
        }
        return res
      })
    } else {
      return initUpload(obj).then(() => {
        const fileKey = obj.uploader.addFile({
          file: obj.file,
          stsToken: {
            AccessKeyID: config.AccessKeyID,
            SecretAccessKey: config.SecretAccessKey,
            SessionToken: config.SessionToken,
            CurrentTime: config.CurrentTime,
            ExpiredTime: config.ExpiredTime
          },
          callbackArgs: {
            videoGroupId: obj?.params?.originId,
            multiCameraGroupId: obj?.params?.multiCameraGroupId,
            type: obj.task === '1' ? 1 : '',
            tenantId: getOriginOrganizationId() || '1000',
            createUserId: store.getters.userInfo.userId,
            md5: obj.md5,
            optional: !obj.optional ? obj.optional : ''
          }
        })
        obj.fileKey = fileKey
        // obj.uploader && obj.uploader.start(obj.fileKey)
        return obj
      })
    }
  }).catch((err) => {
    obj.status = 'fail'
    obj.errorReason = err.message || err.msg || '网络错误'
    eventBus.$emit('failTaks', [{ ...obj }])
  })
}

/**
 * md5码获取成功后，判断视频是否已经存在hash
 */
export function existsHashFn(obj) {
  if (obj.task === '1') {
    // 原视频
    return getExistsHash({ md5: obj.md5, videoGroupId: obj.params.originId }).then(res => {
      if (!res.data) {
        // 不存在
        obj.status = 'wait'
      } else {
        // 存在
        obj.progress = 100
        obj.status = 'success'
        obj.callbackArgs = []
        eventBus.$emit('successTaks', [{ ...obj }])
      }
      return obj
    }).catch((err) => {
      obj.status = 'fail'
      obj.errorReason = err.message || err.msg || '判断视频是否已经存在错误'
      eventBus.$emit('failTaks', [{ ...obj }])
    })
  } else {
    // 半成品视频，成品视频
    return existsHash({ teacherId: obj.params.optional.teacherId, type: obj.params.optional.type, md5: obj.md5 }).then(res => {
      if (res.data) {
        obj.progress = 100
        obj.status = 'success'
        eventBus.$emit('successTaks', [{ ...obj }])
      } else {
        obj.status = 'wait'
      }
      return obj
    }).catch((err) => {
      obj.status = 'fail'
      obj.errorReason = err.message || err.msg || '校验hash错误'
      eventBus.$emit('failTaks', [{ ...obj }])
    })
  }
}

// md5获取成功后,获取视频组当前视频数量
export function existsSuccess(obj) {
  return getExistsSuccess({ videoGroupId: obj.params.originId })
    .then((res) => {
      if (res.data < 100) {
        obj.status = 'wait'
        return existsHashFn(obj)
      } else {
        obj.status = 'fail'
        obj.errorReason = '当前视频组容量已达上限'
        eventBus.$emit('failTaks', [{ ...obj }])
      }
      return obj
    }).catch((err) => {
      obj.status = 'fail'
      obj.errorReason = err.message || err.msg || '获取视频组当前视频数量错误'
      eventBus.$emit('failTaks', [{ ...obj }])
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
 * 文件上传失败发送飞书通知
 */
export function uploadFailSendNotice(params) {
  if (typeof params.reason !== 'string') {
    params.reason = JSON.stringify(params.reason)
  }
  console.log('文件上传失败发送飞书通知', params)
  return sendNotice(params)
}

/**
 * 暂停上传
 */
export function Pause(obj) {
  obj.status = 'pause'
  obj.uploader && obj.uploader.pause(obj.filekey)
}

/**
 * 恢复上传
 */
export function Reload(obj) {
  obj.status = 'wait'
}

export function handleClickStart(obj, completeFn, errorFn, progressFn) {
  return new Promise((resolve, reject) => {
    return getExistsSuccess({ videoGroupId: obj.params.originId }).then((res) => {
      if (res.data > 49) {
        if (obj.origin === '原视频') {
          return getExistsHash({ md5: obj.md5, videoGroupId: obj.params.originId }).then((res) => {
            if (!res.data) {
              obj.progress = 100
              obj.status = 'success'
              obj.callbackArgs = []
              eventBus.$emit('successTaks', [{ ...obj }])
              resolve()
            } else {
              obj.status = 'fail'
              obj.errorReason = '已超过视频组容量'
              eventBus.$emit('failTaks', [{ ...obj }])
              resolve()
            }
          }).catch(() => {
            obj.status = 'fail'
            obj.errorReason = '获取视频组信息错误'
            eventBus.$emit('failTaks', [{ ...obj }])
            reject()
          })
        } else if (obj.origin === '半成品视频' || obj.origin === '成品视频') {
          return existsHash({ teacherId: obj.optional.teacherId, type: obj.optional.type, md5: obj.md5 }).then((res) => {
            if (res.data) {
              obj.progress = 100
              obj.status = 'success'
              eventBus.$emit('successTaks', [{ ...obj }])
              resolve()
            } else {
              obj.status = 'uploading'
              resolve()
            }
          }).catch((err) => {
            obj.status = 'fail'
            obj.errorReason = JSON.stringify(err)
            eventBus.$emit('failTaks', [{ ...obj }])
            reject()
          })
        }
      } else {
        initUploader(obj, completeFn, errorFn, progressFn).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      }
    }).catch((err) => {
      obj.status = 'fail'
      obj.errorReason = JSON.stringify(err)
      eventBus.$emit('failTaks', [{ ...obj }])
      reject()
    })
  })
}

// 二次校验
export function SecondaryVerification(obj) {
  return getExistsSuccess({ videoGroupId: obj.params.originId }).then((res) => {
    if (res.data < 50) {
      obj.progress = 100
      obj.status = 'success'
      eventBus.$emit('successTaks', [{ ...obj }])
    } else {
      if (obj.origin === '原视频') {
        getExistsHash({ md5: obj.md5, videoGroupId: obj.params.originId })
          .then((res) => {
            if (res.data) {
              obj.progress = 100
              obj.status = 'success'
              eventBus.$emit('successTaks', [{ ...obj }])
            } else {
              obj.status = 'fail'
              eventBus.$emit('fail', obj)
            }
          })
      } else if (obj.origin === '半成品视频' || obj.origin === '成品视频') {
        existsHash({ teacherId: obj.params.optional.teacherId, type: obj.params.optional.type, md5: obj.md5 }).then((res) => {
          if (res.data) {
            obj.progress = 100
            obj.status = 'success'
            eventBus.$emit('successTaks', [{ ...obj }])
          } else {
            obj.status = 'fail'
            obj.errorReason = '视频已存在'
            eventBus.$emit('failTaks', [{ ...obj }])
          }
        }).catch(() => {
        })
      }
    }
  }).catch(() => {
  })
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
                Title: obj?.file?.name
              }
            }
          ]
        }
      })
      obj.uploader.on('complete', (infor) => completeFn(infor, obj))
      obj.uploader.on('error', (infor) => {
        errorFn(infor, obj)
      })
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
          multiCameraGroupId: obj?.params?.multiCameraGroupId,
          type: obj.task === '1' ? 1 : '',
          tenantId: getOriginOrganizationId() || '1000',
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

export function Del(obj) {
  if (obj.fileKey) {
    obj.uploader.cancel(obj.fileKey)
  }
}

export function getOriginOrganizationId() {
  const originInfoString = localStorage.getItem('orgInfo')
  if (originInfoString) {
    const originInfo = JSON.parse(originInfoString)
    return String(originInfo.organizationId)
  } else {
    return false
  }
}


import { getOssConfig } from '@/api/file'
import eventBus from '@/utils/eventBus'

// oss配置参数
export const ossConfig = {
  region: 'oss-accelerate',
  accessKeyId: '',
  accessKeySecret: '',
  secure: true,
  bucket: '',
  ossBucketUrl: '',
  ossEndPoint: ''
}

/**
 * 获取oss配置参数
 */
export function initUpload(obj) {
  return new Promise((resolve, reject) => {
    if (ossConfig.accessKeyId && ossConfig.accessKeySecret && ossConfig.ossBucketUrl && ossConfig.ossEndPoint) {
      return resolve()
    } else {
      return getOssConfig().then(res => {
        console.log(res)
        ossConfig.accessKeyId = res.data.accessKeyId
        ossConfig.accessKeySecret = res.data.accessKeySecret
        ossConfig.bucket = res.data.ossBucket
        ossConfig.ossBucketUrl = res.data.ossBucketUrl
        ossConfig.ossEndPoint = res.data.ossEndPoint
        resolve()
      }).catch((err) => {
        if (obj) {
          obj.status = 'fail'
          obj.errorReason = String(err)
          eventBus.$emit('failTaks', [{ ...obj }])
        }
        reject('获取oss配置失败')
      })
    }
  })
}

/**
 * 开始上传
 */
export function startUpload(obj = {}, completeFn = () => {}, errorFn = () => {}, progressFn = () => {}) {
  return initUpload(obj).then(() => {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            const authProgress = {
              percent: Number((p * 100).toFixed(2))
            }
            obj.checkpoint = cpt
            progressFn(authProgress, obj)
          },
          // 设置并发上传的分片数量。
          parallel: obj.ossConfig.parallel,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: obj.ossConfig.partSize,
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        if (obj.ossConfig.checkpoint) {
          resumeUpload(obj = {}, progressFn = () => {}).then(res => {
            console.log(res)
            completeFn(res)
            resolve(res)
          })
        } else {
          upload(obj, options).then(res => {
            console.log(res)
            completeFn(res)
            resolve(res)
          })
        }
      } catch (err) {
        console.log('上传失败:', err, err.name)
        if (err.name === 'cancel') {
          // 上传暂停
        } else {
          console.log('上传失败:', err)
          obj.status = 'fail'
          obj.errorReason = 'oss上传调用失败'
          eventBus.$emit('failTaks', [{ ...obj }])
          reject('oss上传调用失败')
        }
      }
    })
  })
}

/**
 * 添加视频文件
 */
export function addFile(obj) {
  return initUpload().then(() => {
    console.log(ossConfig, 'ossConfig')
    // eslint-disable-next-line no-undef
    obj.uploader = new OSS(ossConfig)
    console.log('添加视频文件', obj)
    return obj
  })
}

/**
 * 重新上传
 */
export function againUpload(obj) {
  obj.status = 'wait'
}

function upload(obj, options) {
  console.log(obj, options)
  // 分片上传。
  return obj.uploader.multipartUpload(obj.ossConfig.ossTeacherFolder + obj.file.name, obj.file, {
    ...options
  })
}

// 上传重试
function resumeUpload(obj, progressFn = () => {}) {
  return obj.uploader.multipartUpload(obj.ossConfig.ossTeacherFolder + obj.file.name, obj.file, {
    checkpoint: obj.ossConfig.checkpoint,
    progress: (p, cpt, res) => {
      // 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
      // 获取上传进度。
      const authProgress = {
        percent: Number((p * 100).toFixed(2))
      }
      obj.checkpoint = cpt
      progressFn(authProgress, obj)
    }
  })
}

// 暂停上传
export function Pause(obj) {
  obj.loading = true
  obj.uploader.cancel()
  obj.status = 'pause'
  obj.loading = false
}

// 恢复上传
export function Reload(obj) {
  obj.status = 'wait'
}

// 删除
export function Del(obj) {
}

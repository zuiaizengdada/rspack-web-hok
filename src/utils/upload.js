import request from '@/utils/request'
// 封装Axios上传接口uploadChunkAxios
export function uploadChunkAxios(baseURL, urlAddress, jsonParam) {
  return request({
    baseURL: baseURL,
    url: urlAddress,
    method: 'post',
    data: jsonParam
  })
}
// 分片处理
export const uploadByPieces = ({
  file,
  pieceSize = 1,
  baseURL,
  urlAddress,
  success,
  error
}) => {
  // console.log(file)
  // 上传过程中用到的变量
  console.log(pieceSize, file)
  const chunkSize = pieceSize * 1024 * 1024 // 1MB一片
  const chunkCount = Math.ceil(file.size / chunkSize) // 总片数
  const getChunkInfo = (file, currentChunk, chunkSize) => {
    const start = currentChunk * chunkSize
    const end = Math.min(file.size, start + chunkSize)
    const chunk = file.slice(start, end)
    return { start, end, chunk }
  }
  // 针对每个文件进行chunk处理
  const readChunk = () => {
    // 针对单个文件进行chunk上传
    const { chunk } = getChunkInfo(file, 0, chunkSize)
    uploadChunk({ chunk, currentChunk: 0, chunkCount })
  }
  const uploadChunk = chunkInfo => {
    const fetchForm = new FormData()
    fetchForm.append('chunk', chunkInfo.currentChunk)
    fetchForm.append('chunkSize', chunkSize)
    fetchForm.append('chunks', chunkInfo.chunkCount)
    fetchForm.append('file', chunkInfo.chunk)
    fetchForm.append('name', file.name)
    if (file.workID) {
      fetchForm.append('workID', file.workID)
    }
    if (file.moduleName) {
      fetchForm.append('moduleName', file.moduleName)
    }
    uploadChunkAxios(baseURL, urlAddress, fetchForm)
      .then(res => {
        if (res.code === 20000) {
          // success && success(res)
          if (chunkInfo.currentChunk < chunkInfo.chunkCount - 1) {
            const { chunk } = getChunkInfo(
              file,
              chunkInfo.currentChunk + 1,
              chunkSize
            )
            uploadChunk({
              chunk,
              currentChunk: chunkInfo.currentChunk + 1,
              chunkCount: chunkInfo.chunkCount
            })
            res.chunk = chunkInfo.currentChunk + 1
            res.chunkCount = chunkInfo.chunkCount
            success && success(res)
          } else {
            // 当总数大于等于分片个数的时候
            if (chunkInfo.currentChunk >= chunkInfo.chunkCount - 1) {
              res.chunk = chunkInfo.currentChunk + 1
              res.chunkCount = chunkInfo.chunkCount
              console.log('文件上传成功')
              success && success(res)
            }
          }
        } else {
          console.log(res.msg)
          error && error(res.msg)
        }
      })
      .catch(e => {
        console.log(e)
        error && error(e)
      })
  }
  readChunk() // 开始执行代码
}

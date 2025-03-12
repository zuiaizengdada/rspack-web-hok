// 上传格式大小限制
export const formatLimits = {
  doc: {
    type: '文档',
    extensions: ['doc', 'docx'],
    maxSize: 10 * 1024 * 1024
  },
  form: {
    type: '表格',
    extensions: ['xls', 'xlsx'],
    maxSize: 10 * 1024 * 1024
  },
  pdf: {
    type: 'pdf',
    extensions: ['pdf'],
    maxSize: 10 * 1024 * 1024
  },
  ppt: {
    type: 'ppt',
    extensions: ['ppt', 'pptx'],
    maxSize: 100 * 1024 * 1024
  },
  audio: {
    type: '音频',
    extensions: ['mp3', 'wav', 'aac', 'flac'],
    maxSize: 500 * 1024 * 1024
  },
  txt: {
    type: 'txt',
    extensions: ['txt'],
    maxSize: 10 * 1024 * 1024
  },
  image: {
    type: '图片',
    extensions: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    maxSize: 100 * 1024 * 1024
  }
}

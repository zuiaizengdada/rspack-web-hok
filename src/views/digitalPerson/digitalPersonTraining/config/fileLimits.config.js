export const imageFormatLimits = {
  image: {
    type: '图片',
    extensions: ['jpg', 'jpeg', 'png'],
    maxSize: 1 * 1024 * 1024
  }
}

export const videoFormatLimits = {
  video: {
    type: '视频',
    extensions: ['mp4', 'mov', 'mkv', 'avi'],
    maxSize: 500 * 1024 * 1024
  }
}

export const voiceFormatLimits = {
  audio: {
    type: '音频',
    extensions: ['wav', 'mp3', 'mp4a', 'm4a'],
    maxSize: 20 * 1024 * 1024
  }
}

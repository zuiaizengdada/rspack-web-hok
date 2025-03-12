export const links = [
  {
    name: '抖音',
    url: 'https://www.douyin.com/'
  },
  {
    name: '小红书',
    url: 'https://www.xiaohongshu.com/'
  },
  {
    name: '快手',
    url: 'https://www.kuaishou.com/'
  },
  {
    name: '今日头条',
    url: 'https://www.toutiao.com/'
  },
  {
    name: '微博',
    url: 'https://www.weibo.com/'
  },
  {
    name: 'B站',
    url: 'https://www.bilibili.com/'
  }
]

export const tooltipTips = [
  {
    icon: '_video',
    content: '视频支持：mp4/wmv/flv/rmvb等格式，最大支持2G;'
  },
  {
    icon: '_audio',
    content: '音频支持：mp3/wav/m4a等格式，最大支持500MB;'
  },
  {
    icon: 'pic',
    content: '图片支持：jpg/jpeg/png，最大支持100MB;'
  },
  {
    icon: 'file',
    content: '文档支持：pdf/doc/xls/ppt/txt等格式，最大支持100MB;'
  }
]

// 上传格式大小限制
export const formatLimits = {
  video: {
    type: '视频',
    extensions: [
      'mp4',
      'wmv',
      'flv',
      'm4v',
      'rmvb',
      'dat',
      'mov',
      'mkv',
      'webm',
      'avi',
      'mpeg',
      '3gp',
      'ogg'
    ],
    maxSize: 4 * 1024 * 1024 * 1024
  }, // 4GB
  audio: {
    type: '音频',
    extensions: [
      'mp3',
      'wav',
      'm4a',
      'wma',
      'aac',
      'ogg',
      'amr',
      'flac',
      'aiff'
    ],
    maxSize: 500 * 1024 * 1024
  }, // 500MB
  image: {
    type: '图片',
    extensions: ['jpg', 'jpeg', 'png'],
    maxSize: 100 * 1024 * 1024
  }, // 100MB
  doc: {
    type: '文档',
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'txt', 'pptx'],
    maxSize: 100 * 1024 * 1024
  } // 100MB
}

// 各平台正则
export const linkTypeRegxs = [
  // 抖音
  /https:\/\/v.douyin.com\/[a-zA-Z0-9]+/,
  /https:\/\/www.douyin.com\/channel\/[a-zA-Z0-9]+/,
  /https:\/\/www.douyin.com\/video\/[a-zA-Z0-9]+/,
  /https:\/\/www.douyin.com\/discover\?modal_id=[a-zA-Z0-9]+/,

  // b站
  /https:\/\/www.bilibili.com\/video\/[a-zA-Z0-9]+/,
  /https:\/\/b23.tv\/[a-zA-Z0-9]+/,

  // 小红书
  /http:\/\/xhslink.com\/[a-zA-Z0-9]+/,
  /https:\/\/www.xiaohongshu.com\/[a-zA-Z0-9]+/,

  // 快手
  /https:\/\/www.kuaishou.com\/[a-zA-Z0-9]+/,

  // 微博
  /https:\/\/weibo.com\/tv\/show\//,
  /https:\/\/m.weibo.cn\//,
  /https:\/\/weibo.com\//,

  // 头条
  /https:\/\/www.toutiao.com\/video\//
]

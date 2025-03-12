export const videoGroupBoard = {
  'autoDesensitizedCount': 0,
  'autoDesensitizedDuration': 0,
  'duration': 0,
  'effDuration': 0,
  'effInvalidVideoCount': 0,
  'invalidVideoCount': 0,
  'manualDesensitizedCount': 0,
  'manualDesensitizedDuration': 0,
  'shareCount': 0,
  'shareDuration': 0,
  'videoGroupCount': 0
}

export const ngList = [
  {
    left: '13.2vw', // 引导框的left
    top: '14.2vh', // 引导框的top
    widthImg: '1648px', // 图片宽高
    heightImg: '95px', // 图片宽高
    tipsWidth: '417px', // 提示框宽高
    tipsHeight: '187px', // 提示框宽高
    tipsLeft: '600px', // 提示框left
    arrowClass: 'arrowClass-desensiti', // 箭头样式,需要自定义需要自己增加class
    content: '',
    haveStep: false, // 是否有步骤
    title: '筛选项', // 标题
    tips: '脱敏数据可以根据视频组创建时间、部门、创建者、IP进行查询。', // 提示
    targetUrl: require('@/assets/image/video/ng_desensitization_step1.png'), // 引导图片
    msgUrl: '' // 引导图片下面的提示图片
  },
  {
    left: '13.2vw', // 引导框的left
    top: '25.2vh', // 引导框的top
    widthImg: '1648px', // 图片宽高
    heightImg: '476px', // 图片宽高
    tipsWidth: '417px', // 提示框宽高
    tipsHeight: '187px', // 提示框宽高
    tipsLeft: '600px', // 提示框left
    arrowClass: 'arrowClass-desensiti', // 箭头样式,需要自定义需要自己增加class
    content: '',
    haveStep: false, // 是否有步骤
    title: '核心指标和数据明细', // 标题
    tips: '脱敏数据可以根据视频组创建时间、部门、创建者、IP进行查询。', // 提示
    targetUrl: require('@/assets/image/video/ng_desensitization_step2.png'), // 引导图片
    msgUrl: '' // 引导图片下面的提示图片
  }
]

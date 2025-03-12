export const dataInfoList = [
  { title: '共享视频', tips: ['以下数据统计不包含空镜素材', '共享视频数：已完成手动脱敏并共享过的视频数（取消共享的视频数也会统计在内）', '共享视频时长：共享视频数合计的视频时长（多次脱敏则以最后脱敏并共享的视频时长为准）'] },
  { title: '作品', tips: ['已发布成品数：已发布的成品视频数', '已发布作品数：成品视频已发布到第三方的视频数（一个成品视频可发布多个作品）'] }
]
export const videoUse = ['以下数据统计不包含空镜素材', '已使用数：已剪辑生成成品视频的共享视频数', '未使用数：未剪辑成品视频的共享视频数', '使用人数：使用共享视频生成成品视频的运营人员数量', '已使用视频时长：已使用视频数合计的视频时长', '未使用视频时长：未使用视频数合计的视频时长']
export const likeList = [
  {
    value: '1',
    label: '<2000'
  },
  {
    value: '2',
    label: '≥2000'
  },
  {
    value: '3',
    label: '≥5000'
  },
  {
    value: '4',
    label: '≥1万'
  },
  {
    value: '5',
    label: '≥2万'
  },
  {
    value: '6',
    label: '≥3万'
  }
]

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
    targetUrl: require('@/assets/image/video/ng_desensitization_step3.png'), // 引导图片
    msgUrl: '' // 引导图片下面的提示图片
  },
  {
    left: '13.2vw', // 引导框的left
    top: '25.2vh', // 引导框的top
    widthImg: '1648px', // 图片宽高
    heightImg: '375px', // 图片宽高
    tipsWidth: '417px', // 提示框宽高
    tipsHeight: '187px', // 提示框宽高
    tipsLeft: '600px', // 提示框left
    arrowClass: 'arrowClass-desensiti', // 箭头样式,需要自定义需要自己增加class
    content: '',
    haveStep: false, // 是否有步骤
    title: '核心指标和数据明细', // 标题
    tips: '脱敏数据可以根据视频组创建时间、部门、创建者、IP进行查询。', // 提示
    targetUrl: require('@/assets/image/video/ng_desensitization_step4.png'), // 引导图片
    msgUrl: '' // 引导图片下面的提示图片
  },
  {
    left: '13.2vw', // 引导框的left
    top: '23.2vh', // 引导框的top
    widthImg: '1648px', // 图片宽高
    heightImg: '537px', // 图片宽高
    tipsWidth: '417px', // 提示框宽高
    tipsHeight: '187px', // 提示框宽高
    tipsLeft: '600px', // 提示框left
    arrowClass: 'arrowClass-desensiti', // 箭头样式,需要自定义需要自己增加class
    content: '',
    haveStep: false, // 是否有步骤
    title: '核心指标和数据明细', // 标题
    tips: '脱敏数据可以根据视频组创建时间、部门、创建者、IP进行查询。', // 提示
    targetUrl: require('@/assets/image/video/ng_desensitization_step5.png'), // 引导图片
    msgUrl: '' // 引导图片下面的提示图片
  }
]

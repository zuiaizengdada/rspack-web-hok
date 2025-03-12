import moment from 'moment'
import { filtersMoneyByZero } from '@/filters/index.js'

// 直播模式
export const liveModeOption = [
  { label: '真人直播', value: 'PERSON_LIVE', icon: 'zibo' },
  { label: '数字直播', value: 'AI_LIVE', icon: 'zhinengzhibo' }
  // { label: '数字人直播', value: 'DIGITAL_PERSON_LIVE', icon: 'shuzirenzhibo' }
]
// 直播状态
export const liveStateOption = [
  { label: '未开始', value: 0 },
  { label: '直播中', value: 1 },
  { label: '直播暂停', value: 2 },
  { label: '直播异常', value: 3 },
  { label: '直播结束', value: 9 },
  { label: '加载中', value: '-1' }
]
export const markColor = [
  { colorText: '红色', color: '#FF0006', value: 1 },
  { colorText: '黄色', color: '#FF9D00', value: 3 },
  { colorText: '绿色', color: '#00D24F', value: 5 },
  { colorText: '蓝色', color: '#008EFF', value: 2 },
  { colorText: '紫色', color: '#BD6CD9', value: 4 }
]

// 话术类型
export const msgTypeOption = [
  { label: '话述', value: 3, default: '' },
  { label: '+1', value: 1, default: '1' },
  { label: '送花', value: 2, default: 'https://oss.hokkj.cn/live/rose.png' },
  { label: '表情包', value: 5, default: '' },
  { label: '图片', value: 4, default: '' },
  { label: '已签到', value: 11, default: '已签到' },
  { label: '正在购买中', value: 8, default: '正在购买中' },
  { label: '已购买', value: 9, default: '已购买' },
  { label: '已领取优惠券', value: 10, default: '已领取优惠券' }
]
export function getColumns() {
  return [
    { prop: 'code', label: '直播间ID', type: 'text', 'min-width': '113px' },
    {
      prop: 'name',
      label: '直播间名称',
      type: 'text',
      'min-width': '190px',
      'show-overflow-tooltip': true
    },
    {
      prop: 'liveModel',
      label: '直播模式',
      type: 'slot',
      'min-width': '152px'
    },
    {
      prop: 'teacherInfoDtoList',
      label: '讲师',
      type: 'text',
      'min-width': '120px',
      render: row => {
        return renderTearch(row)
      }
    },
    {
      prop: 'startTime',
      label: '开播时间',
      type: 'text',
      width: '152px',
      render: row => {
        return moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      prop: 'liveDuration',
      label: '直播时长(分)',
      type: 'text',
      width: '108px',
      render: row => {
        return renderLiveDuration(row.liveDuration)
      },
      align: 'center'
    },
    {
      prop: 'doneOrderCount',
      label: '已付订单笔数',
      type: 'slot',
      width: '108px',
      align: 'center'
    },
    {
      prop: 'gmv',
      label: '已付GMV',
      type: 'slot',
      width: '108px',
      align: 'center',
      render: row => {
        return filtersMoneyByZero(row.gmv)
      }
    },
    { prop: 'status', label: '直播状态', type: 'slot', 'min-width': '114px' },
    {
      prop: 'createUserName',
      label: '创建人',
      type: 'text',
      'min-width': '114px'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'text',
      'min-width': '172px',
      render: row => {
        return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      width: '240px',
      fixed: 'right'
    }
  ]
}

export function renderTearch(row) {
  if (row.liveModel === 'PERSON_LIVE') {
    const arr = row.teacherInfoDtoList
    if (!arr) {
      return ''
    }
    const value = arr
      .filter(v => v.teacherRole === 0)
      .reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
        return pre
      }, '')
    return value
  } else if (row.liveModel === 'AI_LIVE') {
    return row.videoTeacherName || '——'
  } else {
    return ''
  }
}

export function renderLiveDuration(row) {
  if (!row) {
    return 0
  }
  if (row < 60000) {
    return Math.floor(row / 1000) + '秒'
  }
  return Math.floor(row / 1000 / 60) + '分钟'
}

export function renderRoleInfo(robotId) {
  if (!robotId) {
    return {
      type: '',
      role: ''
    }
  } else if (/T$/.test(robotId)) {
    return {
      type: 'success',
      role: '老师'
    }
  } else if (/A$/.test(robotId)) {
    return {
      type: 'warning',
      role: '助教'
    }
  } else {
    return {
      type: '',
      role: ''
    }
  }
}

// 优惠券类型
export const couponDiscountMethodType = [
  { label: '满减券', value: 1 },
  { label: '直减券', value: 2 },
  { label: '折扣券', value: 3 }
]

// 优惠券使用状态
export const couponUseStatusType = [
  { label: '待开始', value: 1 },
  { label: '生效中', value: 2 },
  { label: '已过期', value: 3 },
  { label: '已作废', value: 4 }
]

// 直播间B端操作日志类型
// 1-B端直播间学员详情查看手机号 2-连麦记录查看手机号 3-报名列表查看手机号 4-用户记录列表查看手机号 5-购买记录列表查看手机号 6-领取记录列表查看手机号 7-中奖记录列表查看手机号 8-发货详情查看手机号 100-数据统计 101-列表点击详情 102-进入直播间
// 103-发货详情查看收货人手机号  104-回放记录下载回放视频 10-通用管理-老师管理-查询老师手机号码 11 直播间详情-讲师设置-查看助教老师手机号码 12:直播间详情-回放设置查看手机号 13 直播间详情-讲师设置-查看主讲老师手机号码
// 103-发货详情查看收货人手机号  104-回放记录下载回放视频 9-签到结果查看手机号 14 线索导入查询手机号
export const liveOperationType = {
  type1: 1,
  type2: 2,
  type3: 3,
  type4: 4,
  type5: 5,
  type6: 6,
  type7: 7,
  type8: 8,
  type9: 9,
  type10: 10,
  type11: 11,
  type12: 12,
  type13: 13,
  type100: 100,
  type101: 101,
  type102: 102,
  type103: 103,
  type104: 104,
  type14: 14
}

// 连麦类型
export const lianMaiType = [
  { label: '音频连麦', value: 1 },
  { label: '视频连麦', value: 2 }
]

// 连麦状态
export const lianMaiStateOption = [
  { label: '排队中', value: 1 },
  { label: '连麦中', value: 2 },
  { label: '连麦结束', value: 3 },
  { label: '取消连麦', value: 4 }
]

// 签到时长
export const signTimeOption = [
  { label: '30秒', value: 0.5 },
  { label: '1分钟', value: 1 },
  { label: '3分钟', value: 3 },
  { label: '5分钟', value: 5 },
  { label: '10分钟', value: 10 },
  { label: '30分钟', value: 30 }
]
// 是否游客 1-登录用户 2-游客
export const userTypeOption = [
  { label: '否', value: 1 },
  { label: '是', value: 2 }
]

// 是否到课 1:未到课 2:已到课
export const classAttendanceOption = [
  { label: '否', value: 1 },
  { label: '是', value: 2 }
]

// 研发进度
export const researchProgressOption = [
  { label: '未开始', value: 1 },
  { label: '研发中', value: 2 },
  { label: '详情页包装', value: 3 },
  { label: '研发完成', value: 4 },
  { label: '待审核', value: 5 },
  { label: '未上架', value: 6 },
  { label: '已上架', value: 7 }
]
// 分类标签
export const sortLabelOption = [
  { label: '视频课', value: 1 },
  { label: '直播课', value: 2 },
  { label: '线下课', value: 3 },
  { label: '套餐课', value: 4 },
  { label: '书课包', value: 5 }
]

export const giveawayHasOption = [
  { label: '无', value: 1 },
  { label: '有', value: 2 }
]

export const goodsAttributeArray = [
  { label: '私董会', value: 1 },
  { label: '落地班', value: 2 },
  { label: '系统课程', value: 3 },
  { label: '公开课', value: 4 },
  { label: '微咨询', value: 5 },
  { label: '咨询&领跑', value: 6 },
  { label: '企业内训/陪跑', value: 7 },
  { label: '游学', value: 8 },
  { label: '其他', value: 9 },
  { label: '非商赛道公开课', value: 10 }
]

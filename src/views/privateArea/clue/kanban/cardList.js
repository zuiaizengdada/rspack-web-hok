export default [
  {
    paramType: 1,
    text: '分配线索数',
    tips: '1、订单类型任务：任务分配的订单类型线索 2、线下表格类型任务：任务分配的线下表格线索',
    value: '0'
  },
  {
    paramType: 2,
    text: '外呼触达线索数',
    tips: '分配的线索中，成功外呼的数量',
    value: 0
  },
  {
    paramType: 3,
    text: '短信触达线索数',
    tips: '分配的线索中，成功发送短信的数据',
    value: 0
  },
  {
    paramType: 4,
    text: ['总加微数', '总加企微数', '自动加企微数', '人工加企微数', '个微加微数'],
    tips: `总加微数：分配的线索中成功加上企微或者个位的线索数，同一个线索只统计一次<br/>
    总加企微数：分配的线索中成功加上企微的线索数，同一个线索只统计一次<br/>
    自动加企微数：配的线索中通过系统自动加上企微的线索数，同一个线索只统计一次<br/>
    人工加企微数：分配的线索中非系统自动加上企微的线索数，同一个线索只统计一次<br/>
    个微加微数：分配的线索中成功加上个微的线索数，同一个线索只统计一次
  `,
    isCarousel: true,
    addWxRate: [],
    value: [0, 0, 0, 0, 0]
  },
  {
    paramType: 5,
    text: '邀约数',
    tips: '新线索使用相同手机成功报名的数量',
    ratioLabel: ['邀约率'],
    value: 0,
    basisRatio: [0]
  },
  {
    paramType: 6,
    text: '报名数',
    tips: '新线索使用相同手机成功报名的数量',
    ratioLabel: ['报名率'],
    value: 0,
    basisRatio: [0]
  },
  {
    paramType: 7,
    text: '到课数',
    tips: '在直播间中观看时长大于等于1分钟的线索数',
    ratioLabel: ['到课率', '到课转化率'],
    value: 0,
    basisRatio: [0, 0]
  },
  {
    paramType: 8,
    text: '完课数',
    tips: '在直播间中观看时长大于等于50分钟的线索数',
    ratioLabel: ['完课率', '完课转化率'],
    value: 0,
    basisRatio: [0, 0]
  },
  {
    paramType: 9,
    text: '新线索转化人数',
    tips: '',
    value: 0
  },
  {
    paramType: 10,
    text: '新线索转化订单数',
    tips: '',
    ratioLabel: ['线索转化率'],
    value: 0,
    basisRatio: [0]
  },
  {
    paramType: 11,
    text: '新线索订单金额(GMV)',
    tips: '',
    value: 0
  },
  {
    paramType: 12,
    text: '新线索退款金额',
    tips: '',
    value: 0
  },
  {
    paramType: 13,
    text: '新线索营收',
    tips: '新线索转化金额-新线索退款金额',
    value: 0
  },
  {
    paramType: 14,
    text: '订单总金额(GMV)',
    tips: '当前任务所有对应直播间的已支付订单金额+任务中认领的已支付金额',
    value: 0
  },
  {
    paramType: 15,
    text: '新线索退款订单数',
    tips: '',
    ratioLabel: ['新线索退款率'],
    value: 0,
    basisRatio: [0]
  }
]

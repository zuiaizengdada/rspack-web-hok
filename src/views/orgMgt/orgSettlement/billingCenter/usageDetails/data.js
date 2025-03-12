import {
  aiCallOpen,
  aiCallRent,
  aiCallCertificate,
  qiyukf,
  digitalhuman,
  aggregateCustomer,
  chargesList,
  aiTokenPage,
  aiCallRecordPage,
  callAgent,
  callRecord,
  callRent,
  ecsPage,
  usagelivePage,
  orderApiPage,
  publicDomainPage,
  saleFriendsRecord,
  smsRecord,
  sysService,
  wemedia,
  qiweiCost,
  videoMaterial,
  custom
} from '@/api/orgSettlement/usage.js'

const comColumns = [
  {
    prop: 'productChargesItemName',
    type: 'text',
    label: '明细收费项',
    minWidth: 142
  },
  {
    prop: 'expenseTypeDesc',
    type: 'text',
    label: '收费类型',
    minWidth: 142
  }
]
const sysColumns = [
  ...comColumns,
  {
    prop: 'billCycle',
    type: 'text',
    label: '账期',
    minWidth: 142
  },
  {
    prop: 'tenantName',
    type: 'text',
    label: '机构名称',
    minWidth: 142
  },
  {
    prop: 'userName',
    type: 'text',
    label: '员工姓名',
    minWidth: 142
  },
  {
    prop: 'deptChainName',
    type: 'text',
    label: '部门',
    minWidth: 142
  },
  {
    prop: 'phoneNumber',
    type: 'text',
    label: '账号',
    minWidth: 142
  }
]
const aiCallRecordColumns = [
  ...comColumns,
  {
    prop: 'billCycle',
    type: 'text',
    label: '账期',
    minWidth: 142
  },
  {
    prop: 'tenantName',
    type: 'text',
    label: '机构名称',
    minWidth: 142
  },
  {
    prop: 'phone',
    type: 'text',
    label: '外呼用户',
    minWidth: 142
  },
  {
    prop: 'callTime',
    type: 'text',
    label: '呼叫时间',
    minWidth: 142
  },
  {
    prop: 'chargedDuration',
    type: 'slot',
    label: '时长（分钟）',
    minWidth: 142
  }
]
const aiCallRecordColumns2 = [
  ...comColumns,
  {
    prop: 'billCycle',
    type: 'text',
    label: '账期',
    minWidth: 142
  },
  {
    prop: 'tenantName',
    type: 'text',
    label: '机构名称',
    minWidth: 142
  },
  {
    prop: 'phone',
    type: 'text',
    label: '外呼用户',
    minWidth: 142
  },
  {
    prop: 'callTime',
    type: 'text',
    label: '呼叫时间',
    minWidth: 142
  },
  {
    prop: 'totalDuration',
    type: 'slot',
    label: '时长（分钟）',
    minWidth: 142
  }
]
const smsColumns = [
  ...comColumns,
  {
    prop: 'billCycle',
    type: 'text',
    label: '账期',
    minWidth: 142
  },
  {
    prop: 'tenantName',
    type: 'text',
    label: '机构名称',
    minWidth: 142
  },
  {
    prop: 'smsType',
    type: 'text',
    label: '短信类型',
    minWidth: 100
  },
  {
    prop: 'sendTime',
    type: 'text',
    label: '发送时间',
    minWidth: 142
  },
  {
    prop: 'phone',
    type: 'text',
    label: '短信发送号码',
    minWidth: 142
  },
  {
    prop: 'msgCount',
    type: 'text',
    label: '发送短信条数',
    minWidth: 100
  },
  {
    prop: 'content',
    type: 'multText',
    label: '短信内容',
    minWidth: 240
  }
]
const smsColumns2 = [
  ...comColumns,
  {
    prop: 'billCycle',
    type: 'text',
    label: '账期',
    minWidth: 142
  },
  {
    prop: 'tenantName',
    type: 'text',
    label: '机构名称',
    minWidth: 142
  },
  {
    prop: 'smsType',
    type: 'text',
    label: '短信类型',
    minWidth: 142
  },
  {
    prop: 'sendTime',
    type: 'text',
    label: '发送时间',
    minWidth: 142
  },
  {
    prop: 'phone',
    type: 'text',
    label: '短信发送号码',
    minWidth: 142
  }
]
const otherColumns = [
  ...comColumns,
  {
    prop: 'billCycle',
    type: 'text',
    label: '账期',
    minWidth: 142
  },
  {
    prop: 'tenantName',
    type: 'text',
    label: '机构名称',
    minWidth: 142
  },
  {
    prop: 'content',
    type: 'multText',
    label: '收费项内容',
    minWidth: 200
  },
  {
    prop: 'openTime',
    type: 'text',
    label: '开通时间',
    minWidth: 142
  },
  {
    prop: 'confirmor',
    type: 'text',
    label: '机构确认人',
    minWidth: 142
  },
  {
    prop: 'voucherUrl',
    type: 'slot',
    label: '费用凭证',
    minWidth: 100
  }
]
export const codeTransAPpi = {
  AIC0001: {
    name: 'AI外呼基础服务',
    api: aiCallOpen,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'openTime',
        type: 'text',
        label: 'AI外呼服务开通时间',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  AIC0002: {
    name: 'AI外呼电话认证',
    api: aiCallCertificate,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'phones',
        type: 'text',
        label: '认证账号',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  AIC0003: {
    name: 'AI外呼月租',
    api: aiCallRent,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'phones',
        type: 'text',
        label: '月租账号',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  AIC0004: {
    name: 'AI外呼话费',
    api: aiCallRecordPage(1),
    columns: aiCallRecordColumns2,
    slotArr: ['totalDuration']
  },
  AIC0005: {
    name: 'AI外呼录音',
    api: aiCallRecordPage(2),
    columns: aiCallRecordColumns2,
    slotArr: ['totalDuration']
  },
  DIG0001: {
    name: '数字人套餐',
    api: digitalhuman(1),
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'deliveryContent',
        type: 'multText',
        label: '收费项内容',
        minWidth: 200
      },
      {
        prop: 'openTime',
        type: 'text',
        label: '开通时间',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  DIG0004: {
    name: '数字人快速克隆套餐',
    api: digitalhuman(4),
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'deliveryContent',
        type: 'multText',
        label: '收费项内容',
        minWidth: 200
      },
      {
        prop: 'openTime',
        type: 'text',
        label: '开通时间',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  DIG0002: {
    name: '数字人声音',
    api: digitalhuman(2),
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'deliveryContent',
        type: 'multText',
        label: '收费项内容',
        minWidth: 200
      },
      {
        prop: 'openTime',
        type: 'text',
        label: '开通时间',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  DIG0003: {
    name: '数字人形象',
    api: digitalhuman(3),
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'deliveryContent',
        type: 'multText',
        label: '收费项内容',
        minWidth: 200
      },
      {
        prop: 'openTime',
        type: 'text',
        label: '开通时间',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  SER0001: {
    name: '七鱼客服坐席',
    api: qiyukf,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'usedCount',
        type: 'text',
        label: '坐席数量',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  AGG0001: {
    name: '聚合客服坐席',
    api: aggregateCustomer,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'usedCount',
        type: 'text',
        label: '坐席数量',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  },
  SYS0001: {
    name: '产品研发',
    api: sysService,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'nickName',
        type: 'text',
        label: '员工姓名',
        minWidth: 142
      },
      {
        prop: 'deptChainName',
        type: 'text',
        label: '部门',
        minWidth: 142
      },
      {
        prop: 'phoneNumber',
        type: 'text',
        label: '账号',
        minWidth: 142
      }
    ]
  },
  SYS0002: { name: '流量获客', api: sysService, columns: sysColumns },
  SYS0003: { name: '智能销售', api: sysService, columns: sysColumns },
  SYS0004: { name: '售后交付', api: sysService, columns: sysColumns },
  SYS0005: { name: '系统账号', api: sysService, columns: sysColumns },
  MSG0001: {
    name: '加微短信',
    api: smsRecord('MSG0001'),
    columns: smsColumns
  },
  MSG0002: {
    name: '订单通知短信',
    api: smsRecord('MSG0002'),
    columns: smsColumns
  },
  MSG0003: {
    name: '抖店解密短信',
    api: smsRecord('MSG0003'),
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'smsType',
        type: 'text',
        label: '短信类型',
        minWidth: 100
      },
      {
        prop: 'sendTime',
        type: 'text',
        label: '发送时间',
        minWidth: 142
      },
      {
        prop: 'orderNo',
        type: 'text',
        label: '订单号',
        minWidth: 142
      },
      {
        prop: 'msgCount',
        type: 'text',
        label: '发送短信条数',
        minWidth: 100
      },
      {
        prop: 'content',
        type: 'multText',
        label: '短信内容',
        minWidth: 240
      }
    ]
  },
  MSG0004: {
    name: '人工外呼认证短信',
    api: smsRecord('MSG0004'),
    columns: smsColumns2
  },
  MSG0005: {
    name: '短信通知',
    api: smsRecord('MSG0005'),
    columns: smsColumns
  },
  CAL0001: {
    name: '人工外呼坐席',
    api: callAgent,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'agentCount',
        type: 'text',
        label: '人工外呼坐席数',
        minWidth: 142
      }
    ]
  },
  CAL0002: {
    name: '人工外呼月租',
    api: callRent,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'channelName',
        type: 'text',
        label: '服务商',
        minWidth: 142
      },
      {
        prop: 'phone',
        type: 'text',
        label: '月租账号',
        minWidth: 142
      }
    ]
  },
  CAL0003: {
    name: '人工外呼话费',
    api: callRecord(1),
    columns: aiCallRecordColumns,
    slotArr: ['chargedDuration']
  },
  CAL0004: {
    name: '人工外呼录音',
    api: callRecord(2),
    columns: aiCallRecordColumns,
    slotArr: ['chargedDuration']
  },
  CAL0005: {
    name: '人工外呼转接费',
    api: callRecord(3),
    columns: aiCallRecordColumns,
    slotArr: ['chargedDuration']
  },
  ECS0001: {
    name: '云桌面服务',
    api: ecsPage,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'ip',
        type: 'text',
        label: '云桌面IP地址',
        minWidth: 142
      },
      {
        prop: 'account',
        type: 'text',
        label: '云桌面账号',
        minWidth: 142
      },
      {
        prop: 'userName',
        type: 'text',
        label: '开通员工姓名',
        minWidth: 142
      },
      {
        prop: 'phoneNumber',
        type: 'text',
        label: '开通账号',
        minWidth: 142
      }
    ]
  },
  WEM0001: {
    name: '自媒体接口调用',
    api: wemedia,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'api',
        type: 'text',
        label: '接口名称',
        minWidth: 142
      },
      {
        prop: 'usedCount',
        type: 'text',
        label: '调用次数',
        minWidth: 142
      }
    ]
  },
  ORD0001: {
    name: '第三方订单接口调用',
    api: orderApiPage,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'api',
        type: 'text',
        label: '接口名称',
        minWidth: 142
      },
      {
        prop: 'usedCount',
        type: 'text',
        label: '调用次数',
        minWidth: 142
      }
    ]
  },
  AIA0001: {
    name: 'AI助手文字生成服务',
    api: aiTokenPage,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'Tokens',
        type: 'slot',
        label: '文字内容生成数量（10万Token）',
        minWidth: 142
      }
    ],
    slotArr: ['Tokens']
  },
  AIA0002: {
    name: 'AI助手文字图片服务',
    api: chargesList,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'usedAmount',
        type: 'slot',
        label: '图片内容生成数量',
        minWidth: 142
      }
    ],
    slotArr: ['usedAmount']
  },
  LIV0001: {
    name: '私域',
    // name: '直播服务',
    api: usagelivePage,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'channelDesc',
        type: 'text',
        label: '订单渠道',
        minWidth: 142
      },
      {
        prop: 'orderNo',
        type: 'text',
        label: '订单号',
        minWidth: 142
      },
      {
        prop: 'payTime',
        type: 'text',
        label: '支付时间',
        minWidth: 142
      },
      {
        prop: 'payAmount',
        type: 'slot',
        label: '实付金额',
        minWidth: 142
      }
    ],
    slotArr: ['payAmount']
  },
  PUB0001: {
    name: '公域',
    // name: '直播服务',
    api: publicDomainPage,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'channelDesc',
        type: 'text',
        label: '订单渠道',
        minWidth: 142
      },
      {
        prop: 'orderNo',
        type: 'text',
        label: '订单号',
        minWidth: 142
      },
      {
        prop: 'payTime',
        type: 'text',
        label: '支付时间',
        minWidth: 142
      },
      {
        prop: 'payAmount',
        type: 'slot',
        label: '实付金额',
        minWidth: 142
      },
      {
        prop: 'decodeTime',
        type: 'text',
        label: '解密时间',
        minWidth: 142
      },
      {
        prop: 'performancePlatformDesc',
        type: 'text',
        label: '履约平台',
        minWidth: 142
      }
    ],
    slotArr: ['payAmount']
  },
  SAL0001: {
    name: '销售企微加微',
    api: saleFriendsRecord,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'followQwUserName',
        type: 'text',
        label: '企业微信名称',
        minWidth: 142
      },
      {
        prop: 'wechatNickName',
        type: 'text',
        label: '用户昵称',
        minWidth: 142
      },
      {
        prop: 'addQwTime',
        type: 'text',
        label: '添加成功时间',
        minWidth: 142
      }
    ]
  },
  WEC0001: {
    name: '企微会话存档服务费',
    api: qiweiCost(1),
    columns: otherColumns,
    slotArr: ['voucherUrl']
  },
  WEC0002: {
    name: '企微互通账号',
    api: qiweiCost(2),
    columns: otherColumns,
    slotArr: ['voucherUrl']
  },
  VMP0001: {
    name: '视频素材处理',
    api: videoMaterial,
    columns: [
      ...comColumns,
      {
        prop: 'type',
        type: 'slot',
        label: '类型',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'usageGb',
        type: 'slot',
        label: '使用数量(GB)',
        minWidth: 142
      }
      // {
      //   prop: 'provider',
      //   type: 'text',
      //   label: '服务商',
      //   minWidth: 100
      // }
    ],
    slotArr: ['type', 'usageGb']
  },
  CUSTOM: {
    name: '自定义收费项',
    api: custom,
    columns: [
      ...comColumns,
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'deliveryContent',
        type: 'multText',
        label: '收费项内容',
        minWidth: 200
      },
      {
        prop: 'openTime',
        type: 'text',
        label: '开通时间',
        minWidth: 142
      },
      {
        prop: 'confirmor',
        type: 'text',
        label: '机构确认人',
        minWidth: 142
      },
      {
        prop: 'voucherUrl',
        type: 'slot',
        label: '费用凭证',
        minWidth: 100
      }
    ],
    slotArr: ['voucherUrl']
  }
}

import { last } from 'lodash'

export const curwordOpts = {
  form: {
    ref: null,
    formData: {
      phone: '',
      teacherId: '',
      time: []
    },
    optionsObj: {
      status: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 }
      ],
      feedCode: []
    },
    operatorSpan: 6,
    fieldList: [
      {
        prop: 'time',
        label: '开播日期',
        cpn: 'el-date-picker',
        slotName: 'time',
        className: ['children-ml0']
      },
      {
        prop: 'phone',
        label: '手机号码',
        cpn: 'el-input',
        slotName: 'phone',
        className: ['children-ml0']
      }
    ]
  }
}

export const curwordRefundOpts = {
  form: {
    ref: null,
    formData: {
      userPhone: '',
      time: ['', '']
    },
    optionsObj: {
      status: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 }
      ],
      feedCode: []
    },
    operatorSpan: 6,
    fieldList: [
      {
        prop: 'time',
        label: '开播日期',
        cpn: 'el-date-picker',
        slotName: 'time',
        className: ['children-ml0']
      },
      {
        prop: 'phone',
        label: '手机号码',
        cpn: 'el-input',
        slotName: 'phone',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'id',
        type: 'text',
        label: '反馈ID'
      },
      {
        prop: 'userName',
        type: 'text',
        label: '用户昵称',
        minWidth: 142
      },
      {
        prop: 'phone',
        type: 'text',
        label: '手机号',
        minWidth: 142
      },
      {
        prop: 'feedName',
        type: 'text',
        label: '反馈类型',
        minWidth: 142
      },
      {
        prop: 'content',
        type: 'text',
        label: '反馈内容',
        minWidth: 142
      },
      {
        prop: 'picUrls',
        type: 'slot',
        label: '图片',
        minWidth: 200
      },
      {
        prop: 'createTime',
        type: 'text',
        label: '反馈时间',
        minWidth: 150
      },
      {
        prop: 'status',
        type: 'slot',
        label: '处理状态',
        minWidth: 142
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        minWidth: 142
      }
    ],
    slotArr: ['picUrls', 'action', 'status']
  }
}

export const refundOptsColumns = [
  {
    prop: 'userName',
    label: '学员姓名',
    type: 'slot'
  },
  {
    prop: 'phone',
    label: '手机号码',
    type: 'slot'
  },
  {
    prop: 'courseName',
    label: '退款商品',
    type: 'slot'
  },
  {
    prop: 'liveStartTime',
    label: '开播日期'
  },
  {
    prop: 'payAmount',
    label: '价格',
    type: 'slot'
  },
  {
    prop: 'refundAmount',
    label: '退款金额',
    type: 'slot'
  },
  {
    prop: 'orderNo',
    label: '订单',
    type: 'slot'
  },
  {
    prop: 'orderStatus',
    label: '订单状态',
    type: 'slot'
  },
  {
    prop: 'refundTime',
    label: '退款时间'
  }
]

export const curwordGmvOpts = {
  form: {
    ref: null,
    formData: {
      userPhone: '',
      time: ['', '']
    },
    optionsObj: {
      status: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 }
      ],
      feedCode: []
    },
    operatorSpan: 6,
    fieldList: [
      {
        prop: 'time',
        label: '开播日期',
        cpn: 'el-date-picker',
        slotName: 'time',
        className: ['children-ml0']
      },
      {
        prop: 'phone',
        label: '手机号码',
        cpn: 'el-input',
        slotName: 'phone',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'id',
        type: 'text',
        label: '反馈ID'
      },
      {
        prop: 'userName',
        type: 'text',
        label: '用户昵称',
        minWidth: 142
      },
      {
        prop: 'phone',
        type: 'text',
        label: '手机号',
        minWidth: 142
      },
      {
        prop: 'feedName',
        type: 'text',
        label: '反馈类型',
        minWidth: 142
      },
      {
        prop: 'content',
        type: 'text',
        label: '反馈内容',
        minWidth: 142
      },
      {
        prop: 'picUrls',
        type: 'slot',
        label: '图片',
        minWidth: 200
      },
      {
        prop: 'createTime',
        type: 'text',
        label: '反馈时间',
        minWidth: 150
      },
      {
        prop: 'status',
        type: 'slot',
        label: '处理状态',
        minWidth: 142
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        minWidth: 142
      }
    ],
    slotArr: ['picUrls', 'action', 'status']
  }
}

export const gmvColumns = [
  {
    prop: 'userName',
    label: '学员姓名',
    type: 'slot'
  },
  {
    prop: 'phone',
    label: '手机号码',
    type: 'slot'
  },
  {
    prop: 'orderChannel',
    label: '渠道',
    type: 'slot'
  },
  {
    prop: 'liveName',
    label: '直播间名称',
    type: 'slot'
  },
  {
    prop: 'liveStartTime',
    label: '开播日期'
  },
  {
    prop: 'scriptName',
    label: '备课内容名称',
    type: 'slot'
  },
  {
    prop: 'courseName',
    label: '课程名称',
    type: 'slot'
  },
  {
    prop: 'payAmount',
    label: '支付金额',
    type: 'slot'
  },
  {
    prop: 'orderNo',
    label: '订单号'
  },
  {
    prop: 'orderStatus',
    label: '订单状态',
    type: 'slot'
  },
  {
    prop: 'payTime',
    label: '支付时间'
  }
]

export const curwordEmployeeOpts = {
  form: {
    ref: null,
    formData: {
      userIdList: [],
      comparisonWay: 1,
      monthYear: '',
      deptId: '',
      sortBy: 2
    },
    optionsObj: {
      status: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 }
      ],
      feedCode: []
    },
    operatorSpan: 6,
    fieldList: [
      {
        prop: 'deptId',
        label: '部门',
        cpn: 'el-cascader',
        slotName: 'deptId',
        className: ['children-ml0']
      },
      {
        prop: 'userIdList',
        label: '员工',
        cpn: 'el-select',
        slotName: 'userIdList',
        className: ['children-ml0']
      },
      {
        prop: 'monthYear',
        label: '月份',
        cpn: 'el-date-picker',
        slotName: 'monthYear',
        /* bind: {
          type: 'month',
          clearable: false,
          valueFormat: 'yyyy-MM',
          rangeSeparator: '至',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期'
        },*/
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'id',
        type: 'text',
        label: '反馈ID'
      },
      {
        prop: 'userName',
        type: 'text',
        label: '用户昵称',
        minWidth: 142
      },
      {
        prop: 'phone',
        type: 'text',
        label: '手机号',
        minWidth: 142
      },
      {
        prop: 'feedName',
        type: 'text',
        label: '反馈类型',
        minWidth: 142
      },
      {
        prop: 'content',
        type: 'text',
        label: '反馈内容',
        minWidth: 142
      },
      {
        prop: 'picUrls',
        type: 'slot',
        label: '图片',
        minWidth: 200
      },
      {
        prop: 'createTime',
        type: 'text',
        label: '反馈时间',
        minWidth: 150
      },
      {
        prop: 'status',
        type: 'slot',
        label: '处理状态',
        minWidth: 142
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        minWidth: 142
      }
    ],
    slotArr: ['picUrls', 'action', 'status']
  }
}
export const columnsForRevenueClom = [
  {
    prop: 'userName',
    label: '学员姓名',
    type: 'slot'
  },
  {
    prop: 'phone',
    label: '手机号',
    type: 'slot'
  },
  {
    prop: 'orderChannel',
    label: '渠道',
    type: 'slot'
  },
  {
    prop: 'liveName',
    label: '直播间名称',
    type: 'slot'
  },
  {
    prop: 'liveStartTime',
    label: '开播日期'
  },
  {
    prop: 'scriptName',
    label: '备课内容名称',
    type: 'slot'
  },
  {
    prop: 'courseName',
    label: '课程名称'
  },
  {
    prop: 'payAmount',
    label: '支付金额',
    type: 'slot'
  },
  {
    prop: 'orderNo',
    label: '订单号',
    width: 160
  },
  {
    prop: 'payTime',
    label: '支付时间'
  }
]

export const columns = [
  {
    prop: 'tradeTime',
    label: '学员昵称'
  },
  {
    prop: 'paymentNo',
    label: '手机号码',
    type: 'slot'
  },
  {
    prop: 'inOutTypeName',
    label: '看播手机号'
  },
  {
    prop: 'bizType',
    label: '邮箱'
  },
  {
    prop: 'amount',
    label: '跟进人'
  },
  {
    prop: 'amountBefore',
    label: '任务名称'
  },
  {
    prop: 'orderNo',
    label: '导流订单状态'
  },
  {
    prop: 'refundNo',
    label: '是否到课'
  }
]

export const feesOptsLiveDataStatistics = {
  form: {
    ref: null,
    formData: {
      name: '',
      videoName: '',
      liveModel: '',
      feesType: '',
      ipType: 1,
      ipTeacherId: '',
      userIds: '',
      time: []
    },
    operatorSpan: 4,
    optionsObj: {
      feesType: [
        { label: '全部', value: '' },
        { label: '免费', value: 1 },
        { label: '付费', value: 2 }
      ],
      useOption: [
        { label: '真人IP', value: 1 },
        { label: '视频IP', value: 2 }
      ],
      liveModel: [
        { label: '全部', value: '' },
        { label: '真人直播', value: 'PERSON_LIVE' },
        { label: '数字直播', value: 'AI_LIVE' }
      ]
    },
    fieldList: [
      {
        prop: 'name',
        label: '直播间',
        cpn: 'el-input',
        className: ['children-ml0']
      },
      {
        prop: 'videoName',
        label: '课件名称',
        cpn: 'el-input',
        className: ['children-ml0']
      },
      {
        prop: 'liveModel',
        label: '直播模式',
        slotName: 'liveModel',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'feesType',
        label: '直播类型',
        slotName: 'feesType',
        className: ['children-ml0', 'not-bd']
      },
      {
        prop: 'ipTeacherId',
        label: '',
        slotName: 'ipTeacherId',
        className: ['children-ml0']
      },
      {
        prop: 'userIds',
        label: '邀请人',
        slotName: 'userIds',
        className: ['children-ml0']
      },
      {
        prop: 'time',
        label: '开播日期',
        cpn: 'el-date-picker',
        slotName: 'time',
        className: ['children-ml0']
      }
    ]
  }
}

export const liveDataStatisticTableFeers = [
  {
    prop: 'startTime',
    label: '直播日期',
    type: 'slot',
    width: 120
  },
  {
    prop: 'startTimeTime',
    label: '开播时间',
    type: 'slot'
  },
  {
    prop: 'name',
    label: '直播名称',
    width: 160,
    type: 'slot'
  },
  {
    prop: 'teachers',
    label: '邀请人',
    type: 'slot',
    width: 120
  },
  {
    prop: 'liveModel',
    label: '直播模式',
    type: 'slot'
  },
  {
    prop: 'videoName',
    label: '课件名称',
    width: 180,
    type: 'slot'
  },
  {
    prop: 'ipTeacherName',
    label: 'IP老师'
  },
  {
    prop: 'feesType',
    label: '类型',
    type: 'slot'
  },
  {
    prop: 'totalApplyCount',
    label: '总报名人数',
    width: 120,
    align: 'center'
  },
  {
    prop: 'totalCoursesCount',
    label: '总到课人数',
    width: 120,
    align: 'center'
  },
  {
    prop: 'totalOrderCount',
    label: '转化总订单数',
    width: 120,
    align: 'center'
  },
  {
    prop: 'price',
    label: '单价',
    align: 'center',
    type: 'slot'
  },
  {
    prop: 'gmv',
    label: '转化GMV',
    align: 'center',
    width: 120,
    type: 'slot'
  },
  {
    prop: 'totalRplCount',
    label: '到课RPL',
    align: 'center',
    type: 'slot'
  },
  {
    prop: 'attendTransRate',
    label: '到课转化率',
    width: 120,
    type: 'slot',
    align: 'center'
  }
]

export const formOptsDashBoardDataList = {
  form: {
    ref: null,
    formData: {
      deptId: '',
      clueTime: [],
      orderStatus: '',
      teacherIdList: [], // ip老师id集合
      clueRpl: [], // 线索id集合
      teacherName: '',
      orderPayTime: [],
      liveStartTime: [],
      goodsIdList: [] // 商品名称
    },
    operatorSpan: 24,
    optionsObj: {
      productCategory: [
        { label: '视频课', value: 0 },
        { label: '直播课', value: 1 },
        { label: '线下课', value: 2 }
      ],
      orderStatus: [
        { label: '支付成功', value: 2 },
        { label: '部分退款', value: 6 },
        { label: '全部退款', value: 7 }
      ],
      isAvailable: [
        { label: '有效', value: 0 },
        { label: '无效', value: 1 }
      ]
    },
    fieldList: [
      {
        prop: 'deptId',
        label: '跟进人部门',
        cpn: 'el-select',
        slotName: 'deptId',
        className: ['children-ml0']
      },
      {
        prop: 'clueTime',
        label: '线索分配日期',
        cpn: 'el-date-picker',
        slotName: 'clueTime',
        className: ['children-ml0']
      },
      {
        prop: 'orderStatus',
        label: '线索订单状态',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'isAvailable',
        label: '线索有效性',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'teacherIdList',
        label: '线索IP老师',
        slotName: 'teacherIdList',
        className: ['children-ml0']
      },
      {
        prop: 'productCategory',
        label: '线索商品类型',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'goodsIdList',
        label: '线索商品名称',
        slotName: 'goodsIdList',
        className: ['children-ml0']
      },
      {
        prop: 'liveStartTime',
        label: '直播开播日期',
        cpn: 'el-date-picker',
        slotName: 'liveStartTime',
        className: ['children-ml0']
      },
      {
        prop: 'taskIdList',
        label: '任务名称',
        slotName: 'taskIdList',
        className: ['children-ml0']
      },
      {
        prop: 'orderPayTime',
        label: '后转订单支付日期',
        cpn: 'el-date-picker',
        slotName: 'orderPayTime',
        className: ['children-ml0']
      }
    ]
  }
}

export const formOptsDashBoardTableFeers = [
  {
    prop: 'sysUserName',
    label: '跟进人'
  },
  {
    prop: 'clueNum',
    label: '线索量'
    // type: 'slot'
  },
  {
    prop: 'addWechatNum',
    label: '加微数'
  },
  {
    prop: 'addWechatRate',
    label: '加微率'
    // type: 'slot'
  },
  {
    prop: 'attendPeopleNum',
    label: '总到课'
    // type: 'slot'
  },
  {
    prop: 'attendPeopleOrderRate',
    label: '总到课率'
  },
  {
    prop: 'orderNum',
    label: '已付款订单数'
  },
  {
    prop: 'gmv',
    label: 'GMV'
    // slot: 'slot'
  },
  {
    prop: 'revenue',
    label: '营收'
  },
  {
    prop: 'attendPeopleOrderRate',
    label: '到课转化率'
  }
]

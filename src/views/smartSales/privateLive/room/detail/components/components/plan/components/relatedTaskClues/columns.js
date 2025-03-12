const columns = [
  {
    prop: 'userName',
    label: '学员昵称'
  },
  {
    prop: 'phone',
    label: '手机号码',
    type: 'slot'
  },
  {
    prop: 'watchLivePhonePhone',
    label: '看播手机号',
    type: 'slot'
  },
  {
    prop: 'email',
    type: 'slot',
    width: 200,
    label: '邮箱'
  },
  {
    prop: 'clueFollowUserName',
    label: '跟进人'
  },
  {
    prop: 'taskName',
    label: '任务名称'
  },
  {
    prop: 'orderStatus',
    type: 'slot',
    label: '导流订单状态'
  },
  {
    prop: 'isAttendance',
    type: 'slot',
    label: '是否到课'
  },
  {
    prop: 'callStatus',
    type: 'slot',
    label: '外呼结果'
  },
  {
    prop: 'operate',
    type: 'slot',
    label: '操作'
  }
]
const formConfig = {
  ref: null,
  formData: {
    clueFollowUserId: undefined, //  	跟进人
    // userName: undefined, //  	学员昵称
    // phone: undefined, //  	手机号
    isAttendance: 2, //  	是否到课
    keywordVal: undefined, //
    keyword: 'phone', //   学员昵称,手机号，邮箱
    taskName: undefined, //  	任务名称
    taskId: undefined,
    orderStatus: '', //  	订单状态
    channelId: ''
  },
  operatorSpan: 6,
  optionsObj: {
    isAttendance: [
      {
        value: 2,
        label: '全部'
      },
      {
        value: 1,
        label: '是'
      },
      {
        value: 0,
        label: '否'
      }
    ],
    // 1:未支付 2:支付成功 3:超时已关闭 4:用户已取消 5:退款中 6:部分退款 7:全部退款 8:交易结束 9:没有向第三方发起支付请求 10:退款金额异常
    orderStatus: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 1,
        label: '未支付'
      },
      {
        value: 2,
        label: '支付成功'
      },
      {
        value: 3,
        label: '超时已关闭'
      },
      {
        value: 4,
        label: '用户已取消'
      },
      {
        value: 5,
        label: '退款中'
      },
      {
        value: 6,
        label: '部分退款'
      },
      {
        value: 7,
        label: '全部退款'
      },
      {
        value: 8,
        label: '交易结束'
      },
      {
        value: 9,
        label: '没有向第三方发起支付请求'
      },
      {
        value: 10,
        label: '退款金额异常'
      }
    ],
    // 渠道 1:抖店 2:快手小店 4:微店 7:小鹅通 10:视频号小店 11:枫叶小店 12:抖音小程序 13:直播间 14:平台自营 15:微信小程序 16:小红书 17:线下录单 18:B站 20:百度小店
    channelId: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 1,
        label: '抖店'
      },
      {
        value: 2,
        label: '快手小店'
      },
      {
        value: 4,
        label: '微店'
      },
      {
        value: 7,
        label: '小鹅通'
      },
      {
        value: 10,
        label: '视频号小店'
      },
      {
        value: 11,
        label: '枫叶小店'
      },
      {
        value: 12,
        label: '抖音小程序'
      },
      {
        value: 13,
        label: '直播间'
      },
      {
        value: 14,
        label: '平台自营'
      },
      {
        value: 15,
        label: '微信小程序'
      },
      {
        value: 16,
        label: '小红书'
      },
      {
        value: 17,
        label: '线下录单'
      },
      {
        value: 18,
        label: 'B站'
      },
      {
        value: 20,
        label: '百度小店'
      }
    ]
  },
  fieldList: [
    {
      prop: 'clueFollowUserId',
      label: '跟进人',
      slotName: 'clueFollowUserId',
      className: ['children-ml0']
    },
    {
      prop: 'keyword',
      label: '',
      slotName: 'keyword',
      className: ['children-ml0']
    },
    {
      prop: 'isAttendance',
      label: '是否到课',
      cpn: 'el-select',
      bind: { clearable: false },
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'taskName',
      label: '任务名称',
      slotName: 'taskName'
    },
    {
      prop: 'orderStatus',
      label: '订单状态',
      cpn: 'el-select',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'channelId',
      label: '渠道来源',
      cpn: 'el-select',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }

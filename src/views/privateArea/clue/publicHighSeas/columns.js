import { clueTypeStatus } from '../columns'
const columns = [
  {
    fixed: true,
    attrs: {
      type: 'selection'
    }
  },
  {
    prop: 'phone',
    fixed: true,
    width: 200,
    type: 'slot',
    label: '学员电话'
  },
  {
    prop: 'email',
    label: '邮箱',
    type: 'slot',
    width: 180
  },
  {
    prop: 'wechatNickName',
    label: '微信昵称',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'remark',
    width: 120,
    label: '微信备注名',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'teacherNames',
    width: 180,
    label: 'IP',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'clueType',
    label: '线索类型'
  },
  {
    prop: 'orderNo',
    label: '订单号',
    width: 220
  },
  {
    prop: 'channelSourceName',
    label: '渠道',
    width: 180
  },
  {
    prop: 'orderStatusName',
    label: '订单状态'
  },
  {
    prop: 'createTime',
    label: '线索创建时间',
    width: 160,
    attrs: {
      sortable: 'custom'
    }
  },
  {
    prop: 'goodsName',
    label: '商品名称',
    width: 350,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'cluePersonTags',
    type: 'slot',
    width: 160,
    label: '个人标签',
    attrs: {
      'show-overflow-tooltip': true
    }
  }
]
const formConfig = {
  ref: null,
  formData: {
    slot1: 'phone',
    slot1Val: undefined,
    orderNo: undefined,
    time: undefined,
    tagName: undefined,
    clueType: undefined,
    teacherId: undefined,
    channelId: undefined,
    productCategory: undefined,
    goodsName: undefined,
    orderStatus: '',
    attribution: undefined
  },
  operatorSpan: 24,
  optionsObj: {
    clueType: [...clueTypeStatus],
    channelId: [
      { label: '抖店', value: 1 },
      { label: '快手', value: 2 },
      { label: '获课', value: 3 },
      { label: '微店', value: 4 },
      { label: '老用户', value: 5 },
      { label: '销售录入', value: 6 },
      { label: '小鹅通', value: 7 },
      { label: '博商', value: 8 },
      { label: '获客线下', value: 9 },
      { label: '视频号小店', value: 10 },
      { label: '枫页小店', value: 11 },
      { label: '抖音小程序', value: 12 },
      { label: '直播间', value: 13 },
      { label: '平台自营', value: 14 },
      { label: '微信小程序', value: 15 },
      { label: '百度小店', value: 20 }
    ],
    productCategory: [
      { value: 0, label: '视频课' },
      { value: 1, label: '直播课' },
      { value: 2, label: '线下课' }
    ],
    orderStatus: [
      { label: '全部', value: '' },
      { label: '未支付', value: 1 },
      { label: '支付成功', value: 2 },
      { label: '超时已关闭', value: 3 },
      { label: '用户已取消', value: 4 },
      { label: '退款中', value: 5 },
      { label: '部分退款', value: 6 },
      { label: '全部退款', value: 7 },
      { label: '交易结束', value: 8 },
      { label: '没有向第三方发起支付请求', value: 9 },
      { label: '退款金额异常', value: 10 },
      { label: '部分付款', value: 11 },
      { label: '转课关闭', value: 12 }
    ],
    attribution: [{ label: '首次进入未分配', value: 1 }]
  },
  fieldList: [
    {
      prop: 'orderNo',
      label: '订单号',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'slot1',
      slotName: 'slot1',
      className: ['children-ml0']
    },
    {
      prop: 'time',
      label: '创建时间',
      cpn: 'el-date-picker',
      eventHandler: {},
      bind: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '请输入',
        format: 'yyyy-MM-dd',
        'value-format': 'yyyy-MM-dd',
        endPlaceholder: '请输入'
      },
      className: ['children-ml0']
    },
    {
      prop: 'tagName',
      label: '标签',
      slotName: 'tagName',
      className: ['children-ml0']
    },
    {
      prop: 'clueType',
      label: '线索类型',
      cpn: 'el-select',
      placeholder: '请选择',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'teacherId',
      label: '来源IP',
      slotName: 'teacherId',
      className: ['children-ml0']
    },
    {
      prop: 'channelId',
      label: '渠道来源',
      slotName: 'channelId',
      className: ['children-ml0']
    },
    {
      prop: 'productCategory',
      label: '商品类型',
      cpn: 'el-select',
      placeholder: '请选择',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'goodsId',
      label: '商品名称',
      slotName: 'goodsId',
      className: ['children-ml0 ']
    },
    {
      prop: 'orderStatus',
      label: '订单状态',
      cpn: 'el-select',
      placeholder: '请选择',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'attribution',
      label: '归属公海',
      cpn: 'el-select',
      placeholder: '请选择',
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

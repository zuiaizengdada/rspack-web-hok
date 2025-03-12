import { getOptionsValue } from '@/filters/index'

// 线索类型
export const clueTypeStatus = [
  { label: '订单', value: 1 },
  { label: '线下表格', value: 2 },
  { label: '直播报名', value: 3 },
  { label: '信息流表单', value: 4 },
  { label: '信息流加微', value: 5 }
]

// 跟进人企微
export const followWechatStatus = [
  {
    label: '已加',
    value: 1,
    background: '#E6F7EA',
    color: '#00B42A',
    icon: 'audit_success'
  },
  {
    label: '未加',
    value: 0,
    background: '#F5F5F5',
    color: '#777777',
    icon: 'liveClose'
  }
]

// 跟进人个微信
export const followPrivateWechatStatus = [
  {
    label: '已加',
    value: 1,
    background: 'transparent',
    color: '#00B42A',
    icon: '个微已加'
  },
  {
    label: '未加',
    value: 0,
    background: 'transparent',
    color: '#777777',
    icon: '个微未加'
  }
]

// 跟进状态
export const followStatus = [
  { label: '已加个微待通过', value: 1 },
  { label: '不需要', value: 2 },
  { label: '在忙', value: 3 },
  { label: '未接', value: 4 },
  { label: '意向客户', value: 5 },
  { label: '未知', value: 6 },
  { label: '未接2', value: 7 },
  { label: '未接3', value: 8 },
  { label: '电话搜不到微信', value: 9 },
  { label: '已发短信', value: 10 }
]

export function getColumns(phoneAuthority) {
  return [
    {
      width: '200px',
      prop: 'phone',
      label: '学员电话',
      type: 'phone',
      visible: true,
      isPhone: true,
      phoneType: 'clue',
      copy: true
    },
    {
      prop: 'email',
      width: '165px',
      label: '邮箱',
      visible: true,
      isEmail: true,
      emailType: 'user'
    },
    {
      width: '160px',
      prop: 'country',
      label: '国家',
      type: 'text',
      visible: true
    },
    {
      width: '150px',
      prop: 'remark',
      label: '微信备注名',
      type: 'slot',
      visible: true
    },
    {
      width: '150px',
      prop: 'wechatNickName',
      label: '微信昵称',
      type: 'slot',
      visible: true
    },
    {
      width: '120px',
      prop: 'isAddQw',
      label: '添加跟进人企微',
      type: 'slot',
      visible: true
    },
    {
      width: '120px',
      prop: 'isAddGw',
      label: '添加跟进人个微',
      type: 'slot',
      visible: true
    },
    {
      width: '100px',
      prop: 'isSubscribe',
      label: '关注公众号',
      type: 'slot',
      visible: true
    },
    {
      width: '160px',
      prop: 'lastFollowTime',
      label: '最近跟进时间',
      type: 'text',
      visible: true
    },
    {
      width: '200px',
      prop: 'lastFollowRecordType',
      label: '跟进状态',
      type: 'slot',
      visible: true
    },
    {
      width: '200px',
      prop: 'lastFollowRecordContent',
      label: '最近跟进记录',
      type: 'slot',
      visible: true
    },
    {
      width: '200px',
      prop: 'personalTagList',
      label: '个人标签',
      type: 'slot',
      visible: true
    },
    {
      width: '200px',
      prop: 'externalUserTags',
      label: '企业标签',
      type: 'slot',
      visible: true
    },
    {
      width: '200px',
      prop: 'teacherNames',
      label: 'IP',
      type: 'text',
      visible: true
    },
    {
      width: '150px',
      prop: 'followUserName',
      label: '跟进人',
      type: 'text',
      visible: true
    },
    {
      width: '180px',
      prop: 'clueId',
      label: '线索ID',
      type: 'text',
      visible: true,
      slotFn: row => (row.clueType === 4 ? row.orderNo : '——')
    },
    {
      width: '100px',
      prop: 'isRepeatBuy',
      label: '重复购买',
      type: 'text',
      visible: true,
      slotFn: row => {
        if (row.clueType === 2) return '--'
        return row.repeatBuy ? '重复购买' : row.repeatBuy === 0 ? '非重复购买' : '--'
      }
    },
    {
      width: '150px',
      prop: 'clueType',
      label: '线索类型',
      type: 'text',
      render: row => {
        return getOptionsValue(row.clueType, clueTypeStatus)
      },
      visible: true
    },
    {
      width: '150px',
      prop: 'clueContent',
      label: '线索内容',
      type: 'text',
      visible: true
    },
    {
      width: '200px',
      prop: 'createTime',
      label: '分配时间',
      type: 'text',
      sortable: true,
      visible: true
    },
    {
      width: '200px',
      prop: 'firstFollowTime',
      label: '首次跟进时间',
      type: 'text',
      sortable: true,
      visible: true
    },
    {
      width: '200px',
      prop: 'orderNo',
      label: '订单号',
      type: 'text',
      visible: true,
      slotFn: row => (row.clueType !== 4 ? row.orderNo : '')
    },
    {
      width: '200px',
      prop: 'channelSourceName',
      label: '渠道',
      type: 'text',
      visible: true
    },
    {
      width: '100px',
      prop: 'orderStatusName',
      label: '订单状态',
      type: 'text',
      visible: true
    },
    {
      width: '150px',
      prop: 'payTime',
      label: '订单支付时间',
      type: 'text',
      sortable: true,
      visible: true
    },
    {
      width: '150px',
      prop: 'taskName',
      label: '任务名称',
      type: 'text',
      visible: true
    },
    {
      width: '350px',
      prop: 'goodsName',
      label: '商品名称',
      type: 'text',
      visible: true
    },
    {
      width: '160px',
      prop: 'addGwTime',
      label: '加个微时间',
      type: 'text',
      sortable: true,
      visible: true
    },
    {
      width: '160px',
      prop: 'addQwTime',
      label: '加企微时间',
      type: 'text',
      sortable: true,
      visible: true
    },
    {
      width: '300px',
      prop: 'livePhone',
      label: '直播手机号',
      type: 'phone',
      visible: phoneAuthority !== 'web:myClue:setPhone',
      isPhone: true,
      areaCodeKey: 'watchLivePhoneAreaCode',
      copy: true,
      setPhone: true,
      phoneAuthority,
      phoneType: 'clueLive'
    },
    {
      width: '120px',
      prop: 'isAvailable',
      label: '是否有效',
      type: 'slot',
      visible: phoneAuthority !== 'web:myClue:setPhone'
    },
    {
      width: '220px',
      prop: 'intentName',
      label: '线索意向',
      type: 'slot',
      visible: true
    },
    {
      width: '120px',
      prop: 'payerTotal',
      label: '支付金额',
      type: 'text',
      visible: true,
      slotFn: row => row?.payerTotal ? (row?.payerTotal / 100)?.toFixed(2) : '--'
    },
    {
      width: '120px',
      prop: 'goodsPrices',
      label: '商品金额',
      type: 'text',
      visible: true,
      slotFn: row => row?.goodsPrices ? (row?.goodsPrices / 100)?.toFixed(2) : '--'
    },
    {
      width: '200px',
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      disable: true
    }
  ]
}

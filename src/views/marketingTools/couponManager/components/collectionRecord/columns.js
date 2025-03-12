const columns = [
  {
    prop: 'nickName',
    label: '用户昵称'
  },
  {
    prop: 'phone',
    label: '手机号码',
    width: 160,
    type: 'slot'
  },
  {
    prop: 'email',
    type: 'slot',
    width: 230,
    label: '邮箱'
  },
  {
    prop: 'inviteUser',
    label: '邀请人'
  },
  {
    prop: 'claimTime',
    width: 160,
    label: '领取时间'
  },
  {
    prop: 'couponStatusName',
    label: '使用状态'
  },
  {
    prop: 'couponNo',
    label: '优惠券ID'
  },
  {
    prop: 'userCouponNo',
    label: '用户优惠券编码',
    width: 160
  },
  {
    prop: 'couponTypeName',
    label: '券类型'
  },
  {
    prop: 'writeOffBizNo',
    label: '订单号'
  }
]
const formConfig = {
  ref: null,
  formData: {
    inviteUser: undefined, // 邀请人
    keywordVal: undefined, //
    keyword: 'phone', //   学员昵称,手机号，邮箱
    couponStatus: undefined
  },
  operatorSpan: 6,
  optionsObj: {
    // 使用状态(1:待开始，2:生效中，3:已过期，4:已作废)
    couponStatus: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 1,
        label: '待核销'
      },
      {
        value: 2,
        label: '已锁定'
      },
      {
        value: 3,
        label: '已核销'
      },
      {
        value: 4,
        label: '已作废'
      }
    ]
  },
  fieldList: [
    {
      prop: 'keyword',
      label: '',
      slotName: 'keyword',
      className: ['children-ml0']
    },
    {
      prop: 'couponStatus',
      label: '使用状态',
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
      prop: 'inviteUser',
      label: '邀请人',
      cpn: 'el-input',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }

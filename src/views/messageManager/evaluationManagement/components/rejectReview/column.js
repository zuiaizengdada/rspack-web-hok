export function getColumns() {
  return [
    {
      prop: 'goodsName',
      label: '课程名称',
      type: 'slot',
      width: 280
    },
    {
      prop: 'phone',
      label: '用户手机号码',
      type: 'slot',
      width: 220
    },
    {
      prop: 'email',
      width: '220px',
      label: '用户邮箱',
      visible: true,
      isEmail: true,
      emailType: 'user'
    },
    {
      prop: 'orderNo',
      label: '订单号',
      type: 'slot',
      width: 220
    },
    {
      prop: 'level',
      label: '评价等级',
      type: 'slot'
    },
    {
      prop: 'markContent',
      label: '评价内容',
      type: 'slot',
      width: 180
    },
    {
      prop: 'imgNum',
      label: '图片数量',
      type: 'slot'
    },
    {
      prop: 'createAt',
      label: '创建时间',
      type: 'text',
      width: 160
    },
    {
      prop: 'auditorName',
      label: '审核人',
      type: 'text'
    },
    {
      prop: 'auditorTime',
      label: '审核时间',
      type: 'text',
      width: 160
    },
    {
      prop: 'action',
      width: 240,
      label: '操作',
      fixed: 'right',
      type: 'slot',
      visible: true
    }
  ]
}

const columns = [
  {
    prop: 'settleTime',
    label: '结算日期',
    fixed: 'left',
    width: 100
  },
  {
    prop: 'settleNo',
    label: '结算单号',
    fixed: 'left',
    width: 100
  },

  {
    prop: 'channelName',
    label: '渠道',
    fixed: 'left',
    width: 100
  },
  {
    prop: 'thirdShopName',
    label: '店铺名',
    width: 100
  },
  // {
  //   prop: 'productName',
  //   label: '商品名称',
  //   width: 140
  // },
  {
    prop: 'orderNo',
    label: '订单号',
    type: 'slot',
    width: 120
  },
  {
    prop: 'paymentNo',
    label: '支付单号',
    width: 100
  },
  {
    prop: 'refundNo',
    label: '退款单号',
    width: 120
  },
  {
    prop: 'payTime',
    label: '订单支付时间',
    width: 140,
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content:
                '订单支付时问，当订单类型为部分退款时则为订单退款完成时问',
              placement: 'top',
              effect: 'dark'
            }
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: {
                marginLeft: '5px'
              }
            })
          ]
        )
      ])
    }
  },
  {
    prop: 'orderStatusName',
    label: '订单状态',
    width: 100
  },
  {
    prop: 'settleStatusName',
    label: '结算状态',
    width: 100
  },
  {
    prop: 'settleTypeName',
    label: '结算类型',
    width: 100
  },
  {
    prop: 'orderAmount',
    label: '订单金额（元）',
    width: 120
  },
  {
    prop: 'realPayAmount',
    label: '支付金额(元) ',
    width: 140,
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '订单扣除卡券、优惠券后的支付金额',
              placement: 'top',
              effect: 'dark'
            }
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: {
                marginLeft: '5px'
              }
            })
          ]
        )
      ])
    }
  },
  {
    prop: 'refundAmount',
    label: '退款金额(元)',
    width: 140,
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '订单退款成功的金额',
              placement: 'top',
              effect: 'dark'
            }
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: {
                marginLeft: '5px'
              }
            })
          ]
        )
      ])
    }
  },
  {
    prop: 'payFeeRate',
    label: '支付手续费(元)',
    width: 140,
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content:
                '支付手续费为支付金额/退款金额*手续费率，当订单类型为部分退款时则表示退回商家的手续费',
              placement: 'top',
              effect: 'dark'
            }
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: {
                marginLeft: '5px'
              }
            })
          ]
        )
      ])
    }
  },
  {
    prop: 'settleAmount',
    label: '结算金额(元)',
    width: 150
  },
  {
    prop: 'settleAccountTypeName',
    label: '结算账户',
    width: 140,
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content:
                '银行账户即为商户的对公银行账户，保证金账户用于补缴保证金与结算后退款订单抵扣',
              placement: 'top',
              effect: 'dark'
            }
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: {
                marginLeft: '5px'
              }
            })
          ]
        )
      ])
    }
  },
  {
    prop: 'remark',
    label: '备注',
    width: 120
  }
]
export { columns }

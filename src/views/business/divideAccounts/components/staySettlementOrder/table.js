const columns = [
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
    fixed: 'left',
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
    label: '预计结算金额(元)',
    width: 150,
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '预计商家收到的结算金额实际结算金额请以已结算订单为准',
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
    prop: 'settleTime',
    label: '预计结算日期',
    width: 140,
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '已支付订单7天后结算;产生部分退款的订单隔天结算',
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
  }
]
export { columns }

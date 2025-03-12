const initNum = num => {
  return `${(num / 100 || 0).toFixed(2)}`
}
const getColumns = [
  {
    width: '150px',
    prop: 'followDeptName',
    label: '部门',
    type: 'text',
    visible: true,
    disable: true,
    'show-overflow-tooltip': true
  },
  {
    width: '90px',
    prop: 'followUserName',
    label: '姓名',
    visible: true,
    'show-overflow-tooltip': true
  },
  {
    width: '160px',
    prop: 'clueNum',
    label: '分配线索数',
    type: 'slot',
    sortable: 'custom',
    headTip: '查询条件内的分配线索数量',
    visible: true,
    slotFn: row => {
      return row.clueNum || 0
    }
  },
  {
    width: '180px',
    prop: 'outBoundNum',
    label: 'AI外呼触达线索数',
    headTip: '分配的线索中成功AI外呼的线索数，同一个线索只统计一次',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.outBoundNum || 0
    }
  },
  {
    width: '150px',
    prop: 'callCompletingRate',
    label: 'AI外呼接通率',
    headTip: 'AI外呼触达线索数/分配线索数*100%',
    type: 'text',
    visible: true,
    slotFn: row => {
      return `${row.callCompletingRate || 0}%`
    }
  },
  {
    width: '170px',
    prop: 'callTotalDuration',
    label: 'AI外呼接通时长',
    headTip: '按分配的线索时间段内ai外呼计费总时长',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return `${Math.ceil(row.callTotalDuration / 60) || 0}分钟`
    }
  },
  {
    width: '190px',
    prop: 'manualOutBoundNum',
    label: '人工外呼触达线索数',
    headTip: '分配的线索中成功人工外呼的线索数，同一个线索只统计一次',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.manualOutBoundNum || 0
    }
  },
  {
    width: '150px',
    prop: 'manualOutBoundRate',
    label: '人工外呼接通率',
    headTip: '人工外呼触达线索数/分配线索数*100%',
    type: 'text',
    visible: true,
    slotFn: row => {
      return `${row.manualOutBoundRate || 0}%`
    }
  },
  {
    prop: 'manualOutBoundCallDuration',
    width: 180,
    label: '人工外呼接通时长',
    headTip: '按分配的线索时间段内人工外呼计费总时长',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return `${row.manualOutBoundCallDuration || 0}分钟`
    }
  },
  {
    prop: 'sendSmsNum',
    width: 180,
    label: '短信触达线索数',
    type: 'text',
    headTip: '分配的线索中成功发送短信的线索数，同一个线索只统计一次，含送达和未知状态',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.sendSmsNum || 0
    }
  },
  {
    prop: 'addQwNum',
    width: 160,
    label: '自动添加企微数',
    type: 'text',
    headTip: '分配的线索中通过系统自动加上企微的线索数，同一个线索只统计一次',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.addQwNum || 0
    }
  },
  {
    prop: 'addQwRate',
    width: 160,
    label: '自动加微率',
    headTip: '自动加微线索数/分配线索数*100%',
    type: 'text',
    visible: true,
    slotFn: row => {
      return `${row.addQwRate || 0}%`
    }
  },
  {
    prop: 'manualAddQwNum',
    width: 160,
    label: '手动加微数',
    type: 'text',
    headTip: '分配的线索中非系统自动加上企微的线索数，同一个线索只统计一次',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.manualAddQwNum || 0
    }
  },
  {
    prop: 'manualAddQwRate',
    width: 160,
    label: '手动加微率',
    type: 'text',
    headTip: '手动加微线索数/分配线索数*100%',
    visible: true,
    slotFn: row => {
      return `${row.manualAddQwRate || 0}%`
    }
  },
  {
    prop: 'sumAddQwNum',
    width: 160,
    label: '总加企微数',
    type: 'text',
    headTip: '分配的线索中成功加上企微的线索数，同一个线索只统计一次',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.sumAddQwNum || 0
    }
  },
  {
    prop: 'sumAddQwRate',
    width: 160,
    label: '总企微加微率',
    type: 'text',
    headTip: '加微线索数/分配线索数*100%',
    visible: true,
    slotFn: row => {
      return `${row.sumAddQwRate || 0}%`
    }
  },
  {
    prop: 'addGwNum',
    width: 160,
    label: '个微加微数',
    headTip: '分配的线索中成功加上个微的线索数，同一个线索只统计一次',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.addGwNum || 0
    }
  },
  {
    prop: 'addGwRate',
    width: 160,
    label: '个微加微率',
    headTip: '个微加微数/分配线索数*100%',
    type: 'text',
    visible: true,
    slotFn: row => {
      return `${row.addGwRate || 0}%`
    }
  },
  {
    prop: 'addWxNum',
    width: 160,
    label: '总加微数',
    headTip: '分配的线索中成功加上企微或者个位的线索数，同一个线索只统计一次',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.addWxNum || 0
    }
  },
  {
    prop: 'addWxRate',
    width: 160,
    label: '总加微率',
    type: 'text',
    headTip: '总加微数/分配线索数*100%',
    visible: true,
    slotFn: row => {
      return `${row.addWxRate || 0}%`
    }
  },
  {
    prop: 'addInvitationsNum',
    width: 160,
    label: '邀约数',
    type: 'text',
    headTip: '分配的线索中在分配时间后有被邀约到直播间，进入多个直播间均算1',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.addInvitationsNum || 0
    }
  },
  {
    prop: 'addInvitationsRate',
    width: 160,
    label: '邀约率',
    type: 'text',
    headTip: '邀约数/分配线索数*100%',
    visible: true,
    slotFn: row => {
      return `${row.addInvitationsRate || 0}%`
    }
  },
  {
    prop: 'coursesNum',
    width: 160,
    label: '到课数',
    headTip: '分配的线索中，线索创建时间后产生过到课记录，一个线索算1次',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.coursesNum || 0
    }
  },
  {
    prop: 'coursesRate',
    width: 160,
    label: '到课率',
    headTip: '到课数/邀约数*100%',
    type: 'text',
    visible: true,
    slotFn: row => {
      return `${row.coursesRate || 0}%`
    }
  },
  {
    prop: 'refundNum',
    width: 160,
    label: '线索退款订单数',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.refundNum || 0
    }
  },
  {
    prop: 'refundRatio',
    width: 160,
    label: '线索退款率',
    type: 'text',
    visible: true,
    slotFn: row => {
      return `${row.refundRatio || 0}%`
    }
  },
  {
    prop: 'convertedOrdersNum',
    width: 160,
    label: '转化订单数',
    headTip: '分配的线索中，线索创建时间后产生的所有已支付订单数',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.convertedOrdersNum || 0
    }
  },
  {
    prop: 'coursesConvertedRate',
    width: 160,
    label: '到课转化率',
    headTip: '线索转化订单数/到课线索数*100%',
    type: 'text',
    visible: true,
    slotFn: row => {
      return `${row.coursesConvertedRate || 0}%`
    }
  },
  {
    prop: 'convertedOrdersRate',
    width: 160,
    label: '线索转化率',
    headTip: '线索转化订单数/分配线索数*100%',
    type: 'text',
    visible: true,
    slotFn: row => {
      return `${row.convertedOrdersRate || 0}%`
    }
  },
  {
    prop: 'conversionAmount',
    width: 170,
    label: '订单金额(GMV)',
    headTip: '分配的线索中，线索创建时间后产生的所有已支付订单金额',
    type: 'text',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return initNum(row.conversionAmount)
    }
  },
  {
    prop: 'refundAmount',
    width: 160,
    label: '转化退款金额',
    headTip: '分配的线索中，线索创建时间后产生的所有退款金额',
    type: 'text',
    visible: true,
    slotFn: row => {
      return initNum(row.refundAmount)
    }
  },
  {
    prop: 'revenueAmount',
    width: 160,
    label: '营收金额',
    headTip: '订单金额-转化退款金额',
    type: 'text',
    visible: true,
    slotFn: row => {
      return initNum(row.revenueAmount)
    }
  },
  {
    prop: 'perCapitaConversion',
    width: 160,
    label: 'RPL(人均转化)',
    headTip: 'RPL=订单金额(GMV)/分配线索数',
    type: 'text',
    visible: true,
    slotFn: row => {
      return row.perCapitaConversion.toFixed(2)
    }
  }
]

const getColumnsOne = [
  {
    minWidth: '150px',
    prop: 'followDeptName',
    label: '部门',
    type: 'text',
    visible: true,
    disable: true,
    'show-overflow-tooltip': true
  },
  {
    minWidth: '90px',
    prop: 'followUserName',
    label: '姓名',
    visible: true,
    'show-overflow-tooltip': true
  },
  {
    minWidth: '140px',
    prop: 'clueNum',
    label: '分配线索数',
    type: 'slot',
    sortable: 'custom',
    headTip: '选择时间段内分配的新线索数',
    visible: true,
    slotFn: row => {
      return row.clueNum || 0
    }
  },
  {
    prop: 'convertedOrdersNum',
    minWidth: 160,
    label: '转化订单数',
    type: 'text',
    headTip: '选择时间段内支付的订单数，并且招生老师是认领到私域班主任名下',
    sortable: 'custom',
    visible: true,
    slotFn: row => {
      return row.convertedOrdersNum || 0
    }
  },
  {
    prop: 'conversionAmount',
    minWidth: 170,
    label: '订单金额(GMV)',
    type: 'text',
    sortable: 'custom',
    headTip: '选择时间段内支付的订单金额，并且招生老师是认领到私域班主任名下',
    visible: true,
    slotFn: row => {
      return initNum(row.conversionAmount)
    }
  },
  {
    prop: 'refundAmount',
    minWidth: 160,
    label: '转化退款金额',
    headTip: '选择时间段内的退款金额，并且招生老师是认领到私域班主任名下',
    type: 'text',
    visible: true,
    slotFn: row => {
      return initNum(row.refundAmount)
    }
  },
  {
    prop: 'revenueAmount',
    minWidth: 160,
    label: '营收金额',
    type: 'text',
    headTip: '订单金额-转化退款金额，并且招生老师是认领到私域班主任名下',
    visible: true,
    slotFn: row => {
      return initNum(row.revenueAmount)
    }
  },
  {
    prop: 'perCapitaConversion',
    minWidth: 160,
    label: 'RPL(人均转化)',
    type: 'text',
    headTip: '订单金额/分配线索数',
    visible: true,
    slotFn: row => {
      return row.perCapitaConversion.toFixed(2)
    }
  }
]
export { getColumns, getColumnsOne }

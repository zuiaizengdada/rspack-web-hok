import { filtersMoneyByZero } from '@/filters/index'
export const deliveryStatus = {
  1: '待交付',
  2: '交付中',
  3: '延期交付',
  4: '锁定交付',
  5: '已交付',
  6: '已关闭'
}

// 转课状态
export const shiftStatus = {
  1: '未转课',
  2: '部分转课',
  3: '已转课'
}

// 跟进状态
export const dictStatus = {
  1: '待定',
  2: '确定不来',
  3: '确定来',
  4: '未接电话'
}

// 订单状态
export const orderType = {
  1: '新购',
  2: '赠送',
  3: '转课'
}

export function getColumns() {
  return [
    {
      fixed: 'left',
      width: '50px',
      prop: 'index',
      label: '序号',
      type: 'text',
      visible: true,
      disable: true
    },
    {
      fixed: 'left',
      'min-width': '120px',
      prop: 'userName',
      label: '学员姓名',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true,
      disable: true
    },
    {
      prop: 'userPhone',
      width: '170px',
      label: '学员电话',
      visible: true,
      isPhone: true,
      phoneType: 'user'
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
      prop: 'lecturerNameList',
      width: '120px',
      label: 'IP',
      type: 'text',
      'show-overflow-tooltip': true,
      slotFn: (row) => {
        if (row.lecturerNameList && row.lecturerNameList.length > 0) {
          return row.lecturerNameList.join(',')
        } else {
          return '--'
        }
      },
      visible: true
    },
    {
      prop: 'deliveryStatusName',
      width: '150px',
      label: '交付状态',
      type: 'slot',
      visible: true
    },
    {
      prop: 'goodsName',
      width: '250px',
      label: '课程名称',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'goodsTotalFee',
      width: '120px',
      label: '课程金额(元)',
      type: 'text',
      visible: true,
      slotFn: (row) => { return filtersMoneyByZero(row.goodsTotalFee) }
    },
    {
      prop: 'orderTypeName',
      width: '80px',
      label: '订单类型',
      type: 'text',
      visible: true
    },
    // {
    //   prop: 'viewTime',
    //   width: '120px',
    //   label: '累计观看时长',
    //   type: 'text',
    //   visible: true,
    //   slotFn: (row) => {
    //     if (row.goodsType === 5 && !row.viewTime) {
    //       return ''
    //     }
    //     return filterTime(row.viewTime)
    //   }
    // },
    {
      prop: 'channelSourceName',
      label: '渠道来源',
      type: 'text',
      visible: true
    },
    {
      prop: 'enrollmentUserName',
      label: '招生老师',
      type: 'text',
      visible: true
    },
    {
      prop: 'enrollmentDeptName',
      label: '招生部门',
      type: 'text',
      visible: true
    },
    {
      prop: 'saleUserName',
      label: '销售跟进人员',
      type: 'text',
      width: 150,
      visible: true
    },
    {
      prop: 'balanceFee',
      width: '120px',
      label: '订单余额(元)',
      type: 'text',
      visible: true,
      slotFn: (row) => { return filtersMoneyByZero(row.balanceFee) }
    },
    {
      prop: 'discountsFee',
      width: '120px',
      label: '优惠金额(元)',
      type: 'text',
      visible: true,
      slotFn: (row) => { return filtersMoneyByZero(row.discountsFee) }
    },
    {
      prop: 'deliveryNo',
      width: '220px',
      label: '交付单号',
      type: 'text',
      visible: true
    },
    {
      prop: 'deliveryTime',
      width: '180px',
      label: '交付日期',
      type: 'text',
      visible: true
    },
    {
      prop: 'orderNo',
      width: '220px',
      label: '订单号',
      type: 'text',
      visible: true
    },
    {
      prop: 'orderCreateTime',
      width: '190px',
      label: '订单创建时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'remark',
      width: '120px',
      'show-overflow-tooltip': true,
      label: '备注',
      type: 'text',
      visible: true
    },
    // {
    //   prop: 'watchClassPermission',
    //   width: '80px',
    //   label: '看课权限',
    //   type: 'text',
    //   visible: false,
    //   slotFn: (row) => {
    //     return row.watchClassPermission === 1 ? '开启' : '关闭'
    //   }
    // },
    {
      prop: 'effectiveTime',
      width: '180px',
      label: '生效日期',
      type: 'text',
      visible: true
    },
    {
      prop: 'failureTime',
      width: '180px',
      label: '失效日期',
      type: 'text',
      visible: true
    },
    {
      prop: 'userId',
      width: '280px',
      label: '用户ID',
      type: 'text',
      visible: true
    },
    {
      fixed: 'right',
      visible: true,
      width: '310px',
      prop: 'action',
      disable: true,
      label: '操作',
      type: 'slot'
    }
  ]
}

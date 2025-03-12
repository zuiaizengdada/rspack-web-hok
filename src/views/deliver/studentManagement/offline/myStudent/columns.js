import { filterTime, filtersMoneyByZero } from '@/filters/index'
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
      disable: true,
      'show-overflow-tooltip': true
    },
    {
      disable: true,
      'min-width': '120px',
      fixed: 'left',
      prop: 'userName',
      label: '学员姓名',
      type: 'slot',
      'show-overflow-tooltip': true,
      visible: true
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
      width: '180px',
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
      prop: 'goodsName',
      width: '250px',
      label: '课程名称',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'isPackage',
      label: '是否套餐课',
      type: 'text',
      width: '120px',
      'show-overflow-tooltip': true,
      slotFn: (row) => {
        return row.isPackage ? '是' : '否'
      },
      visible: true
    },
    {
      prop: 'packageGoodsName',
      label: '关联套餐课名称',
      width: '180px',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'scheduleNum',
      width: '200px',
      label: '班期',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true
    },
    {
      prop: 'saleUserName',
      width: '150px',
      label: '销售跟进人员',
      type: 'text'
    },
    {
      prop: 'courseWorkStatus',
      label: '作业状态',
      type: 'slot',
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
      prop: 'remark',
      width: '120px',
      'show-overflow-tooltip': true,
      label: '备注',
      type: 'text',
      visible: true
    },
    {
      prop: 'orderTypeName',
      width: '120px',
      label: '订单类型',
      type: 'text',
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
      prop: 'viewTime',
      width: '120px',
      label: '累计观看时长',
      type: 'text',
      visible: true,
      slotFn: (row) => {
        if (row.goodsType === 5 && !row.viewTime) {
          return ''
        }
        return filterTime(row.viewTime)
      }
    },
    {
      prop: 'sessionCount',
      label: '场次',
      type: 'text',
      visible: true,
      slotFn: (row) => {
        return row.scheduleNum ? row.sessionCount : ''
      }
    },
    {
      prop: 'signedCount',
      width: '120px',
      label: '已签到次数',
      type: 'slot',
      visible: true
    },
    {
      prop: 'channelSourceName',
      label: '渠道来源',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'enrollmentUserName',
      label: '招生老师',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'enrollmentDeptName',
      label: '招生部门',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'headteacherUserName',
      label: '班主任',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'assistantUserName',
      label: '助教',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'largePFlag',
      width: '120px',
      label: '来源大6P',
      type: 'text',
      visible: true,
      slotFn: (row) => {
        return row.largePFlag === 1 ? '是' : '否'
      }
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
      prop: 'orderNo',
      width: '220px',
      label: '订单号',
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
      prop: 'shiftStatusName',
      width: '180px',
      label: '转课状态',
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
      prop: 'statusName',
      width: '190px',
      label: '跟进状态',
      type: 'text',
      visible: true
    },
    {
      prop: 'content',
      width: '190px',
      label: '跟进内容',
      type: 'text',
      visible: true
    },
    {
      width: '240px',
      visible: true,
      disable: true,
      fixed: 'right',
      prop: 'action',
      label: '操作',
      type: 'slot'
    }
  ]
}

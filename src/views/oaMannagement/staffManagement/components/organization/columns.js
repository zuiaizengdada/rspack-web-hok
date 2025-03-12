import moment from 'moment'
import { flieType, departureTypeOption } from '../../options'

import {
  convertWorkExperience,
  toFixedTwo
} from '@/views/oaMannagement/utils/common'

export function getColunmsAll() {
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
      prop: 'jobNumber',
      label: '工号',
      type: 'text',
      visible: true,
      width: '140',
      fixed: 'left'
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'text',
      visible: true,
      width: '140',
      fixed: 'left'
    },
    {
      prop: 'companyName',
      label: '入职公司',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'deptChainName',
      label: '部门',
      type: 'text',
      visible: true,
      width: '250'
    },
    {
      prop: 'positionName',
      label: '岗位',
      type: 'text',
      visible: true,
      width: '120'
    },

    {
      prop: 'entryDate',
      label: '入职时间',
      type: 'text',
      visible: true,
      width: '180',
      render: row =>
        row.entryDate ? moment(row.entryDate).format('YYYY-MM-DD') : '',
      sortable: 'custom'
    },
    {
      prop: 'workAge',
      label: '工龄',
      type: 'text',
      visible: true,
      width: '180',
      render: row => convertWorkExperience(row.workAge)
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      minWidth: 200
    }
  ]
}
export function getColunmsProbation() {
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
      prop: 'jobNumber',
      label: '工号',
      type: 'text',
      visible: true,
      width: '140',
      fixed: 'left'
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'text',
      visible: true,
      width: '160',
      fixed: 'left'
    },
    {
      prop: 'companyName',
      label: '入职公司',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'deptChainName',
      label: '部门',
      type: 'text',
      visible: true,
      width: '250'
    },
    {
      prop: 'positionName',
      label: '岗位',
      type: 'text',
      visible: true,
      width: '120'
    },

    {
      prop: 'entryDate',
      label: '入职时间',
      type: 'text',
      visible: true,
      width: '180',
      render: row =>
        row.entryDate ? moment(row.entryDate).format('YYYY-MM-DD') : '',
      sortable: 'custom'
    },
    {
      prop: 'probationPeriod',
      label: '试用期时长（月）',
      type: 'text',
      visible: true,
      width: '180'
    },
    {
      prop: 'trialCountdown',
      label: '试用期倒计时（天）',
      type: 'text',
      visible: true,
      width: '180',
      render: row => Math.abs(row.trialCountdown)
    },
    {
      prop: 'expectedRegularDate',
      label: '预计转正时间',
      type: 'text',
      visible: true,
      width: '180',
      render: row =>
        row.expectedRegularDate
          ? moment(row.expectedRegularDate).format('YYYY-MM-DD')
          : ''
    },
    {
      prop: 'agreedRegularSalary',
      label: '约定转正薪资（元）',
      type: 'text',
      visible: true,
      width: '180',
      render: row => toFixedTwo(row.agreedRegularSalary)
    },
    // {
    //   prop: 'workAge',
    //   label: '工龄',
    //   type: 'text',
    //   visible: true,
    //   width: '180'
    // },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      minWidth: 200
    }
  ]
}
export function getColunmsRegular() {
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
      prop: 'jobNumber',
      label: '工号',
      type: 'text',
      visible: true,
      width: '140',
      fixed: 'left'
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'text',
      visible: true,
      width: '160',
      fixed: 'left'
    },
    {
      prop: 'companyName',
      label: '入职公司',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'deptChainName',
      label: '部门',
      type: 'text',
      visible: true,
      width: '250'
    },
    {
      prop: 'positionName',
      label: '岗位',
      type: 'text',
      visible: true,
      width: '120'
    },
    {
      prop: 'workAge',
      label: '工龄',
      type: 'text',
      visible: true,
      width: '180',
      render: row => convertWorkExperience(row.workAge)
    },
    {
      prop: 'entryDate',
      label: '入职时间',
      type: 'text',
      visible: true,
      width: '180',
      render: row =>
        row.entryDate ? moment(row.entryDate).format('YYYY-MM-DD') : '',
      sortable: 'custom'
    },
    {
      prop: 'regularTime',
      label: '转正时间',
      type: 'text',
      visible: true,
      width: '180',
      render: row =>
        row.regularTime ? moment(row.regularTime).format('YYYY-MM-DD') : '',
      sortable: 'custom'
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      minWidth: 200
    }
  ]
}
export function getColunmsQuit() {
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
      prop: 'jobNumber',
      label: '工号',
      type: 'text',
      visible: true,
      width: '140',
      fixed: 'left'
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'text',
      visible: true,
      width: '140',
      fixed: 'left'
    },
    {
      prop: 'companyName',
      label: '入职公司',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'deptChainName',
      label: '部门',
      type: 'text',
      visible: true,
      width: '250'
    },
    {
      prop: 'positionName',
      label: '岗位',
      type: 'text',
      visible: true,
      width: '120'
    },
    {
      prop: 'workAge',
      label: '在职时长（年）',
      type: 'text',
      visible: true,
      width: '160',
      render: row => (row.workAge / 12).toFixed(1)
    },
    {
      prop: 'entryDate',
      label: '入职时间',
      type: 'text',
      visible: true,
      width: '160',
      render: row =>
        row.entryDate ? moment(row.entryDate).format('YYYY-MM-DD') : '',
      sortable: 'custom'
    },
    {
      prop: 'departureDate',
      label: '离职时间',
      type: 'text',
      visible: true,
      width: '160',
      render: row =>
        row.departureDate ? moment(row.departureDate).format('YYYY-MM-DD') : '',
      sortable: 'custom'
    },
    {
      prop: 'departureType',
      label: '离职方式',
      type: 'text',
      visible: true,
      width: '160',
      render: row =>
        departureTypeOption.find(option => option.value === row.departureType)
          ?.label
    },
    {
      prop: 'departureReason',
      label: '离职原因',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      minWidth: 200
    }
  ]
}
export function getColunmsReview() {
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
      prop: 'name',
      label: '姓名',
      type: 'text',
      visible: true,
      width: '140',
      fixed: 'left'
    },
    {
      prop: 'contractNum',
      label: '合同协议数',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'companyRegulationNum',
      label: '公司制度数',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'waitForApprovalNum',
      label: '待审核数',
      type: 'slot',
      visible: true,
      width: '120'
    },
    {
      prop: 'waitForSealNum',
      label: '待落章数',
      type: 'slot',
      visible: true,
      width: '120'
    },
    {
      prop: 'companyName',
      label: '入职公司',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'deptChainName',
      label: '部门',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'positionName',
      label: '岗位',
      type: 'text',
      visible: true,
      width: '160'
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      minWidth: 100
    }
  ]
}

export function getReviewDetailRecordsColumns() {
  return [
    {
      fixed: 'left',
      width: '150px',
      prop: 'index',
      label: '序号',
      type: 'text',
      visible: true,
      disable: true
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'text',
      visible: true,
      width: '160',
      fixed: 'left'
    },
    {
      prop: 'contractType',
      label: '类型',
      type: 'text',
      visible: true,
      render: row => flieType.get(row.contractType)
    },
    {
      prop: 'fileName',
      label: '文档名称',
      type: 'slot',
      visible: true
    },
    {
      prop: 'employeeSignTime',
      label: '签署时间',
      type: 'text',
      visible: true,
      render: row =>
        row.employeeSignTime
          ? moment(row.employeeSignTime).format('YYYY-MM-DD')
          : ''
    },
    {
      prop: 'reviewStatus',
      label: '审核状态',
      type: 'slot',
      visible: true
    },
    {
      prop: 'sealStatus',
      label: '落章状态',
      type: 'slot',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right'
    }
  ]
}

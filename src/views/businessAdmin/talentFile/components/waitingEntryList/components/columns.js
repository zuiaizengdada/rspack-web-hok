import moment from 'moment'

export const statusMap = {
  1: '未到岗',
  2: '已到岗',
  3: '已离职',
  4: '已转正'
}
export function getColumns() {
  return [
    {
      prop: 'name',
      label: '姓名',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'entryCompanyName',
      label: '入职公司',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'entryDepartmentName',
      label: '部门名称',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'positionName',
      label: '岗位',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'expectedEntryTime',
      label: '预计入职时间',
      type: 'text',
      visible: true,
      disable: false,
      render: row => moment(row.expectedEntryTime).format('YYYY-MM-DD')
    },
    {
      prop: 'contractAgreementNumber',
      label: '合同协议',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'companySystemNumber',
      label: '公司制度',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'entryRegisterAuditStatus',
      label: '入职登记表审核',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'arrivalStatus',
      label: '到岗状态',
      type: 'slot',
      visible: true,
      disable: false
      // render: row => {
      //   return statusMap[row.arrivalStatus]
      // }
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'hrbpName',
      label: 'HRBP',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      disable: true,
      minWidth: 150
    }
  ]
}

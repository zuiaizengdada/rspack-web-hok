import moment from 'moment'

const statusMap = {
  1: 'BOSS直聘',
  2: '智联招聘',
  3: '前程无忧',
  4: '拉勾',
  5: '猎聘',
  6: '内推',
  7: '公众号/朋友圈',
  8: '其他'
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
      prop: 'phone',
      label: '手机号',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'source',
      label: '来源',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 40
    },
    {
      prop: 'entryDepartmentName',
      label: '入职公司',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'entryCompanyName',
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
      prop: 'resumeUrl',
      label: '简历',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 40
    },
    {
      prop: 'moveInTime',
      label: '移入时间',
      type: 'text',
      visible: true,
      disable: false,
      render: row =>
        row.moveInTime
          ? moment(row.moveInTime).format('YYYY-MM-DD HH:mm:ss')
          : ''
    },
    {
      prop: 'moveInReason',
      label: '移入原因',
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
      minWidth: 70
    }
  ]
}

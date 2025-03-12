import moment from 'moment/moment'

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
      prop: 'positionName',
      label: '岗位',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'interviewerNameList',
      label: '面试官',
      type: 'text',
      minWidth: 150,
      visible: true,
      disable: false
    },
    {
      prop: 'interviewTime',
      label: '面试时间',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 150,
      render: row =>
        row.interviewTime
          ? moment(row.interviewTime).format('YYYY-MM-DD HH:mm:ss')
          : ''
    },
    {
      prop: 'resumeUrl',
      label: '简历',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'register',
      label: '面试登记表',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 120
    },
    {
      prop: 'source',
      label: '来源',
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
      prop: 'approvalStatus',
      label: '状态',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 120
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

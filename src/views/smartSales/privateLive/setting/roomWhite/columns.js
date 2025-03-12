import moment from 'moment'

const columns = [
  {
    prop: 'sort',
    label: '序号'
  },
  {
    prop: 'staffName',
    label: '员工姓名'
  },
  {
    prop: 'mobile',
    label: '手机号码'
  },
  {
    prop: 'status',
    type: 'slot',
    label: '状态'
  },
  {
    prop: 'createUserName',
    label: '创建人'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    render: row => {
      return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    prop: 'operate',
    type: 'slot',
    label: '操作'
  }
]
export { columns }


import moment from 'moment'
export function getColumns() {
  return [
    { prop: 'icon', label: '图标', type: 'slot' },
    { prop: 'name', label: '模板名称', type: 'text' },
    { prop: 'sort', label: '排序', type: 'text' },
    { prop: 'createTime', label: '创建时间', type: 'text',
      render: row => {
        return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
      } },
    {
      width: '150px', prop: 'action', label: '操作', type: 'slot'
    }
  ]
}

export const approvalTypeOptions = [
  {
    value: 1,
    label: '指定员工'
  },
  {
    value: 2,
    label: '指定角色'
  },
  {
    value: 3,
    label: '申请人本人'
  },
  {
    value: 4,
    label: '部门主负责人'
  }
]

export const userTypeOptions1 = [
  {
    value: 4,
    label: '申请人的部门主负责人'
  },
  {
    value: 5,
    label: '申请人的上级部门主负责人'
  }
]
export const userTypeOptions2 = [
  {
    value: 3,
    label: '申请人本人'
  }
]

export const sendContentListOptions = [
  { id: '1', label: '固定资产' },
  { id: '2', label: '电话卡' },
  { id: '3', label: '自媒体账号' }
]

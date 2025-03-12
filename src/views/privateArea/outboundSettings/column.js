import { getList2Obj } from '@/utils/index'
const status = {
  1: '启用',
  2: '禁用'
}

export function getColumns() {
  return [
    {
      prop: 'tenantIdName',
      label: '机构名称',
      type: 'text',
      slotFn: row => row.tenantIdName,
      showInSearch: true,
      formProps: {
        formAliasName: 'name'
      }
    },
    {
      prop: 'name',
      label: '外呼名称',
      type: 'text'
    },
    {
      prop: 'status',
      label: '启用状态',
      type: 'slot',
      width: 120,
      slotFn: row => status[row.status],
      showInSearch: true,
      valueType: 'select',
      formProps: {
        sort: 1,
        options: getList2Obj(status)
      }
    },
    {
      prop: 'createUserName',
      label: '创建人',
      type: 'text',
      width: 100
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'text'
    },
    {
      prop: 'updateUserName',
      label: '更新人',
      type: 'text',
      width: 100
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      type: 'text'
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot'
    }
  ]
}

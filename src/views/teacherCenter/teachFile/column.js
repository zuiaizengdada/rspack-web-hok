import { teacherQueryByName } from '@/api/tearchCenter/index'
export function getColumns() {
  return [
    {
      prop: 'teacherId',
      label: 'IP编号',
      type: 'text',
      visible: true
    },
    {
      prop: 'teacherName',
      label: 'IP姓名',
      showInSearch: true,
      valueType: 'select',
      formProps: {
        sort: 1,
        filterable: true,
        remote: true,
        remoteMethod(query) {
          return teacherQueryByName({ name: query })
        },
        alias: {
          label: 'teacherName',
          value: 'teacherName'
        },
        options: []
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'createUserName',
      label: '操作人',
      type: 'text',
      visible: true
    },
    {
      prop: 'createTime',
      label: '操作时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      width: '120',
      type: 'slot',
      visible: true
    }
  ]
}

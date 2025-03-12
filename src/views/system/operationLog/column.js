import { parseTime, getList2Obj } from '@/utils/index'
import { operateModule } from '@/utils/enum'
const operateType = {
  1: '新增',
  2: '修改',
  3: '删除'
}
export function getColumns() {
  return [
    {
      prop: 'operateModule',
      label: '操作模块',
      showInSearch: true,
      valueType: 'select',
      formProps: {
        options: getList2Obj(operateModule)
      },
      slotFn: (row) => operateModule[row.operateModule],
      type: 'text',
      visible: true
    },
    {
      prop: 'operateType',
      label: '操作类型',

      showInSearch: true,
      valueType: 'select',
      formProps: {
        options: getList2Obj(operateType)
      },
      slotFn: (row) => operateType[row.operateType],
      type: 'text',
      visible: true
    },
    {
      prop: 'operator',
      label: '操作人',
      showInSearch: true,
      type: 'text',
      visible: true
    },
    {
      prop: 'operate',
      label: '操作内容',
      type: 'slot',
      width: 600,
      visible: true
    },
    {
      prop: 'createTime',
      label: '操作时间',
      slotFn: (row) => parseTime(new Date(row.createTime).getTime(), '{y}-{m}-{d} {h}:{i}'),
      type: 'text',
      visible: true
    }
  ]
}

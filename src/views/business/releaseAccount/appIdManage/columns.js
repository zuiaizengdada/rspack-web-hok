
import { parseTime } from '@/utils/index'
export function getColumns1() {
  return [
    { prop: 'platformName', label: '开放平台', type: 'text', visible: true },
    { prop: 'applicationName', label: 'AppID名称', type: 'text', visible: true },
    { prop: 'applicationId', label: 'AppID', type: 'text', visible: true },
    { prop: 'modifiedByName', label: '最近操作人', type: 'text', visible: true },
    { prop: 'lastModified', label: '最近操作时间', type: 'text', visible: true,
      slotFn: (row) => parseTime(row.lastModified) },
    {
      prop: 'action',
      width: '146px',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}

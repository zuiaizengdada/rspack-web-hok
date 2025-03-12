export function getColumns() {
  return [
    { prop: 'appId', label: '小程序ID', type: 'text' },
    { prop: 'name', label: '机构名称', type: 'text' },
    { prop: 'institutionSceneType', label: '资质类型', type: 'text' },
    { prop: 'status', width: 140, label: '资质图片审核状态', type: 'slot' },
    { prop: 'auditStatus', width: 140, label: '补充资质审核状态', type: 'slot' },
    { prop: 'createUser', label: '创建人', type: 'text' },
    { prop: 'createTime', label: '创建时间', type: 'text' },
    { prop: 'action', width: 260, label: '操作', type: 'slot' }
  ]
}

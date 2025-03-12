// import moment from 'moment'
// export const liveChannel = {
//   1: '自播',
//   2: '老师直播'
// }

// 达人渠道
export const liveChannel = [
  { label: '抖音', value: 1, icon: 'douyin' },
  { label: '视频号', value: 2, icon: 'shipinhao' },
  { label: '快手', value: 3, icon: 'kuaishou' },
  { label: '小鹅通', value: 4, icon: 'xiaoetong' },
  { label: '枫叶小店', value: 11, icon: 'fengyexiaodian' },
  { label: '小红书', value: 16, icon: 'xiaohongshu' },
  { label: '百度小店', value: 20, icon: 'baidu' }
]

export function getColumns() {
  return [
    { prop: 'expertChannel', label: '达人渠道', type: 'slot', visible: true },
    { prop: 'expertName', label: '达人昵称', type: 'text', visible: true, 'show-overflow-tooltip': true },
    { prop: 'expertId', label: '达人ID', type: 'text', visible: true },
    { prop: 'bindOpenIdFlag', slotFn: (row) => row.bindOpenIdFlag ? '是' : '否', label: '是否绑定抖音OpenID', type: 'text', visible: true },
    { prop: 'expertOpenId', label: '达人OpenID', type: 'slot', visible: true },
    { prop: 'operateName', label: '运营人员', type: 'text', visible: true },
    { prop: 'departmentName', label: '部门 ', type: 'text', visible: true },
    { prop: 'action', width: '170px', label: '操作', type: 'slot', visible: true }
  ]
}

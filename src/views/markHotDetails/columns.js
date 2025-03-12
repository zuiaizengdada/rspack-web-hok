export const markHotDetailsColumns = [
  {
    prop: 'videoName',
    label: '视频名称',
    type: 'text',
    visible: true,
    render: (row) => {
      return row.videoName || '--'
    }
  },
  {
    prop: 'videoGroupName',
    label: '视频组名称',
    type: 'text',
    visible: true,
    render: (row) => {
      return row.videoGroupName || '--'
    }
  },
  {
    prop: 'num',
    label: '爆款标记数量',
    type: 'text',
    visible: true
  },
  {
    prop: 'userName',
    label: '主编',
    type: 'text',
    visible: true
  },
  {
    prop: 'createTime',
    label: '生成时间',
    type: 'text',
    visible: true,
    render: (row) => {
      return row.createTime || '--'
    }
  },
  { prop: 'action', label: '操作', type: 'slot', visible: true, disable: true, width: 160 }

]

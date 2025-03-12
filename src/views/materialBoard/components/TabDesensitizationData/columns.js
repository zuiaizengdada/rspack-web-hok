export const columns = [
  {
    prop: 'title',
    label: '视频组名称'
  },
  {
    prop: 'teacherName',
    label: 'IP',
    render: row => {
      return row.teacherName || '--'
    }
  },
  {
    prop: 'createUserName',
    label: '创建者',
    width: 100
  },
  {
    prop: 'createTime',
    width: 150,
    label: '创建时间'
  },
  {
    prop: 'invalidVideoCount',
    width: 160,
    label: '有效 : 无效视频数'
  },
  {
    prop: 'duration',
    label: '有效视频时长'
  },
  {
    prop: 'effDuration',
    label: '无效视频时长'
  },
  {
    prop: 'manualDesensitizedCount',
    label: '手动 : 未手动脱敏数',
    width: 160
  },
  {
    prop: 'autoDesensitizedDuration',
    label: '手动脱敏时长'
  },
  {
    prop: 'manualDesensitizedDuration',
    label: '未手动脱敏时长'
  },
  {
    prop: 'shareCount',
    label: '共享数',
    width: 100
  },
  {
    prop: 'shareDuration',
    label: '共享视频时长'
  }
]
export const columns1 = [
  {
    prop: 'videoName',
    label: '视频名称'
  },
  {
    prop: 'title',
    label: '视频组名称'
  },
  {
    prop: 'teacherName',
    label: 'IP',
    render: row => {
      return row.teacherName || '--'
    }
  },
  {
    prop: 'duration',
    label: '视频时长'
  },
  {
    prop: 'isDesensitizedStatus',
    label: '手动脱敏状态'
  },
  {
    prop: 'hotMarkCount',
    label: '爆款标记数'
  },
  {
    prop: 'createUserName',
    label: '创建者'
  },
  {
    prop: 'createTime',
    label: '创建时间'
  },
  {
    prop: 'lastCreateTime',
    label: '最后手动脱敏时间'
  }
]
export const columns2 = [
  {
    prop: 'videoName',
    label: '视频名称'
  },
  {
    prop: 'title',
    label: '视频组名称'
  },
  {
    prop: 'teacherName',
    label: 'IP',
    render: row => {
      return row.teacherName || '--'
    }
  },
  {
    prop: 'duration',
    label: '视频时长'
  },
  {
    prop: 'hotMarkCount',
    label: '爆款标记数'
  },
  {
    prop: 'createUserName',
    label: '创建者'
  },
  {
    prop: 'createTime',
    label: '首次共享时间'
  }
]

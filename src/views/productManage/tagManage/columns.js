export const columns = [
  {
    prop: 'videoName',
    label: '视频名称',
    width: 200,
    type: 'slot',
    visible: true
  },
  {
    prop: 'hotMarkTypeName',
    label: '标记分类',
    width: 240,
    type: 'slot',
    visible: true
  },
  { prop: 'hotMarkRemarks', label: '标记描述', type: 'text', visible: true },
  {
    prop: 'subtitleContent',
    label: '标记字幕',
    type: 'text',
    visible: true
  },
  {
    prop: 'teacherName',
    label: 'IP',
    type: 'text',
    width: 140,
    visible: true,
    render: row => {
      return row.teacherName || '--'
    }
  },
  {
    prop: 'createUserName',
    label: '创建者',
    type: 'text',
    width: 80,
    visible: true
  },
  {
    prop: 'desensitizedTime',
    label: '标记时间',
    width: 180,
    type: 'text',
    visible: true
  }
]

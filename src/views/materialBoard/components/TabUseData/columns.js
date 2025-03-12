export const columns = [
  {
    prop: 'title',
    label: '短视频标题',
    id: 1
  },
  {
    prop: 'reading',
    label: '播放量',
    sortable: true,
    id: 2
  },
  {
    prop: 'greats',
    label: '点赞量',
    sortable: true,
    id: 3
  },
  {
    prop: 'teacherName',
    label: 'IP',
    render: row => {
      return row.teacherName || '--'
    },
    id: 4
  },
  {
    prop: 'accountName',
    label: '账号',
    id: 5
  },
  {
    prop: 'fans',
    label: '粉丝量',
    sortable: true,
    id: 6
  },
  {
    prop: 'platformName',
    label: '平台',
    id: 7
  },
  {
    prop: 'operatorName',
    label: '运营者',
    id: 8
  },
  {
    prop: 'deptName',
    label: '部门',
    id: 9
  },
  {
    prop: 'createTime',
    label: '发布时间',
    id: 10
  },
  {
    prop: 'groupName',
    label: '视频组名称',
    id: 11
  },
  {
    prop: 'titleName',
    label: '原视频标题',
    id: 12
  },
  {
    prop: 'hotMarkNum',
    label: '爆款标记数',
    id: 13
  },
  {
    prop: 'createUserName',
    label: '创建者',
    id: 14
  }
]
export const columns1 = [
  {
    prop: 'videoName',
    label: '视频名称',
    id: 15
  },
  {
    prop: 'title',
    label: '视频组名称',
    id: 16
  },
  {
    prop: 'teacherName',
    label: 'IP',
    render: row => {
      return row.teacherName || '--'
    },
    id: 17
  },
  {
    prop: 'duration',
    label: '视频时长',
    id: 18
  },
  {
    prop: 'usrNum',
    label: '使用人数',
    id: 19
  },
  {
    prop: 'hotMarkNum',
    label: '爆款标记数',
    id: 20
  },
  {
    prop: 'createUserName',
    label: '创建者',
    render: row => {
      return row.createUserName || '--'
    },
    id: 21
  },
  {
    prop: 'fristShareTime',
    label: '首次共享时间',
    id: 22
  }
  // {
  //   prop: 'lastShareTime',
  //   label: '最后共享时间'
  // }
]

export const tableColumns = [
  {
    prop: 'ranking',
    label: '排名',
    type: 'slot',
    visible: true,
    disable: true
  },
  {
    prop: 'accountName',
    label: '账号名称',
    type: 'text',
    visible: true,
    disable: true
  },
  {
    prop: 'platformName',
    label: '平台',
    type: 'text',
    visible: true,
    disable: true
  },
  {
    prop: 'teacherName',
    label: 'IP',
    type: 'slot',
    visible: true
    // render: (row) => {
    //   return row.teacherName || '--'
    // }
  },
  {
    prop: 'operatorName',
    label: '运营者',
    type: 'text',
    visible: true
  },
  {
    prop: 'title',
    label: '作品名称',
    type: 'slot',
    width: 300,
    visible: true
  },
  // {
  //   prop: 'addFans',
  //   label: '涨粉量',
  //   type: 'text',
  //   visible: true
  // },
  {
    prop: 'greats',
    label: '点赞数',
    type: 'text',
    visible: true
  },
  {
    prop: 'reading',
    label: '播放量',
    type: 'text',
    visible: true
  },
  {
    prop: 'comment',
    label: '评论数',
    type: 'text',
    visible: true
  },
  {
    prop: 'shared',
    label: '分享数',
    type: 'text',
    visible: true
  }
]
export const tableColumns1 = [
  {
    prop: 'ranking',
    label: '排名',
    type: 'slot',
    visible: true,
    disable: true
  },
  {
    prop: 'platformName',
    label: '平台',
    type: 'text',
    visible: true,
    disable: true
  },
  {
    prop: 'teacherName',
    label: 'IP',
    type: 'slot',
    visible: true
    // render: (row) => {
    //   return row.teacherName.join(',')
    // }
  },
  {
    prop: 'operatorName',
    label: '运营者',
    type: 'text',
    visible: true
  },
  {
    prop: 'name',
    label: '账号名称',
    width: 200,
    type: 'slot',
    visible: true
  },
  {
    prop: 'order',
    label: '订单数',
    type: 'text',
    visible: true
  },
  {
    prop: 'addFans',
    label: '涨粉量',
    type: 'text',
    visible: true
  },
  {
    prop: 'greats',
    label: '点赞数',
    type: 'text',
    visible: true
  },
  {
    prop: 'reading',
    label: '播放量',
    type: 'text',
    visible: true
  },
  {
    prop: 'comment',
    label: '评论数',
    type: 'text',
    visible: true
  },
  {
    prop: 'shared',
    label: '分享数',
    type: 'text',
    visible: true
  }
]
export const listOfWorks = [{ label: '订单榜单', value: '6' }, { label: '涨粉榜单', value: '5' }, { label: '点赞榜单', value: '1' }, { label: '播放榜单', value: '2' }, { label: '评论榜单', value: '3' }, { label: '分享榜单', value: '4' }]
export const accountList = [{ label: '点赞榜单', value: '1' }, { label: '播放榜单', value: '2' }, { label: '评论榜单', value: '3' }, { label: '分享榜单', value: '4' }]


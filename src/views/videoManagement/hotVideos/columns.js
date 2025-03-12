export const tableColumns = [
  {
    prop: 'accountName',
    label: '账号',
    type: 'slot',
    width: 250,
    visible: true
  },
  {
    prop: 'teacherName',
    label: 'IP',
    type: 'text',
    visible: true,
    render: (row) => {
      return row.teacherName || '--'
    }
  },
  {
    prop: 'videoOrder',
    label: '订单数',
    type: 'text',
    width: 130,
    sortable: 'custom',
    render: (row) => {
      return formatNumber(row.videoOrder)
    },
    visible: true
  },
  {
    prop: 'videoFreeGmv',
    label: '总GMV',
    width: 135,
    sortable: 'custom',
    type: 'text',
    visible: true,
    render: (row) => {
      return formatNumber(row.videoFreeGmv)
    }
  },
  {
    prop: 'operatorName',
    label: '运营者',
    type: 'text',
    width: 80,
    visible: true
  },
  {
    prop: 'deptName',
    label: '部门',
    type: 'text',
    width: 100,
    visible: true
  },
  {
    prop: 'openUrl',
    label: '爆款带货视频',
    width: 200,
    type: 'slot',
    visible: true
  },
  {
    prop: 'greats',
    label: '点赞数',
    type: 'text',
    sortable: 'custom',
    width: 100,
    visible: true,
    render: (row) => {
      if (row.openUrl === null) {
        return '--'
      }
      return formatNumber(row.greats)
    }
  },
  {
    prop: 'reading',
    label: '播放数',
    width: 100,
    sortable: 'custom',
    type: 'text',
    visible: true,
    render: (row) => {
      if (row.openUrl === null) {
        return '--'
      }
      return formatNumber(row.reading)
    }
  },
  {
    prop: 'semiVideoName',
    label: '半成品视频',
    type: 'slot',
    width: 200,
    visible: true
  },
  {
    prop: 'desensitizedVideoName',
    label: '素材视频',
    width: 200,
    type: 'slot',
    visible: true
  }
]

export const tableColumns1 = [
  {
    prop: 'openUrl',
    label: '作品名称',
    type: 'slot',
    width: 200,
    visible: true
  },
  {
    prop: 'greats',
    label: '点赞数',
    type: 'text',
    sortable: 'custom',
    visible: true,
    render: (row) => {
      return formatNumber(row.greats)
    }
  },
  {
    prop: 'reading',
    label: '播放数',
    sortable: 'custom',
    type: 'text',
    visible: true,
    render: (row) => {
      return formatNumber(row.reading)
    }
  },
  {
    prop: 'comment',
    label: '评论数',
    type: 'text',
    sortable: 'custom',
    visible: true,
    render: (row) => {
      return formatNumber(row.comment)
    }
  },
  {
    prop: 'shared',
    label: '转发数',
    sortable: 'custom',
    type: 'text',
    visible: true,
    render: (row) => {
      if (row.platformId === 24) {
        return '--'
      } else {
        return formatNumber(row.shared)
      }
    }
  },
  {
    prop: 'accountName',
    label: '账号',
    type: 'slot',
    width: 300,
    visible: true
  },
  {
    prop: 'teacherName',
    label: 'IP',
    type: 'text',
    visible: true,
    render: (row) => {
      return row.teacherName || '--'
    }
  },

  {
    prop: 'operatorName',
    label: '运营者',
    type: 'text',
    visible: true,
    render: (row) => {
      return row.operatorName || '--'
    }
  },
  {
    prop: 'deptName',
    label: '部门',
    type: 'text',
    visible: true,
    render: (row) => {
      return row.deptName || '--'
    }
  },
  {
    prop: 'desensitizedVideoName',
    label: '素材视频',
    type: 'slot',
    width: 200,
    visible: true
  }
]

export const sortMap = {
  'greats': '1',
  'reading': '2',
  'comment': '3',
  'shared': '4'
}

export const sortMap1 = {
  'videoOrder': '1',
  'videoFreeGmv': '2',
  'greats': '3',
  'reading': '4'
}

// 点赞数，播放数数值按千分位格式显示；超出万则以“万”结尾并保留两位小数。
export const formatNumber = (value) => {
  if (value) {
    if (value >= 10000) {
      return (value / 10000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '万'
    } else {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  } else {
    return '0'
  }
}

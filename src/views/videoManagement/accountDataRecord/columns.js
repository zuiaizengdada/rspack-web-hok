export const columns = [
  {
    prop: 'createTime',
    label: '上报时间',
    type: 'text',
    visible: true
  },
  {
    prop: 'type',
    label: '上报问题',
    type: 'text',
    visible: true,
    render: (row) => {
      // 上报问题类型 1-未授权 2-同步失败 3-同步中
      const type = row.type
      let typeStr = ''
      switch (type) {
        case 1:
          typeStr = '未授权'
          break
        case 2:
          typeStr = '同步失败'
          break
        case 3:
          typeStr = '同步中'
          break
      }
      return typeStr
    }
  },
  {
    prop: 'operatorName',
    label: '运营者',
    type: 'text',
    visible: true
  },
  {
    prop: 'name',
    label: '自媒体账号',
    type: 'text',
    visible: true
  },
  {
    prop: 'accountId',
    label: '账号UID',
    type: 'text',
    visible: true
  },
  {
    prop: 'empowerTime',
    label: '最近授权时间',
    type: 'text',
    visible: true
  },
  {
    prop: 'lastSyncTime',
    label: '最近同步时间',
    type: 'text',
    visible: true
  },
  {
    prop: 'version',
    label: '伏羲云版本号',
    type: 'text',
    visible: true
  }
]

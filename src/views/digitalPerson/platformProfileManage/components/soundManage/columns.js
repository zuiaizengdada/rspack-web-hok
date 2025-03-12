var type = {
  1: '华为',
  2: '火山',
  3: '硅基',
  5: '火山大模型'
}

export function getColumns() {
  return [
    { prop: 'name', label: '声音名称', type: 'text', visible: true },
    { prop: 'voiceType', label: '声音参数', type: 'text', visible: true },
    {
      prop: 'thirdType',
      label: '渠道',
      type: 'text',
      visible: true,
      render: row => {
        return type[row.thirdType]
        row.thirdType === 1
          ? '华为'
          : row.thirdType === 2
            ? '火山'
            : row.thirdType === 3
              ? '硅基'
              : ''
      }
    },
    {
      prop: 'orgName',
      label: '所属机构',
      type: 'text',
      visible: true,
      render: row => {
        return row.orgInfo ? row.orgInfo.map(m => m.orgName).join(',') : '-'
      }
    },
    // { prop: 'voiceType', label: '音色参数', type: 'text', visible: true },
    {
      prop: 'createTime',
      label: '添加时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'createUserName',
      label: '创建人',
      type: 'text',
      visible: true
    },
    {
      prop: 'createType',
      label: '创建方',
      type: 'text',
      visible: true,
      render: row => {
        return row.createType === 1 ? '平台创建' : '机构创建'
      }
    },
    {
      prop: 'action',
      width: '140px',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}

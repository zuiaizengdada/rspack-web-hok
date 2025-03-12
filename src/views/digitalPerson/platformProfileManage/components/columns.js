export function getColumns() {
  return [
    { prop: 'name', label: '形象名称', type: 'text', visible: true },
    { prop: 'characterId', label: '形象参数', type: 'text', visible: true },
    {
      prop: 'attitudeType',
      label: '姿态',
      type: 'text',
      visible: true,
      render: row => {
        if (row.thirdType === 4) {
          return '-'
        } else {
          return row.attitudeType === 1 ? '坐姿' : '站姿'
        }
      }
    },
    {
      prop: 'resolutionType',
      label: '类型',
      type: 'text',
      visible: true,
      render: row => {
        if (row.thirdType === 4) {
          return '-'
        } else {
          return row.resolutionType === 0
            ? '横屏'
            : row.resolutionType === 1
              ? '竖屏'
              : '横屏+竖屏'
        }
      }
    },
    {
      prop: 'thirdType',
      label: '渠道',
      type: 'text',
      visible: true,
      render: row => {
        return row.thirdType === 1
          ? '华为'
          : row.thirdType === 2
            ? '火山'
            : row.thirdType === 3
              ? '硅基'
              : row.thirdType === 4
                ? '媲美'
                : ''
      }
    },
    { prop: 'img', width: 300, label: '形象照片', type: 'slot', visible: true },
    {
      prop: 'orgName',
      label: '所属机构',
      type: 'text',
      visible: true,
      render: row => {
        return row.orgInfo ? row.orgInfo.map(m => m.orgName).join(',') : '-'
      }
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
      prop: 'createTime',
      label: '添加时间',
      type: 'text',
      visible: true
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

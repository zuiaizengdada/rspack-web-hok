// import moment from 'moment'
// 广告类型
export const adType = {
  1: 'Banner（横幅）',
  2: '弹窗',
  3: '开屏',
  4: '瓷片区',
  5: '金刚区',
  6: '分类Banner(横幅)'
}
// 跳转类型
export const jumpType = {
  1: '课程详情',
  2: '机构分类',
  8: '平台分类',
  3: '网页',
  // 4: '微信小程序',
  // 5: '抖音小程序',
  // 6: '推广页',
  7: '专题页',
  9: '视频号主页'
}
export function getColumns() {
  return [
    {
      'min-width': '260px',
      prop: 'name',
      label: '广告名称',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true,
      disable: true
    },
    {
      width: '154px',
      prop: 'type',
      label: '广告类型',
      type: 'text',
      visible: true,
      disable: true,
      render: (row) => {
        if (!row.type) {
          return ''
        }
        return adType[row.type]
      }
    },
    {
      width: '218px',
      prop: 'maxNum',
      label: '允许最大广告数量',
      type: 'text',
      align: 'center',
      visible: true,
      disable: true
    },
    {
      width: '186px',
      prop: 'num',
      label: '现有广告数量',
      type: 'text',
      align: 'center',
      visible: true,
      disable: true
    },
    {
      width: '181px',
      prop: 'createTime',
      label: '创建时间',
      type: 'text',
      visible: true,
      disable: true
    },
    {
      width: '180px',
      visible: true,
      disable: true,
      fixed: 'right',
      prop: 'action',
      label: '操作',
      type: 'slot'
    }
  ]
}

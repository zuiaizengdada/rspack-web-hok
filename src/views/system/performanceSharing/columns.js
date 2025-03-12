// 出单场景
export const issueScenarioType = {
  1: '内容带货',
  2: '直播带货'
}
// 直播类型
export const liveTypeOption = {
  1: '自播',
  2: '老师直播'
}
// 流量类型
export const flowOption = {
  0: '免费',
  1: '付费'
}
// 职位
export const positionOption = {
  1: '运营',
  2: '主播',
  3: '中控',
  4: '直播运营',
  5: '投手'
}
export function getColumns() {
  return [
    {
      prop: 'position',
      label: '职位',
      type: 'text',
      visible: true,
      disable: true,
      render: row => {
        return positionOption[row.position]
      }
    },
    {
      prop: 'source',
      label: '出单场景',
      type: 'text',
      visible: true,
      disable: true,
      render: row => {
        return issueScenarioType[row.source]
      }
    },
    {
      prop: 'liveType',
      label: '直播类型',
      type: 'slot',
      visible: true,
      disable: true
    },
    {
      prop: 'classification',
      label: '流量类型',
      type: 'text',
      visible: true,
      disable: true,
      render: row => {
        return flowOption[row.classification]
      }
    },
    // { prop: 'goodsPrice', label: '商品价格包含 ', type: 'text', visible: true, disable: true, render: (row) => { return renderGoodsPrices(row.goodsPrice) } },
    {
      prop: 'proportion',
      label: '业绩分成比例',
      type: 'text',
      visible: true,
      disable: true,
      render: row => {
        return row.proportion + '%'
      }
    },
    {
      prop: 'action',
      width: '146px',
      label: '操作',
      type: 'slot',
      visible: true,
      disable: true
    }
  ]
}

// function renderGoodsPrices(str) {
//   console.log(str)
//   if (!str) {
//     return ''
//   } else {
//     const arr = str.split('、')
//     const value = arr.reduce((pre, next) => {
//       next && (pre = `${pre}${pre ? '、' : ''}${next}`)
//       return pre
//     })
//     return value
//   }
// }

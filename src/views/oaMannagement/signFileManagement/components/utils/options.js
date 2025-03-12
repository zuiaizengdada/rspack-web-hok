//签名归属（1-乙方，2-甲方）
export const signatureTypeOption = [
  { label: '乙方', value: 1 },
  { label: '甲方', value: 2 }
]

//日期
export const dateUnitOption = [
  { label: '年', value: 3 },
  { label: '月', value: 2 },
  { label: '日', value: 1 }
]

//员工是否可下载
export const canDownloadOption = [
  { label: '是', value: 1 },
  { label: '否', value: 2 }
]

//	对齐方式（0-左对齐，1-居中对齐，2-右对齐
export const alignType = new Map([
  ['left', 0],
  ['center', 1],
  ['right', 2]
])

//	label
export const labelTextType = new Map([
  [1, '单行文本'],
  [2, '多行文本'],
  [6, '身份证'],
  [3, '数字'],
  [5, '日期'],
  [4, '邮箱'],
  [7, '签名'],
  [8, '公章']
])

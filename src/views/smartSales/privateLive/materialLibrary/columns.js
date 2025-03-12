/*
 * @Author: Aming 17666130388@163.com
 * @Date: 2023-05-24 18:15:36
 * @LastEditors: Aming 17666130388@163.com
 * @LastEditTime: 2023-05-25 12:10:02
 * @FilePath: \h5-hokd:\huoke\web-hok\src\views\live\liveVideo\columns.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function getColumns() {
  return [{
    prop: 'videoId',
    label: '视频ID',
    type: 'text',
    width: '200px'
  },
  {
    prop: 'videoName',
    label: '视频名称',
    type: 'text',
    width: '160px',
    'show-overflow-tooltip': true
  },
  {
    prop: 'teacherName',
    label: '关联老师',
    type: 'slot',
    width: '120px',
    'show-overflow-tooltip': true
  },
  {
    prop: 'videoSource',
    label: '视频来源',
    type: 'slot',
    width: '120px'
  },
  {
    prop: 'duration',
    label: '视频时长',
    type: 'slot',
    width: '120px'
  },
  {
    prop: 'format',
    label: '视频格式',
    type: 'text',
    width: '80px'
  },
  {
    prop: 'code',
    label: '视频分辨率',
    type: 'text',
    width: '100px',
    slotFn: (row) => {
      return `${row.width}*${row.height}`
    }
  },
  {
    prop: 'covertStatus',
    label: '转码状态',
    type: 'slot',
    width: '130px'
  },
  {
    prop: 'status',
    label: '使用状态',
    type: 'slot',
    width: '120px'
  },
  {
    prop: 'deptName',
    label: '上传者部门',
    type: 'text',
    width: '200px',
    'show-overflow-tooltip': true
  },
  {
    prop: 'createUserName',
    label: '上传人',
    type: 'text',
    width: '120px',
    'show-overflow-tooltip': true
  },
  {
    prop: 'createTime',
    label: '上传时间',
    type: 'text',
    width: '200px'
  },
  {
    prop: 'connectScriptCount',
    label: '关联脚本数',
    type: 'text',
    width: '160px'
  },
  {
    prop: 'connectLiveCount',
    label: '被引用次数',
    type: 'text',
    width: '160px'
  },
  {
    prop: 'action',
    label: '操作',
    type: 'slot',
    width: '198px',
    fixed: 'right'
  }
  ]
}


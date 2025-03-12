export function getColumns() {
  return [
    { prop: 'startTime', type: 'slot', label: '直播日期', width: '90px', dataType: 'String', disable: true, visible: true },
    { prop: 'startTime2', type: 'slot', label: '开播时间', width: '80px', dataType: 'String', disable: true, visible: true },
    { prop: 'name', type: 'slot', label: '直播名称', 'min-width': '100px', dataType: 'String', disable: true, visible: true, 'show-overflow-tooltip': true },
    { prop: 'teachers', type: 'slot', label: '邀请人', 'width': '120px', dataType: 'String', disable: true, visible: true, 'show-overflow-tooltip': true },
    { prop: 'liveModel', type: 'slot', label: '直播模式', 'min-width': '80px', align: 'center', dataType: 'String', disable: false, visible: true },
    { prop: 'videoName', type: 'slot', label: '使用素材名称', 'min-width': '120px', align: 'center', dataType: 'String', disable: false, visible: true },
    { prop: 'ipTeacherName', type: 'text', label: 'IP', 'min-width': '120px', align: 'center', dataType: 'String', disable: false, visible: true },
    { prop: 'feesType', type: 'slot', label: '类型', 'min-width': '80px', align: 'center', dataType: 'String', disable: false, visible: true },
    { prop: 'totalApplyCount', sumProp: 'totalApplyCount', type: 'slot', label: '总报名人数', 'min-width': '130px', headerSlot: true, tips: '总报名人数', align: 'center', dataType: 'Number', disable: true, visible: true },
    { prop: 'totalCoursesCount', sumProp: 'totalCoursesCount', type: 'slot', label: '总到课人数', 'min-width': '130px', headerSlot: true, tipsFn: (res) => { return `总到课的人数，且观看直播大于${res}分钟` }, align: 'center', dataType: 'Number', disable: true, visible: true },
    { prop: 'totalOrderCount', sumProp: 'totalOrderCount', type: 'slot', label: '转化总订单数', 'min-width': '130px', headerSlot: true, tips: '转化总订单数', align: 'center', dataType: 'Number', disable: true, visible: true },
    { prop: 'price', sumProp: 'priceSum', type: 'slot', label: '单价', 'min-width': '130px', headerSlot: true, tips: 'GMV除以转化订单数', align: 'center', dataType: 'Money', disable: false, visible: true },
    { prop: 'gmv', sumProp: 'gmvSum', type: 'slot', label: '转化GMV', 'min-width': '130px', headerSlot: true, tips: '该场直播转化的总业绩', align: 'center', dataType: 'Money', disable: true, visible: true },
    { prop: 'totalRplCount', sumProp: 'totalRplCount', type: 'slot', label: '到课RPL', 'min-width': '130px', headerSlot: true, tips: 'GMV除以总到课人数', align: 'center', dataType: 'Money', disable: false, visible: true },
    { prop: 'attendTransRate', sumProp: 'attendTransRateSum', type: 'slot', label: '到课转化率', 'min-width': '130px', headerSlot: true, tips: '【转化总订单数】除以【总到课人数】*100%', align: 'center', dataType: 'Rate', disable: false, visible: true }
  ]
}

export const slotArr = [
  'startTime', 'startTime2', 'name', 'teachers', 'liveModel', 'videoName', 'feesType',
  'newClueCount-header', 'newClueCount',
  'newFlowApplyCount-header', 'newFlowApplyCount',
  'oldFlowApplyCount-header', 'oldFlowApplyCount',
  'totalApplyCount-header', 'totalApplyCount',
  'newFlowCoursesCount-header', 'newFlowCoursesCount',
  'totalCoursesCount-header', 'totalCoursesCount',
  'newFlowCourseRate-header', 'newFlowCourseRate',
  'newFlowOrderCount-header', 'newFlowOrderCount',
  'oldFlowOrderCount-header', 'oldFlowOrderCount',
  'totalOrderCount-header', 'totalOrderCount',
  'attendTransRate-header', 'attendTransRate',
  'clueTransRate-header', 'clueTransRate',
  'price-header', 'price',
  'gmv-header', 'gmv',
  'oldFlowGmv-header', 'oldFlowGmv',
  'oldFlowGmvRate-header', 'oldFlowGmvRate',
  'totalRplCount-header', 'totalRplCount',
  'footer'
]

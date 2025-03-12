export function getColumns() {
  return [
    { prop: 'deptName', type: 'text', label: '所属部门', width: '120px', fixed: true, dataType: 'String', disable: true, visible: true },
    { prop: 'teacherName', type: 'text', label: '助教（邀课人）', width: '120px', fixed: true, dataType: 'String', disable: true, visible: true },
    // { prop: 'newClueCount', type: 'slot', 'min-width': '120px', sortable: 'custom', label: '新量线索量', headerSlot: true, tips: '新量线索量', align: 'center', dataType: 'Number', visible: true, disable: false },
    // { prop: 'addWechatNum', 'min-width': '120px', sortable: 'custom', type: 'slot', label: '加微数', headerSlot: true, tips: '指单场直播间分配给某一个人的加微数', align: 'center', dataType: 'Number', visible: true, disable: false },
    // { prop: 'addWechatRate', type: 'slot', 'min-width': '120px', sortable: 'custom', label: '加微率', headerSlot: true, tips: '加微率指加微数除以线索量*100%', align: 'center', dataType: 'Rate', visible: true, disable: false },
    // { prop: 'newFlowApplyCount', type: 'slot', 'min-width': '130px', sortable: 'custom', label: '新量报名人数', headerSlot: true, tips: '新量报名人数', align: 'center', dataType: 'Number', visible: true, disable: false },
    // { prop: 'oldFlowApplyCount', type: 'slot', 'min-width': '130px', sortable: 'custom', label: '存量报名人数', headerSlot: true, tips: '存量报名人数', align: 'center', dataType: 'Number', visible: true, disable: false },
    { prop: 'totalApplyCount', sumProp: 'totalApplyCount', type: 'slot', 'min-width': '130px', sortable: 'custom', label: '总报名人数', headerSlot: true, tips: '总报名人数', dataType: 'Number', visible: true, disable: true },
    // { prop: 'newFlowCoursesCount', type: 'slot', 'min-width': '130px', sortable: 'custom', label: '新量到课人数', headerSlot: true, tips: '新量到课人数', dataType: 'Number', visible: true, disable: false },
    { prop: 'totalCoursesCount', sumProp: 'totalCoursesCount', type: 'slot', 'min-width': '130px', sortable: 'custom', label: '总到课人数', headerSlot: true, tipsFn: (res) => { return `总到课的人数，且观看直播大于${res}分钟` }, dataType: 'Number', visible: true, disable: true },
    // { prop: 'newFlowCourseRate', type: 'slot', 'min-width': '150px', sortable: 'custom', label: '新量线索到课率', headerSlot: true, tips: '新量到课人数除以新量线索量*100%', dataType: 'Rate', visible: true, disable: false },
    // { prop: 'newFlowOrderCount', type: 'slot', 'min-width': '130px', sortable: 'custom', label: '新量订单数', headerSlot: true, tips: '指任务下关联了直播间的线索量下的已成交的订单数。', dataType: 'Number', visible: true, disable: false },
    // { prop: 'oldFlowOrderCount', type: 'slot', 'min-width': '130px', sortable: 'custom', label: '存量订单数', headerSlot: true, tips: '指任务下没有关联直播间的线索量下的已成交的订单数。', dataType: 'Number', visible: true, disable: false },
    { prop: 'totalOrderCount', sumProp: 'totalOrderCount', type: 'slot', 'min-width': '130px', label: '转化总订单数', headerSlot: true, tips: '转化总订单数', dataType: 'Number', visible: true, disable: true },
    // { prop: 'attendPeopleOrderRate', type: 'slot', 'min-width': '130px', label: '新量到课转化率', headerSlot: true, tips: '新量订单数除以新量线索到课率*100%', dataType: 'Rate', visible: true, disable: false },
    // { prop: 'clueOrderRate', type: 'slot', 'min-width': '130px', label: '新量线索转化率', headerSlot: true, tips: '转化订单数除以线索量*100%', dataType: 'Rate', visible: true, disable: false },
    { prop: 'gmv', sumProp: 'gmv', type: 'slot', 'min-width': '130px', label: '转化GMV', headerSlot: true, tips: '该场直播转化的总业绩', dataType: 'Money', visible: true, disable: true },
    // { prop: 'oldFlowGmv', type: 'slot', 'min-width': '130px', label: '存量转化GMV', headerSlot: true, tips: '指存量已成交的订单累计的业绩数。', dataType: 'Money', visible: true, disable: false },
    // { prop: 'oldFlowGmvRate', type: 'slot', 'min-width': '130px', label: '存量转化占比', headerSlot: true, tips: '指存量已成交的业绩数除以【新量】+【存量】的百分比。', dataType: 'Rate', visible: true, disable: false },
    { prop: 'totalRplCount', sumProp: 'totalRplCount', type: 'slot', 'min-width': '130px', label: '到课RPL', headerSlot: true, tips: 'GMV除以总到课人数', dataType: 'Money', visible: true, disable: false },
    { prop: 'attendPeopleOrderRate', sumProp: 'attendPeopleOrderRate', type: 'slot', label: '到课转化率', 'min-width': '130px', headerSlot: true, tips: '【转化总订单数】除以【总到课人数】*100%', dataType: 'Rate', disable: false, visible: true }
  ]
}

export const slotArr = [
  'newClueCount-header', 'newClueCount',
  'addWechatNum-header', 'addWechatNum',
  'addWechatRate-header', 'addWechatRate',
  'newFlowApplyCount-header', 'newFlowApplyCount',
  'oldFlowApplyCount-header', 'oldFlowApplyCount',
  'totalApplyCount-header', 'totalApplyCount',
  'newFlowCoursesCount-header', 'newFlowCoursesCount',
  'totalCoursesCount-header', 'totalCoursesCount',
  'newFlowCourseRate-header', 'newFlowCourseRate',
  'newFlowOrderCount-header', 'newFlowOrderCount',
  'oldFlowOrderCount-header', 'oldFlowOrderCount',
  'totalOrderCount-header', 'totalOrderCount',
  'attendPeopleOrderRate-header', 'attendPeopleOrderRate',
  'clueOrderRate-header', 'clueOrderRate',
  'gmv-header', 'gmv',
  'oldFlowGmv-header', 'oldFlowGmv',
  'oldFlowGmvRate-header', 'oldFlowGmvRate',
  'totalRplCount-header', 'totalRplCount',
  'attendTransRate-header', 'attendTransRate',
  'footer'
]

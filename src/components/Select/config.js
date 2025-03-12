import { parseTime } from '@/utils/index'
export default {
  // 选择标签
  label: {
    // 列表
    tableColumns: [
      { prop: 'action', label: '选择', type: 'slot', width: '55' },
      { prop: 'labelName', label: '标签名称', type: 'text' },
      { prop: 'labelType', label: '标签类型', type: 'text', render: row => ['手动标签', '其他标签'][row.labelType] },
      { prop: 'labelDefinition', label: '标签定义', type: 'text' }
    ],
    // 数据
    tableData: [],
    // 请求接口
    api: '/label/page',
    method: 'get',
    placeholder: '请输入标签名称',
    success: res => {
      return new Promise((resolve, reject) => {
        // res.data.dataList.map(v => v.id = String(v.id));
        resolve({
          tableData: res.data.records,
          total: res.data.total
        })
      })
    }
  },
  // 选则讲师
  teacher: {
    // 列表
    tableColumns: [
      { prop: 'action', label: '选择', type: 'slot', width: '55' },
      { prop: 'headUrl', label: '头像', type: 'avatar', width: '120' },
      { prop: 'lecturerName', label: 'IP名称', type: 'popover' },
      { prop: 'briefIntroduction', label: '说明', type: 'text' }
    ],
    tableData: [],
    api: '/lecturer/page',
    method: 'get',
    placeholder: '请输入IP名称',
    success: res => {
      return new Promise((resolve, reject) => {
        resolve({
          tableData: res.data.records,
          total: res.data.total
        })
      })
    }
  },
  // 选择第三方店铺
  shop: {
    tableColumns: [
      { prop: 'action', label: '选择', type: 'slot', width: '55' },
      { prop: 'shopName', label: '店铺名称', type: 'popover' },
      { prop: 'shopId', label: '店铺id', type: 'text' },
      { prop: 'remark', label: '备注', type: 'text' },

      { prop: 'type', label: '店铺类型', type: 'text', render: (row) => { return { 1: '抖店', 2: '快手小店', 4: '微店', 7: '小鹅通', 10: '视频号小店', 11: '枫页小店', 16: '小红书', 20: '百度小店' }[row.type] } }
    ],
    tableData: [],
    searchKey: 'shopName',
    api: '/shop/third/page',
    method: 'get',
    placeholder: '请输入店铺名称',
    success: res => {
      return new Promise((resolve, reject) => {
        resolve({
          tableData: res.data.records,
          total: res.data.total
        })
      })
    }
  },
  // 选择问卷
  questionnaire: {
    tableColumns: [
      { prop: 'action', label: '选择', type: 'slot', width: '55' },
      { prop: 'questionnaireName', label: '问卷名称', type: 'popover' },
      { prop: 'id', label: '问卷id', type: 'text' },
      { prop: 'status', label: '使用状态', type: 'text', render: (row) => { return { 1: '启用', 0: '禁用' }[row.status] } }
    ],
    tableData: [],
    searchKey: 'name',
    api: '/questionnaire/list',
    method: 'get',
    placeholder: '请输入问卷名称',
    success: res => {
      return new Promise((resolve, reject) => {
        resolve({
          tableData: res.data.records,
          total: res.data.total
        })
      })
    }
  },
  // 选择期数
  period: {
    tableColumns: [
      { prop: 'action', label: '选择', type: 'slot', width: '55' },
      { prop: 'periodNum', label: '期数', type: 'text' },
      { prop: 'autoFlag', label: '自动分配', type: 'text', render: (row) => { return { 1: '是', 0: '否' }[row.autoFlag] } },
      { prop: 'startTime', label: '开始时间', type: 'text', render: (row) => { return parseTime(row.startTime) } }
    ],
    tableData: [],
    searchKey: 'name',
    api: '/live/period/list',
    method: 'get',
    placeholder: '请输入问卷名称',
    searchHidden: true,
    success: res => {
      return new Promise((resolve, reject) => {
        resolve({
          tableData: res.data.records,
          total: res.data.total
        })
      })
    }
  },
  // 我的班级选择期数
  classPeriod: {
    tableColumns: [
      { prop: 'action', label: '选择', type: 'slot', width: '55' },
      { prop: 'periodNum', label: '期数', type: 'text' },
      { prop: 'autoFlag', label: '自动分配', type: 'text', render: (row) => { return { 1: '是', 0: '否' }[row.autoFlag] } },
      { prop: 'startTime', label: '开始时间', type: 'text', render: (row) => { return parseTime(row.startTime) } }
    ],
    tableData: [],
    searchKey: 'name',
    api: '/live/period/list/bygoods',
    method: 'get',
    searchHidden: true,
    success: res => {
      return new Promise((resolve, reject) => {
        resolve({
          tableData: res.data.records,
          total: res.data.total
        })
      })
    }
  }
}

<template>
  <div class="privateDashboard">
    <MTitle class="p-d-b">私域看板</MTitle>
    <HokSearchForm
      :form-opts="formOptsDashBoard"
      :ref-obj.sync="formOptsDashBoard.ref"
      :is-more-outside="false"
      class="pd20 private-search"
    >
      <template #deptId>
        <el-cascader
          v-model="formOptsDashBoard.formData.deptId"
          :show-all-levels="false"
          filterable
          :options="deptTreeArray"
          :props="{ checkStrictly: true }"
          clearable
          @change="searchFn"
        />
      </template>
      <template #clueTime>
        <el-date-picker
          v-model="formOptsDashBoard.formData.clueTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          @change="searchFn"
        />
      </template>
      <template #teacherIdList>
        <el-select
          v-model="formOptsDashBoard.formData.teacherIdList"
          filterable
          clearable
          remote
          multiple
          reserve-keyword
          placeholder="请输入线索IP老师"
          :remote-method="remoteMethod"
        >
          <el-option-group
            v-for="(group, index) in videoPeopleArray"
            :key="index"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId"
            />
          </el-option-group>
        </el-select>
      </template>
      <template #orderPayTime>
        <el-date-picker
          v-model="formOptsDashBoard.formData.orderPayTime"
          type="daterange"
          value-format="yyyy-MM-dd "
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="searchFn"
        />
      </template>
      <template #liveStartTime>
        <el-date-picker
          v-model="formOptsDashBoard.formData.liveStartTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="searchFn"
        />
      </template>
      <template #goodsIdList>
        <el-select
          v-model="formOptsDashBoard.formData.goodsIdList"
          filterable
          clearable
          remote
          multiple
          reserve-keyword
          placeholder="请输入商品名称"
          :remote-method="remoteMethodGoods"
          :loading="goodsLoading"
        >
          <!-- @change="searchFn" -->
          <el-option
            v-for="item in goodsIdListArray"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </template>
      <template #taskIdList>
        <div class="task-select-wrapper">
          <el-select
            v-model="formOptsDashBoard.formData.taskIdList"
            filterable
            clearable
            remote
            multiple
            reserve-keyword
            placeholder="请输入任务名称"
            :remote-method="taskIdremoteMethod"
            class="task-select"
          >
            <el-option
              v-for="item in taskIdListArray"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button
            class="task-select-text"
            type="text"
            @click="handleSelectTask"
          >选择任务</el-button>
        </div>
      </template>
    </HokSearchForm>
    <div class="right-fixed-private">
      <el-button
        v-permission="['btn:liveDataKanbanNew:comparison', permsList]"
        class="right-fixed-btn"
        type="primary"
        size="small"
        :style="{ marginRight: exportLoading ? '20px' : '0px' }"
        @click="selectLiveRoom"
      >
        直播间对比
      </el-button>
      <el-button
        :loading="exportLoading"
        class="right-fixed-btn2"
        type="default"
        size="small"
        @click="exportData"
      >
        导出
      </el-button>
    </div>
    <div
      v-loading="loading"
      class="my-table m-t-20"
      style="padding-bottom: 20px"
    >
      <virtual-scroll
        :data="tableData"
        :item-size="62"
        key-prop="id"
        :virtualized="true"
        @change="renderData => (virtualList = renderData)"
      >
        <el-table
          ref="mytable"
          virtual-scroll-list
          show-summary
          :summary-method="param => getSummaries(sumList, param)"
          height="500px"
          border
          :data="virtualList"
          style="width: 100%"
          :header-cell-style="{ background: '#EFF2F6' }"
        >
          <el-table-column
            v-for="(item, index) in cloumn"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
            :sortable="index !== 0"
          >
            <template slot="header">
              <span>{{ item.label }}</span>
              <el-tooltip
                v-if="item.tooltip"
                effect="dark"
                :content="item.tooltip"
                placement="top"
              >
                <i
                  class="el-icon-question"
                  style="margin-left: 4px; font-size: 14px; color: #909399"
                />
              </el-tooltip>
            </template>
            <template slot-scope="{ row }">
              <template v-if="item.dataType && item.dataType === 'Money'">
                {{ row[item.prop] | filtersMoneyByZero2 }}
              </template>
              <template v-else>{{ row[item.prop] }}</template>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in cloumn2"
            :key="item.liveRoomId"
            align="center"
          >
            <template slot="header" slot-scope="scope">
              <span>{{ item.label }}</span>
              <i
                class="el-icon-delete c_red m-l-10 pointer"
                @click="onhandleHeaderDel(scope, index)"
              />
            </template>
            <el-table-column
              v-for="e in item.children"
              :key="e.prop"
              :prop="e.prop"
              :label="e.label"
              align="center"
            />
          </el-table-column>
        </el-table>
      </virtual-scroll>
    </div>
    <SelectTaskDialog ref="selectTaskDialog" @confirm="handleTaskSelected" />
  </div>
</template>

<script>
import VirtualScroll from 'el-table-virtual-scroll'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import {
  formOptsDashBoardDataList,
  formOptsDashBoardTableFeers
} from './tableData'
import { materialSearchName } from '@/api/privateArea/CRM.js'
import { deptTree } from '@/api/addressBookApi'
import { deepClone } from '@/utils/FormGenerator/index'
import Dialog from '@/views/live/Dialog/index.js'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { filtersMoneyByZero, filterPayerTotal } from '@/filters/index'
import { statistics } from '@/api/liveRoom/kanban.js'
// import { getTeacherList } from '@/api/tearchCenter/index'
import { getTeacherPage } from '@/api/shop.js'
import { getSaleTaskPage, exportData } from '@/api/privateArea/CRM'
import {
  getTearchRecord,
  setPersonSetUpRecord,
  clueStat // 所有直播间数据看板-直播数据统计
} from '@/api/liveRoom/kanban.js'
import SelectTaskDialog from './selectTaskDialog.vue'

export default {
  components: {
    HokSearchForm,
    VirtualScroll,
    SelectTaskDialog
  },
  filters: {
    filtersMoneyByZero2(money) {
      return money
        .toString()
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('')
    }
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      loading: false,
      tableData: [], // 渲染的最终数据
      virtualList: [],
      tearchArray: [],
      tearchListArray: [],
      videoPeopleArray: [],
      taskIdListArray: [], // 任务名称
      goodsIdListArray: [], // 商品名称
      tableData1: [], // 左侧固定的列表数据
      cloumn: [
        { prop: 'sysUserName', label: '跟进人', width: '120' },
        { prop: 'clueNum', label: '线索量', width: '100' },
        { prop: 'addWechatNum', label: '加微数', width: '100' },
        { prop: 'addWechatRate', label: '加微率', width: '100' },
        { prop: 'attendPeopleNum', label: '总到课', width: '100' },
        { prop: 'attendPeopleRate', label: '总到课率', width: '120' },
        {
          prop: 'orderNumIncludeRefund',
          label: '总订单数',
          width: '120',
          tooltip: '查询条件下的所有支付成功的订单数，包含已退费订单数'
        },
        {
          prop: 'orderNum',
          label: '支付未退款订单数',
          width: '180',
          tooltip: '查询条件下的所有支付成功的订单数，不包含已退费订单数'
        },
        { prop: 'gmv', label: 'GMV', width: '120' },
        { prop: 'revenue', label: '营收', width: '120' },
        {
          prop: 'refundAmount',
          label: '退款',
          width: '120'
        },
        {
          prop: 'attendPeopleOrderRate',
          label: '到课转化率',
          width: '140',
          tooltip: '支付未退款订单数/总到课'
        },
        {
          prop: 'clueOrderRate',
          label: '线索转化率',
          width: '140',
          tooltip: '支付未退款订单数/线索量'
        },
        {
          prop: 'clueRpl',
          label: '线索RPL',
          width: '120',
          tooltip: '营收/线索量*100%'
        }
      ],
      cloumn2: [],
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      sumList: {}, // 合计
      formOptsDashBoardTableFeers: formOptsDashBoardTableFeers,
      deptTreeArray: [],
      goodsList: [],
      goodsLoading: false,
      formOptsDashBoardDataList: formOptsDashBoardDataList,
      formOptsDashBoard: {},
      isAvailableList: [
        { label: '有效', value: 0 },
        { label: '无效', value: 1 }
      ],
      exportLoading: false
    }
  },
  mounted() {
    this.initPage()
    this.loadTreeData()
    // this.loadTearcherData()
    setTimeout(() => {
      this.searchFn()
    }, 300)
  },
  methods: {
    async exportData() {
      this.exportLoading = true
      let deptId = ''
      if (this.formOptsDashBoard.formData.deptId.length > 0) {
        deptId =
          this.formOptsDashBoard.formData.deptId[
            this.formOptsDashBoard.formData.deptId.length - 1
          ]
      }
      const {
        clueTime,
        liveStartTime,
        orderPayTime,
        teacherIdList,
        orderStatus,
        isAvailable,
        goodsIdList
      } = this.formOptsDashBoard.formData
      const data = {
        clueStartDate: clueTime ? clueTime[0] : '',
        clueEndDate: clueTime ? clueTime[1] : '',
        liveStartDate:
          liveStartTime.length > 0 ? liveStartTime[0] + ' 00:00:00' : '',
        liveEndDate:
          liveStartTime.length > 0 ? liveStartTime[1] + ' 23:59:59' : '',
        orderPayStartDate:
          orderPayTime.length > 0 ? orderPayTime[0] + ' 00:00:00' : '',
        orderPayEndDate:
          orderPayTime.length > 0 ? orderPayTime[1] + ' 23:59:59' : '',
        teacherIdList: teacherIdList || [],
        orderStatus: orderStatus,
        isAvailable,
        deptId,
        productCategory: this.formOptsDashBoard.formData.productCategory,
        goodsId: this.formOptsDashBoard.formData.goodsId,
        liveRoomIds: this.liveRoomIds,
        teacherId: this.formOptsDashBoard.formData.teacherId,
        taskIdList: this.formOptsDashBoard.formData.taskIdList,
        goodsIdList
      }
      const res = await exportData(data)
      this.exportLoading = false
      if (res.code === 1) {
        window.open(res.data)
      }
    },
    remoteMethod(query) {
      getTeacherPage({ current: 1, size: 100, lecturerName: query }).then(
        res => {
          if (res.code === 1 && res.data.records) {
            this.videoPeopleArray = []
            this.tearchArray = []
            res.data.records.forEach(item => {
              const obj = {
                teacherId: item.lecturerId,
                teacherName: item.lecturerName
              }
              this.tearchArray.push(obj)
            })
            const optionVideo = {
              label: '历史记录',
              options: this.tearchListArray
            }
            const optionsVideos = {
              label: '请选择',
              options: this.tearchArray
            }
            this.videoPeopleArray.push(optionVideo)
            this.videoPeopleArray.push(optionsVideos)
          }
        }
      )
    },
    taskIdremoteMethod(query) {
      getSaleTaskPage({
        pageIndex: 1,
        pageSize: 100,
        taskName: query,
        isDepTask: null
      }).then(res => {
        if (res.code === 1 && res.data.items) {
          const arr = []
          res.data.items.forEach(item => {
            const obj = {
              id: item.id,
              name: item.taskName
            }
            arr.push(obj)
          })
          this.taskIdListArray = arr
        }
      })
    },

    async remoteMethodGoods(goodsName) {
      this.goodsLoading = true
      try {
        const { data } = await materialSearchName({
          goodsName
        })
        this.goodsLoading = false
        const arr = []
        data.forEach(item => {
          const obj = {
            id: item.goodsId,
            name: item.goodsName
          }
          arr.push(obj)
        })
        this.goodsIdListArray = arr
      } catch (e) {
        this.goodsLoading = false
      }
    },
    loadTearcherData() {
      const paramVideo = {
        code: 'LIVE_ROOM_PRIVATE_DOMAIN_DASHBOARD_IP_TEACHER_QUERY'
      }
      getTearchRecord(paramVideo).then(res => {
        if (res.code === 1 && res.data) {
          this.tearchListArray = []
          res.data.some(item => {
            const obj = {
              teacherId: item.key,
              teacherName: item.value
            }
            this.tearchListArray.push(obj)
          })
        }
      })
    },
    onhandleHeaderDel(res, index) {
      this.loading = true
      // 获取要删除的直播间ID
      const deletedLiveRoomId = this.cloumn2[index].liveRoomId
      // 从cloumn2中删除对应列
      this.cloumn2.splice(index, 1)
      // 同步更新liveRoomIds
      this.liveRoomIds = this.liveRoomIds.filter(id => id !== deletedLiveRoomId)

      this.$nextTick(() => {
        this.$refs.mytable && this.$refs.mytable.doLayout()
        // 重新获取数据
        if (this.liveRoomIds.length > 0) {
          this.getListByLiveRoom()
        }
        this.loading = false
      })
    },
    getSummaries(sumList, param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else {
          sums[index] = sumList[column.property]
        }
        //  else if (column.property === 'clueOrderRate') {
        // 检查是否为线索转化率
        //   sums[index] = sumList[column.property] + '%' // 添加百分号
        // }
      })
      return sums
    },
    getList() {
      this.tableData = []
      this.loading = true
      const {
        deptId,
        goodsId,
        clueTime,
        liveStartTime,
        orderPayTime,
        teacherIdList,
        orderStatus,
        isAvailable,
        productCategory,
        teacherId,
        taskIdList,
        goodsIdList
      } = this.formOptsDashBoard.formData
      const params = {
        ...this.tableConfig,
        deptId: deptId ? deptId[deptId.length - 1] : '',
        goodsId: goodsId,
        clueStartDate: clueTime ? clueTime[0] : '',
        clueEndDate: clueTime ? clueTime[1] : '',
        liveStartDate:
          liveStartTime?.length > 0 ? liveStartTime[0] + ' 00:00:00' : '',
        liveEndDate:
          liveStartTime?.length > 0 ? liveStartTime[1] + ' 23:59:59' : '',
        orderPayStartDate:
          orderPayTime?.length > 0 ? orderPayTime[0] + ' 00:00:00' : '',
        orderPayEndDate:
          orderPayTime?.length > 0 ? orderPayTime[1] + ' 23:59:59' : '',
        teacherIdList,
        taskIdList,
        goodsIdList,
        orderStatus,
        isAvailable,
        productCategory,
        liveRoomIds: [],
        teacherId
      }
      clueStat(params)
        .then(res => {
          this.loading = false
          let sumList = {}
          res.data.map(v => {
            console.log(v.refundAmount, 'v.refundAmount')
            v.id = v.sysUserId
            const revenue = filterPayerTotal(v.revenue)
            v.revenue = v.revenue >= 0 ? revenue : `-${String(revenue)}`
            v.refundAmount =
              v.refundAmount > 0 ? (v.refundAmount / 100).toFixed(2) : 0
            v.addWechatRate = v.addWechatRate + '%'
            v.attendPeopleRate = v.attendPeopleRate + '%'
            v.attendPeopleOrderRate = v.attendPeopleOrderRate + '%'
            v.clueOrderRate = v.clueOrderRate + '%'
            v.clueRpl = (v.clueRpl / 100).toFixed(2)
            v.sysUserId === '0' && (sumList = v)
            v.gmv = filterPayerTotal(v.gmv)
          })
          res.data.pop()
          this.tableData1 = JSON.parse(JSON.stringify(res.data))
          this.tableData = res.data
          if (this.tableData.length === 0) {
            this.cloumn2 = []
            this.liveRoomIds = []
            this.loading = false
            this.sumList = sumList
          } else if (this.cloumn2.length > 0) {
            return this.getListByLiveRoom()
          } else {
            this.sumList = sumList
            this.loading = false
          }

          this.$nextTick(() => {
            this.$refs.mytable && this.$refs.mytable.doLayout()
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
      this.saveTearchOrUser(
        'LIVE_ROOM_PRIVATE_DOMAIN_DASHBOARD_IP_TEACHER_QUERY'
      )
    },
    saveTearchOrUser(type) {
      const params = {
        code: type,
        value: this.formOptsDashBoard.formData.teacherId,
        valueList: []
      }
      if (params.value === '' || params.value === undefined) {
        return false
      }
      setPersonSetUpRecord(params).then(res => {
        console.log('真人：', res)
      })
    },
    teacherSelect(val) {
      this.formOptsDashBoard.formData.teacherId = val.lecturerName
      this.formOptsDashBoard.formData.teacherName = val.lecturerId
      this.searchFn()
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    async initPage() {
      this.formOptsDashBoard = {
        ...deepClone(formOptsDashBoardDataList.form),
        operatorList: [
          { label: '查询', fn: this.searchFn },
          {
            label: '重置',
            fn: this.clearFn,
            type: 'plain',
            bind: { plain: true }
          }
        ]
      }
      this.formOptsDashBoard.formData.clueTime = [
        moment()
          .subtract(6, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      ]
    },
    searchFn() {
      console.log(this.formOptsDashBoard.formData)
      this.getList()
    },
    clearFn() {
      this.formOptsDashBoard.ref.resetFields()
      this.formOptsDashBoard.formData = formOptsDashBoardDataList.form.formData
      this.formOptsDashBoard.formData.clueTime = [
        moment()
          .subtract(6, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      ]
      this.getList()
      // this.getTableInfo()
    },
    selectLiveRoom() {
      let deptId = ''
      if (this.formOptsDashBoard.formData.deptId.length > 0) {
        deptId =
          this.formOptsDashBoard.formData.deptId[
            this.formOptsDashBoard.formData.deptId.length - 1
          ]
      }
      Dialog.open({
        type: 'SelectLiveRoom2',
        visible: true,
        deptId: deptId,
        search: {
          name: '',
          code: '',
          status: 9,
          time: {
            value: JSON.parse(
              JSON.stringify(this.formOptsDashBoard.formData.liveStartTime)
            ),
            label: 0
          }
        },
        selectList: JSON.parse(JSON.stringify(this.cloumn2)),
        success: res => {
          this.loading = true
          Dialog.close()
          // this.columnKey = []
          this.liveRoomIds = []
          const arr = res.reduce((pre, next) => {
            pre.push({
              ...next,
              label: next.name,
              liveRoomId: next.id,
              startTime: next.startTime,
              children: [
                {
                  prop: next.id + '_attendPeopleNum',
                  label: '到课',
                  key: 'attendPeopleNum'
                },
                {
                  prop: next.id + '_attendPeopleRate',
                  label: '到课率',
                  key: 'attendPeopleRate'
                },
                {
                  prop: next.id + '_orderNum',
                  label: '已付款订单数',
                  key: 'orderNum'
                },
                { prop: next.id + '_gmv', label: 'GMV', key: 'gmv' },
                { prop: next.id + '_revenue', label: '营收', key: 'revenue' },
                {
                  prop: next.id + '_attendPeopleOrderRate',
                  label: '到课转化率',
                  key: 'attendPeopleOrderRate'
                }
              ]
            })
            this.liveRoomIds.push(next.id)
            // this.columnKey = this.columnKey.concat([next.id + '_attendPeopleNum', next.id + '_attendPeopleRate', next.id + '_orderNum', next.id + '_revenue', next.id + '_attendPeopleOrderRate'])
            return pre
          }, [])
          this.cloumn2 = arr
          this.getListByLiveRoom()
        }
      })
    },
    getListByLiveRoom() {
      this.loading = true
      let deptId = ''
      if (this.formOptsDashBoard.formData.deptId.length > 0) {
        deptId = this.formOptsDashBoard.formData.deptId[this.formOptsDashBoard.formData.deptId.length - 1]
      }
      const { clueTime, liveStartTime, orderPayTime, teacherIdList, orderStatus, isAvailable } = this.formOptsDashBoard.formData
      const data = {
        clueStartDate: clueTime ? clueTime[0] : '',
        clueEndDate: clueTime ? clueTime[1] : '',
        liveStartDate: liveStartTime?.length > 0 ? liveStartTime[0] + ' 00:00:00' : '',
        liveEndDate: liveStartTime?.length > 0 ? liveStartTime[1] + ' 23:59:59' : '',
        orderPayStartDate: orderPayTime?.length > 0 ? orderPayTime[0] + ' 00:00:00' : '',
        orderPayEndDate: orderPayTime?.length > 0 ? orderPayTime[1] + ' 23:59:59' : '',
        teacherIdList: teacherIdList || [],
        orderStatus: orderStatus,
        isAvailable,
        deptId,
        productCategory: this.formOptsDashBoard.formData.productCategory,
        goodsId: this.formOptsDashBoard.formData.goodsId,
        liveRoomIds: this.liveRoomIds,
        teacherId: this.formOptsDashBoard.formData.teacherId,
        taskIdList: this.formOptsDashBoard.formData.taskIdList,
        goodsIdList: this.formOptsDashBoard.formData.goodsIdList
      }

      // 先获取主表格数据
      clueStat(data)
        .then(mainRes => {
          if (mainRes.code === 1) {
            let sumList = {}
            mainRes.data.map(v => {
              v.id = v.sysUserId
              const revenue = filterPayerTotal(v.revenue)
              v.revenue = v.revenue >= 0 ? revenue : `-${String(revenue)}`
              v.refundAmount = v.refundAmount > 0 ? (v.refundAmount / 100).toFixed(2) : 0
              v.addWechatRate = v.addWechatRate + '%'
              v.attendPeopleRate = v.attendPeopleRate + '%'
              v.attendPeopleOrderRate = v.attendPeopleOrderRate + '%'
              v.clueOrderRate = v.clueOrderRate + '%'
              v.clueRpl = (v.clueRpl / 100).toFixed(2)
              v.sysUserId === '0' && (sumList = v)
              v.gmv = filterPayerTotal(v.gmv)
            })
            mainRes.data.pop()
            this.tableData1 = JSON.parse(JSON.stringify(mainRes.data))
            this.sumList = sumList

            // 获取直播间数据
            statistics(data)
              .then(res => {
                const tableData = JSON.parse(JSON.stringify(this.tableData1))

                // 重置直播间相关的合计数据
                this.liveRoomIds.forEach(liveRoomId => {
                  this.sumList[`${liveRoomId}_attendPeopleNum`] = 0
                  this.sumList[`${liveRoomId}_orderNum`] = 0
                  this.sumList[`${liveRoomId}_gmv`] = 0
                  this.sumList[`${liveRoomId}_revenue`] = 0
                })

                res.data.forEach(item => {
                  const obj = item.liveRoomData
                  for (const key in obj) {
                    if (key === '0') {
                      // 更新合计行数据
                      this.sumList[`${item.liveRoomId}_attendPeopleNum`] = obj[key].attendPeopleNum
                      this.sumList[`${item.liveRoomId}_attendPeopleRate`] = this.sumList.clueNum
                        ? parseFloat(BigNumber(obj[key].attendPeopleNum).div(this.sumList.clueNum).times(100))
                          .toFixed(2)
                          .toString()
                          .replace(/(\.00)$/, '') + '%'
                        : '0%'
                      this.sumList[`${item.liveRoomId}_orderNum`] = obj[key].orderNum
                      this.sumList[`${item.liveRoomId}_gmv`] = filtersMoneyByZero(obj[key].gmv)
                      this.sumList[`${item.liveRoomId}_revenue`] = filtersMoneyByZero(obj[key].revenue)
                      this.sumList[`${item.liveRoomId}_attendPeopleOrderRate`] = obj[key].attendPeopleNum > 0
                        ? parseFloat(BigNumber(obj[key].orderNum).div(obj[key].attendPeopleNum).times(100))
                          .toFixed(2)
                          .toString()
                          .replace(/(\.00)$/, '') + '%'
                        : '0%'
                    }
                    const index = tableData.findIndex(e => e.sysUserId === key)
                    if (index > -1) {
                      tableData[index][`${item.liveRoomId}_attendPeopleNum`] = obj[key].attendPeopleNum
                      tableData[index][`${item.liveRoomId}_attendPeopleRate`] = tableData[index].clueNum
                        ? parseFloat(BigNumber(obj[key].attendPeopleNum).div(tableData[index].clueNum).times(100))
                          .toFixed(2)
                          .toString()
                          .replace(/(\.00)$/, '') + '%'
                        : '0%'
                      tableData[index][`${item.liveRoomId}_orderNum`] = obj[key].orderNum
                      tableData[index][`${item.liveRoomId}_gmv`] = filtersMoneyByZero(obj[key].gmv)
                      tableData[index][`${item.liveRoomId}_revenue`] = filtersMoneyByZero(obj[key].revenue)
                      tableData[index][`${item.liveRoomId}_attendPeopleOrderRate`] = obj[key].attendPeopleNum > 0
                        ? parseFloat(BigNumber(obj[key].orderNum).div(obj[key].attendPeopleNum).times(100))
                          .toFixed(2)
                          .toString()
                          .replace(/(\.00)$/, '') + '%'
                        : '0%'
                    }
                  }
                })
                this.tableData = tableData
                this.$nextTick(() => {
                  this.$refs.mytable && this.$refs.mytable.doLayout()
                  this.loading = false
                })
              })
              .catch(() => {
                this.loading = false
              })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSelectTask() {
      // 确保传入的是数字类型的ID数组
      const selectedIds = this.formOptsDashBoard.formData.taskIdList || []
      this.$refs.selectTaskDialog.open(selectedIds)
    },
    handleTaskSelected(selectedTasks) {
      // 更新选中的任务列表，确保ID为数字类型
      this.formOptsDashBoard.formData.taskIdList = selectedTasks.map(task =>
        String(task.id)
      )
      this.taskIdListArray = selectedTasks.map(task => ({
        id: String(task.id),
        name: task.taskName
      }))
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.privateDashboard {
  background: #ffffff;
  border-radius: 8px;
  padding: 0 20px;
  ::v-deep {
    .search-form-box {
      display: flex;
      flex-wrap: wrap;
    }
    .el-select__tags {
      max-height: 56px;
      overflow-y: auto;
    }
  }
}
.p-d-b {
  margin-bottom: 18px;
}

.private-search {
  padding-bottom: 20px;
  pointer-events: auto;
  ::v-deep {
    .el-select__input {
      margin-left: 0;
    }
  }
}
.form-opt-db {
  margin-top: 20px;
}
.right-fixed-private {
  width: 100%;
  height: 40px;
  position: relative;
  text-align: right;
  margin-top: -70px;
  z-index: 0;
  pointer-events: none;
}

.right-fixed-btn {
  position: absolute;
  right: 65px;
  top: 0;
  z-index: 999;
  pointer-events: auto;
}

.right-fixed-btn2 {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
  pointer-events: auto;
}

::v-deep .has-gutter {
  color: #000 !important;
  font-weight: bold !important;
}
::v-deep .el-table__cell {
  color: #000 !important;
}

.task-select-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  .task-select {
    flex: 1;
    margin-right: 40px; // 为右侧按钮预留空间
  }

  ::v-deep .el-select {
    width: 100%;

    .el-select__tags {
      max-width: calc(100% - 90px); // 防止标签遮挡按钮
    }
  }

  .task-select-text {
    position: absolute;
    right: 0;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    pointer-events: auto; // 允许点击
    z-index: 2;
  }
}
</style>

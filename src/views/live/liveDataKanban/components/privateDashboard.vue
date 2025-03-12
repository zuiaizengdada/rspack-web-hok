<template>
  <el-card class="privateDashboard">
    <div class="header_title">
      <div class="header_title_text">私域看板</div>
    </div>

    <div class="search">
      <label class="searchLabel">
        <span class="p-t-5">跟进人部门</span>
        <el-cascader
          v-model="search.deptId"
          class="m-r-10 m-l-10"
          size="small"
          :show-all-levels="false"
          filterable
          :options="deptTreeArray"
          :props="{ checkStrictly: true }"
          clearable
          @change="searchFn"
        />
      </label>
      <label class="searchLabel m-r-10">
        <span class="p-t-5 m-r-10">商品名称</span>
        <el-select v-model="search.goodsId" size="small" filterable clearable remote reserve-keyword placeholder="请输入商品名称" :remote-method="remoteMethodGoods" :loading="goodsLoading" @change="searchFn">
          <el-option v-for="item in goodsList" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId" />
        </el-select>
        <!-- <el-input v-model.trim="search.name" class="w-200 m-r-10 m-l-10" size="small" clearable @keyup.enter.native="searchFn" @clear="searchFn" /> -->
      </label>
      <label class="searchLabel m-r-10">
        <span class="p-t-5">线索IP</span>
        <TeacherSelect
          ref="teacherSelect"
          class="m-r-10 m-l-10"
          :default-tearch-id="search.teacherId"
          :value="search.teacherName"
          @selected="teacherSelect"
        />
      </label>
      <label class="searchLabel m-r-10">
        <span class="p-t-5">订单状态</span>
        <el-select v-model="search.orderStatus" size="small" placeholder="请选择" class="m-r-10 m-l-10" clearable @change="searchFn">
          <el-option label="已支付" :value="2" />
          <el-option label="部分退款" :value="6" />
          <el-option label="全部退款" :value="7" />
        </el-select>
      </label>
      <label class="searchLabel m-r-10">
        <span class="p-t-5">商品类型</span>
        <el-select v-model="search.productCategory" size="small" placeholder="请选择" class="m-r-10 m-l-10" clearable @change="searchFn">
          <el-option label="视频课" :value="0" />
          <el-option label="直播课" :value="1" />
          <el-option label="线下课" :value="2" />
        </el-select>
      </label>
    </div>

    <div class="search">
      <label class="searchLabel m-r-10">
        <span class="p-t-5">线索分配日期</span>
        <el-date-picker
          v-model="search.time1"
          size="small"
          class="m-r-10 m-l-10"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
          :picker-options="pickerOptions"
          @change="searchFn"
          @focus="focus"
        />
      </label>
      <label class="searchLabel m-r-10">
        <span class="p-t-5">订单支付日期</span>
        <el-date-picker
          v-model="search.time3"
          size="small"
          class="m-r-10 m-l-10"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
          @change="searchFn"
        />
      </label>
      <label class="searchLabel m-r-10">
        <span class="p-t-5">直播开播日期</span>
        <el-date-picker
          v-model="search.time2"
          size="small"
          class="m-r-10 m-l-10"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
          :picker-options="pickerOptions1"
          @change="searchFn"
        />
      </label>
      <div class="searchLabel">
        <el-button style="margin-right: 10px" type="primary" size="small" @click="searchFn">查询</el-button>
        <el-button size="small" @click="clear()">重置</el-button>

        <el-button :disabled="tableData.length === 0" style="margin-left: 20px" type="primary" size="small" @click="selectLiveRoom">直播间对比</el-button>
      </div>
    </div>

    <div v-loading="loading" class="my-table m-t-20">
      <virtual-scroll :data="tableData" :item-size="62" key-prop="id" :virtualized="true" @change="(renderData) => virtualList = renderData">
        <el-table ref="mytable" virtual-scroll-list show-summary :summary-method="(param) => getSummaries(sumList, param)" height="500px" border :data="virtualList" style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }">
          <el-table-column v-for="(item, index) in cloumn" :key="item.prop" :prop="item.prop" :label="item.label" align="center" :sortable="index !== 0">
            <template slot-scope="{ row }">
              <template v-if="item.dataType && item.dataType === 'Money'">{{ row[item.prop] | filtersMoneyByZero2 }}</template>
              <template v-else>{{ row[item.prop] }}</template>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in cloumn2" :key="item.liveRoomId" align="center">
            <template slot="header" slot-scope="scope">
              <span>{{ item.label }}</span>
              <i class="el-icon-delete c_red m-l-10 pointer" @click="onhandleHeaderDel(scope, index)" />
            </template>
            <el-table-column v-for="(e) in item.children" :key="e.prop" :prop="e.prop" :label="e.label" align="center" />
          </el-table-column>
        </el-table>
      </virtual-scroll>
    </div>
  </el-card>
</template>

<script>
import VirtualScroll from 'el-table-virtual-scroll'
import Dialog from '@/views/live/Dialog/index.js'
import { deptTree } from '@/api/addressBookApi'
import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import moment from 'moment'
import { materialSearchName } from '@/api/privateArea/CRM.js'
import { clueStat, statistics } from '@/api/liveRoom/kanban.js'
import { mapGetters } from 'vuex'
import BigNumber from 'bignumber.js'
import { filtersMoneyByZero, filterPayerTotal } from '@/filters/index'
export default {
  components: {
    TeacherSelect,
    'virtual-scroll': VirtualScroll
  },
  filters: {
    filtersMoneyByZero2(money) {
      return money.toString()
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('')
    }
  },
  data() {
    return {
      search: {
        deptName: '',
        deptId: [],
        name: '',
        teacherName: '',
        teacherId: '',
        orderStatus: '',
        productCategory: '',
        time1: [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-DD')],
        time2: [],
        time3: []
      },
      tableData: [], // 渲染的最终数据
      virtualList: [],
      tableData1: [], // 左侧固定的列表数据
      cloumn: [
        { prop: 'sysUserName', label: '跟进人', width: '' },
        { prop: 'clueNum', label: '线索量', width: '' },
        { prop: 'addWechatNum', label: '加微数', width: '' },
        { prop: 'addWechatRate', label: '加微率', width: '' },
        { prop: 'attendPeopleNum', label: '总到课', width: '' },
        { prop: 'attendPeopleRate', label: '总到课率', width: '' },
        { prop: 'orderNum', label: '已付款订单数', width: '' },
        { prop: 'gmv', label: 'GMV', width: '' },
        { prop: 'revenue', label: '营收', width: '' },
        { prop: 'attendPeopleOrderRate', label: '到课转化率', width: '' }
      ],
      deptTreeArray: [],
      cloumn2: [],
      // columnKey: [],
      goodsList: [],
      liveRoomIds: [],
      goodsLoading: false,
      sumList: {}, // 合计
      loading: false,
      currentTime: '',
      pickerOptions: {
        disabledDate: (time) => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime).subtract(3, 'months').valueOf()
            const maxTime = moment(this.currentTime).add(3, 'months').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      currentTime1: '',
      pickerOptions1: {
        disabledDate: (time) => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime1) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime1 - one
            // const maxTime = this.currentTime1 + one
            const minTime = moment(this.currentTime1).subtract(3, 'months').valueOf()
            const maxTime = moment(this.currentTime1).add(3, 'months').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime1 = minDate.getTime()
          if (maxDate) {
            this.currentTime1 = ''
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userDeptId'])
  },
  mounted() {
    this.loadTreeData()
    this.getList()
    this.remoteMethodGoods()
  },
  methods: {
    focus() {
      if (!this.search.time1) {
        this.search.time1 = [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-DD')]
        setTimeout(() => {
          this.search.time1 = [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-DD')]
        }, 200)
      }
    },
    async remoteMethodGoods(goodsName) {
      this.goodsLoading = true
      try {
        const { data } = await materialSearchName({
          goodsName
        })
        this.goodsLoading = false
        this.goodsList = data
      } catch (e) {
        this.goodsLoading = false
      }
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
    teacherSelect(val) {
      this.search.teacherId = val.lecturerId
      this.search.teacherName = val.lecturerName
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    searchFn() {
      this.focus()
      this.getList()
    },
    clear() {
      this.search = {
        deptName: '',
        deptId: [],
        name: '',
        productCategory: '',
        teacherName: '',
        teacherId: '',
        orderStatus: '',
        time1: [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-DD')],
        time2: [],
        imte3: []
      }
      this.cloumn2 = []
      this.liveRoomIds = []
      this.getList()
    },
    onhandleHeaderDel(res, index) {
      this.loading = true
      this.cloumn2.splice(index, 1)
      this.$nextTick(() => {
        this.$refs.mytable && this.$refs.mytable.doLayout()
        this.loading = false
      })
    },
    selectLiveRoom() {
      let deptId = ''
      if (this.search.deptId.length > 0) {
        deptId = this.search.deptId[this.search.deptId.length - 1]
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
            value: JSON.parse(JSON.stringify(this.search.time2)),
            label: 0
          }
        },
        selectList: JSON.parse(JSON.stringify(this.cloumn2)),
        success: (res) => {
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
                { prop: next.id + '_attendPeopleNum', label: '到课', key: 'attendPeopleNum' },
                { prop: next.id + '_attendPeopleRate', label: '到课率', key: 'attendPeopleRate' },
                { prop: next.id + '_orderNum', label: '已付款订单数', key: 'orderNum' },
                { prop: next.id + '_gmv', label: 'GMV', key: 'gmv' },
                { prop: next.id + '_revenue', label: '营收', key: 'revenue' },
                { prop: next.id + '_attendPeopleOrderRate', label: '到课转化率', key: 'attendPeopleOrderRate' }
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
    getList() {
      if (this.loading) return
      this.loading = true
      this.tableData = []
      let deptId = ''
      if (this.search.deptId.length > 0) {
        deptId = this.search.deptId[this.search.deptId.length - 1]
      }
      const data = {
        clueStartDate: (this.search.time1 && this.search.time1.length > 0) ? this.search.time1[0] + ' 00：00：00' : '',
        clueEndDate: (this.search.time1 && this.search.time1.length > 0) ? this.search.time1[1] + ' 23:59:59' : '',
        liveStartDate: (this.search.time2 && this.search.time2.length > 0) ? this.search.time2[0] + ' 00：00：00' : '',
        liveEndDate: (this.search.time2 && this.search.time2.length > 0) ? this.search.time2[1] + ' 23:59:59' : '',
        orderPayStartDate: (this.search.time3 && this.search.time3.length > 0) ? this.search.time3[0] + ' 00：00：00' : '',
        orderPayEndDate: (this.search.time3 && this.search.time3.length > 0) ? this.search.time3[1] + ' 23:59:59' : '',
        deptId,
        productCategory: this.search.productCategory,
        goodsId: this.search.goodsId,
        liveRoomIds: [],
        orderStatus: this.search.orderStatus,
        teacherId: this.search.teacherId,
        taskIdList: [] // 兼容写法
      }
      clueStat(data).then(res => {
        let sumList = {}
        res.data.map(v => {
          v.id = v.sysUserId
          const revenue = filterPayerTotal(v.revenue)
          v.revenue = v.revenue >= 0 ? revenue : `-${String(revenue)}`
          v.addWechatRate = v.addWechatRate + '%'
          v.attendPeopleRate = v.attendPeopleRate + '%'
          v.attendPeopleOrderRate = v.attendPeopleOrderRate + '%'
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
      }).catch(() => {
        this.loading = false
      })
    },
    getListByLiveRoom() {
      this.loading = true
      let deptId = ''
      if (this.search.deptId.length > 0) {
        deptId = this.search.deptId[this.search.deptId.length - 1]
      }
      const data = {
        clueStartDate: (this.search.time1 && this.search.time1.length > 0) ? this.search.time1[0] + ' 00：00：00' : '',
        clueEndDate: (this.search.time1 && this.search.time1.length > 0) ? this.search.time1[1] + ' 23:59:59' : '',
        liveStartDate: (this.search.time2 && this.search.time2.length > 0) ? this.search.time2[0] + ' 00：00：00' : '',
        liveEndDate: (this.search.time2 && this.search.time2.length > 0) ? this.search.time2[1] + ' 23:59:59' : '',
        orderPayStartDate: (this.search.time3 && this.search.time3.length > 0) ? this.search.time3[0] + ' 00：00：00' : '',
        orderPayEndDate: (this.search.time3 && this.search.time3.length > 0) ? this.search.time3[1] + ' 23:59:59' : '',
        deptId,
        productCategory: this.search.productCategory,
        goodsId: this.search.goodsId,
        liveRoomIds: this.liveRoomIds,
        orderStatus: this.search.orderStatus,
        teacherId: this.search.teacherId
      }
      statistics(data).then((res) => {
        const tableData = JSON.parse(JSON.stringify(this.tableData1))
        res.data.map((item, index) => {
          const obj = item.liveRoomData
          for (const key in obj) {
            if (key === '0') {
              this.sumList[`${item.liveRoomId}_attendPeopleNum`] = obj[key].attendPeopleNum
              this.sumList[`${item.liveRoomId}_attendPeopleRate`] = this.sumList.clueNum ? parseFloat(BigNumber(obj[key].attendPeopleNum).div(this.sumList.clueNum).times(100)).toFixed(2).toString().replace(/(\.00)$/, '') + '%' : '0%'
              this.sumList[`${item.liveRoomId}_orderNum`] = obj[key].orderNum
              this.sumList[`${item.liveRoomId}_gmv`] = filtersMoneyByZero(obj[key].gmv)
              this.sumList[`${item.liveRoomId}_revenue`] = filtersMoneyByZero(obj[key].revenue)
              this.sumList[`${item.liveRoomId}_attendPeopleOrderRate`] = `${obj[key].attendPeopleOrderRate}%`
            }
            const index = tableData.findIndex(e => e.sysUserId === key)
            if (index > -1) {
              tableData[index][`${item.liveRoomId}_attendPeopleNum`] = obj[key].attendPeopleNum
              tableData[index][`${item.liveRoomId}_attendPeopleRate`] = tableData[index].clueNum ? parseFloat(BigNumber(obj[key].attendPeopleNum).div(tableData[index].clueNum).times(100)).toFixed(2).toString().replace(/(\.00)$/, '') + '%' : '0%'
              tableData[index][`${item.liveRoomId}_orderNum`] = obj[key].orderNum
              tableData[index][`${item.liveRoomId}_gmv`] = filtersMoneyByZero(obj[key].gmv)
              tableData[index][`${item.liveRoomId}_revenue`] = filtersMoneyByZero(obj[key].revenue)
              tableData[index][`${item.liveRoomId}_attendPeopleOrderRate`] = `${obj[key].attendPeopleOrderRate}%`
            }
          }
        })
        this.tableData = tableData
        console.log(this.tableData, 'tableData')
        this.$nextTick(() => {
          this.$refs.mytable && this.$refs.mytable.doLayout()
          this.loading = false
        })
      }).catch(() => {
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
      })
      return sums
    }
  }
}
</script>

<style lang='scss' scoped>
.privateDashboard {
    margin-top: 20px;
    background: #FFFFFF;
    border-radius: 8px;
    .header_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .header_title_text {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #2C3242;
            line-height: 22px;
        }
    }
    .search {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        .searchLabel {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 32px;
            margin-top: 20px;
            display: flex;
        }
        .searchBtn {
            flex: 1 0 0;
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>

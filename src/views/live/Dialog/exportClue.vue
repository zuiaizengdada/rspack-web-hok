<template>
  <AppDialog v-model="visible" title="线索导入" width="970px" :loading="loading" height="auto" :top="top" @success="sure">
    <div class="exportClue overflowOuto">
      <div class="filterHeader">
        <el-row>
          <span class="formLabel m-r-10">任务名称</span>
          <!-- <el-input v-model.trim="search.name" size="small" placeholder="请输入" style="width: 200px" class="m-r-10" clearable @keyup.enter.native="searchFn" @clear="searchFn" /> -->
          <appTemplate
            ref="optionRef"
            v-model="search.taskId"
            style="width: 200px; margin-right: 10px;"
            size="small"
            :config="{api: getTaskIdPage,nameKey: 'taskName',label: 'taskName',value: 'id' }"
            placeholder="请输入任务名称"
            @change="handleTasks"
            @focus="handleChangeTaskIdPage"
          />
          <span class="formLabel m-r-10">分配日期</span>
          <el-date-picker
            v-model="search.time"
            size="small"
            class="m-r-10 input-with-time"
            style="width: 292px"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :unlink-panels="true"
            :picker-options="pickerOptions"
            @change="handleClickSearch"
            @focus="focus"
          />
          <span class="formLabel m-r-10">订单状态</span>
          <el-select v-model="search.orderStatus" size="small" class="w_f_120" placeholder="请选择" clearable @clear="searchFn" @change="searchFn">
            <el-option
              v-for="(item, index) in orderStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-row>
        <el-row class="m-t-10">
          <span class="formLabel m-r-10">标签</span>
          <el-select v-model="search.tags" size="small" filterable clearable remote reserve-keyword :remote-method="getTagList" @change="searchFn">
            <el-option v-for="(item, index) in TagOptions" :key="`${item.wechatTagId}${index}`" :value="item.id" :label="item.tagName" />
          </el-select>
          <span class="formLabel m-r-10 m-l-10">商品类型</span>
          <el-select v-model="search.productCategory" size="small" clearable @clear="searchFn" @change="searchFn">
            <el-option v-for="(item) in GOODS_TYPE" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
          <span class="formLabel m-r-10 m-l-10">商品名称</span>
          <el-select
            v-model="search.goodsId"
            size="small"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入商品名称"
            :remote-method="remoteMethodGoods"
            :loading="goodsLoading"
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option v-for="item in goodsList" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId" />
          </el-select>
          <el-button size="small" class="m-l-10" type="primary" @click="searchFn">查询</el-button>
          <el-button size="small" class="m-l-10" @click="clearFn">重置</el-button>
        </el-row>
      </div>

      <div v-loading="loading" class="exportClueContent myTable">
        <el-table ref="multipleTable" height="502" :header-cell-style="{ background: '#F3F3F3' }" :data="list">
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column prop="phone" label="学员电话">
            <template slot-scope="{ row }">
              <watchPhoneNumber :default-value="row.phone" :params="row" :user-id="row.userId" :get-api="operationLogsWrite" />
            </template>
          </el-table-column>
          <el-table-column prop="wechatNickName" label="微信昵称" />
          <el-table-column prop="followUserName" label="跟进人" />
        </el-table>
        <div class="pagination">
          <div class="tipsError">
            <span class="tips c_red">{{ errTips }}</span>
          </div>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import watchPhoneNumber from '@/components/watchPhoneNumber'
import AppDialog from '@/components/AppDialog'
import moment from 'moment'
import { getSaleTaskList, materialSearchName } from '@/api/privateArea/CRM.js'
import { clueImportLimit, livePage, cluePage } from '@/api/liveRoom/index.js'
import appTemplate from '@/components/AppTemplate/teacherSelect/index'
import { liveOperationType } from '@/views/live/columns.js'
export default {
  components: {
    AppDialog,
    appTemplate,
    watchPhoneNumber
  },
  data() {
    return {
      loading: false,
      visible: false,
      currentTime: '',
      pickerOptions: {
        disabledDate: (time) => {
          if (this.currentTime) {
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
      TagOptions: [],
      search: {
        taskId: '',
        time: [moment().subtract(3, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        orderStatus: '',
        productCategory: '',
        tags: '',
        goodsId: ''
      },
      GOODS_TYPE: [
        { value: 0, label: '视频课' },
        { value: 1, label: '直播课' },
        { value: 2, label: '线下课' }
      ],
      orderStatusList: [
        { label: '全部', value: '' },
        { label: '未支付', value: 1 },
        { label: '支付成功', value: 2 },
        { label: '超时已关闭', value: 3 },
        { label: '用户已取消', value: 4 },
        { label: '退款中', value: 5 },
        { label: '部分退款', value: 6 },
        { label: '全部退款', value: 7 },
        { label: '交易结束', value: 8 },
        { label: '没有向第三方发起支付请求', value: 9 },
        { label: '退款金额异常', value: 10 },
        { label: '部分付款', value: 11 },
        { label: '转课关闭', value: 12 }
      ],
      goodsList: [],
      top: '10vh',
      goodsLoading: false,
      multipleSelection: [],
      list: [],
      liveRoomId: '',
      errTips: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.loading = false
        this.errTips = ''
        if (val) {
          try {
            this.getTagList()
            this.remoteMethodGoods()
            this.search.time = [moment().subtract(3, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
            // val && this.getList()
          } catch (err) {
            console.log(err, 'err')
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 788) / 2 + 'px'
  },
  methods: {
    operationLogsWrite(params) {
      console.log(params)
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.userId,
        phoneNum: params.phone,
        operationType: liveOperationType.type14
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    handleTasks(value) {
      this.searchFn()
      // if (!value) this.form.classStatus = ''
    },
    handleChangeTaskIdPage() {
      console.log(111, '111')
      if (!this.search.taskId) {
        this.$refs.optionRef.remoteMethod()
      }
    },
    getTaskIdPage(params) {
      const data = {
        pageIndex: 1,
        pageSize: 999,
        taskName: params.taskName,
        isDepTask: 2
      }
      return cluePage(data).then(res => {
        this.taskList = res.data.items || []
        return {
          data: res.data.items
        }
      })
    },
    focus() {
      if (!this.search.time) {
        this.search.time = [moment().subtract(3, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
        setTimeout(() => {
          this.search.time = [moment().subtract(3, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
        }, 200)
      }
    },
    async remoteMethodGoods(goodsName) {
      this.goodsLoading = true
      try {
        const { data } = await materialSearchName({
          goodsName
        })
        console.log(data, 'data123456')
        this.goodsLoading = false
        this.goodsList = data
      } catch (e) {
        this.goodsLoading = false
      }
    },
    // 获取列表数据
    getTagList(tagName = '') {
      const type = {
        my: 2,
        department: 3,
        all: 1
      }
      const params = {
        pageIndex: 1,
        pageSize: 999999999,
        tagName,
        sync: true,
        searchType: type[this.type]
      }
      getSaleTaskList(params).then(res => {
        this.TagOptions = res.data.items
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    moment,
    init() {},
    sure() {
      console.log(this.search, 'search')
      if (!this.search.taskId) {
        this.errTips = '请选择任务名称'
        return
      }
      this.errTips = ''
      this.loading = true
      const data = {
        goodsId: this.search.goodsId,
        liveRoomId: this.liveRoomId,
        orderStatus: this.search.orderStatus,
        productCategory: this.search.productCategory,
        startCreateTime: this.search.time[0] ? this.search.time[0] + ' 00:00:00' : '',
        endCreateTime: this.search.time[1] ? this.search.time[1] + ' 23:59:59' : '',
        tagName: this.search.tags ? [this.search.tags] : [],
        taskId: this.search.taskId
      }
      clueImportLimit(data).then(res => {
        this.loading = false
        this.visible = false
        this.success && this.success()
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    getList() {
      console.log(this.search, 'search')
      this.list = []
      if (!this.search.taskId) {
        this.errTips = '请选择任务名称'
        return
      }
      this.errTips = ''
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        orderStatus: this.search.orderStatus,
        startCreateTime: this.search.time[0] ? this.search.time[0] + ' 00:00:00' : '',
        endCreateTime: this.search.time[1] ? this.search.time[1] + ' 23:59:59' : '',
        goodsId: this.search.goodsId,
        productCategory: this.search.productCategory,
        tagName: this.search.tags ? [this.search.tags] : [],
        taskId: this.search.taskId
      }
      livePage(data).then(res => {
        this.loading = false
        this.list = res.data.items
        this.total = res.data.total
      }).catch(() => {
        this.loading = false
      })
    },
    handleClickSearch() {
      this.focus()
      this.searchFn()
    },
    clearFn() {
      this.search = {
        taskId: '',
        time: [moment().subtract(3, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        orderStatus: '',
        productCategory: '',
        tags: '',
        goodsId: ''
      }
      this.list = []
      this.searchFn()
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.exportClue {
  height: 670px;
  padding: 20px 20px 0;
  .filterHeader {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 32px;
    }
  }
  .myTable {
    width: 100%;
    margin-top: 20px;
    height: 554px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #cbcfd3;
    overflow: hidden;
  }
  .pagination {
    padding: 0 10px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // justify-content: right;
  }
}
</style>

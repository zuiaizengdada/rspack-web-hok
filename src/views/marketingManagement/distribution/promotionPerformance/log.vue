<template>
  <!--表格渲染-->
  <MPageLayout
    ref="MPageLayout"
    border
    type="tablePage"
    :slot-arr="slotArr"
    :current-page="config.currentPage"
    :page-sizes="config.pageSizes"
    :page-size="config.pageSize"
    :total="config.total"
    :table-data="config.tableData"
    :table-columns="config.tableColumns"
    :loading="loading"
    layout="total, sizes, prev, pager, next, jumper"
    checkbox
    @size-change="handleListSizeChange"
    @current-change="handleListCurrentChange"
    @handleSelectionChange="handleListSelectionChange"
  >
    <div slot="headerLeft">
      <div class="fl">
        <el-select v-model="search.orderStatus" class="w-150" placeholder="订单状态" size="small" clearable>
          <!-- <el-option label="未支付" :value="1" />
          <el-option label="支付成功" :value="2" />
          <el-option label="超时已关闭" :value="3" />
          <el-option label="用户已取消" :value="4" />
          <el-option label="退款中" :value="5" />
          <el-option label="部分退款" :value="6" />
          <el-option label="全部退款" :value="7" />
          <el-option label="交易结束" :value="8" />
          <el-option label="没有向第三方发起支付请求" :value="9" />
          <el-option label="退款金额异常" :value="10" /> -->
          <el-option v-for="(item) in orderStatus_options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="search.afterOrderStatus" class="w-150 m-l-10" placeholder="售后状态" size="small" clearable>
          <el-option label="用户可申请" :value="1" />
          <el-option label="用户申请中" :value="2" />
          <el-option label="已完成" :value="3" />
          <el-option label="用户关闭" :value="4" />
          <el-option label="超时关闭" :value="5" />
        </el-select>
        <el-input v-model="search.text.value" style="width: 300px" placeholder="请输入" class="input-with-select m-l-10" size="small">
          <el-select slot="prepend" v-model="search.text.label" placeholder="请选择" class="w-120" size="small">
            <el-option label="推广员姓名" value="realName" />
            <el-option label="推广员昵称" value="name" />
            <el-option label="推广员码" value="promoteCode" />
            <el-option label="推广员手机号" value="phone" />
          </el-select>
        </el-input>
        <!-- <el-date-picker v-model="search.time" type="date" placeholder="交易日期" size="small" class="m-l-10" /> -->
        <el-date-picker
          v-model="search.time"
          style="width:300px"
          class="m-l-20"
          size="small"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button
          class="m-l-10"
          type="primary"
          size="small"
          @click="getListBySearch"
        >搜索</el-button>
      </div>
    </div>
    <div slot="headerRight">
      <!-- <el-popover
        placement="bottom-end"
        width="150"
        trigger="click"
      >
        <el-button slot="reference" type="text" size="small">自定义表头</el-button>

        <el-checkbox v-model="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
          全选
        </el-checkbox>
        <el-checkbox
          v-for="item in config.tableColumns"
          :key="item.label"
          v-model="item.visible"
          v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
          @change="handleCheckedTableColumnsChange(item)"
        >
          {{ item.label }}
        </el-checkbox>
      </el-popover>
      <el-button type="text" size="small" class="m-l-20" @click="clear()">重置表头</el-button> -->
      <el-dropdown class="m-l-10">
        <el-button v-permission="['web:promoteLog:export', permsList]" type="primary" :loading="exportLoading" size="small">导出<i class="el-icon-arrow-down el-icon--right" /></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="exportBySearch">导出查询结果</el-dropdown-item>
          <el-dropdown-item @click.native="exportByTable">导出所选</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div slot="createTime" slot-scope="{ row }">
      {{ row.createTime | filterDate }}
    </div>
    <div slot="name" slot-scope="{ row }">
      <div class="userFl">
        <AppAvatar
          :avatar="row.headImg"
          :name="row.name"
          width="40"
          :no-name="true"
        />
        <span class="m-l-10">{{ row.name }}</span>
      </div>
    </div>
    <div slot="promoterRealName" slot-scope="{ row }">
      <div class="userFl">
        <AppAvatar
          :avatar="row.promoterHeadImg"
          :name="row.promoterRealName"
          width="40"
          :no-name="true"
        />
        <span class="m-l-10">{{ row.promoterRealName }}</span>
      </div>
    </div>
    <div slot="goodsNum" slot-scope="{ row }">
      <el-popover
        placement="right"
        width="300"
        trigger="hover"
      >
        <div class="goodsDetailsView">
          <!-- v-for="(item, index) in row.goodsNames"  :key="index" -->
          <div v-for="(item, index) in row.goodsNames" :key="index" class="goodsview">
            <span class="goodsDetails">{{ item }}</span>
          </div>
        </div>
        <el-button slot="reference" class="c_link" type="text">{{ row.goodsNum }}</el-button>
      </el-popover>

    </div>
    <div slot="payerTotal" slot-scope="{ row }">
      {{ row.payerTotal | filtersMoney }}
    </div>
    <div slot="refundTotal" slot-scope="{ row }">
      {{ row.refundTotal | filtersMoney }}
    </div>
    <div slot="orderStatus" slot-scope="{ row }">
      {{
        row.orderStatus | getOptionsValue(orderStatus_options)
      }}
    </div>
    <div slot="afterSaleStatus" slot-scope="{ row }">
      {{
        {1:'用户可申请', 2: '用户申请中', 3: '已完成', 4:'用户关闭', 5:'超时关闭'}[row.afterStatus]
      }}
    </div>
    <div slot="footer" />
  </MPageLayout>
</template>

<script>
import { getPromoteRecordpage, exportPromoteRecord } from '@/api/promotion/promotion'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    AppAvatar
  },
  data() {
    return {
      loading: false,
      search: {
        afterOrderStatus: '',
        text: { label: 'realName', value: '' },
        time: ['', '']
      },
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'createTime',
        'name',
        'promoterRealName',
        'goodsNum',
        'payerTotal',
        'refundTotal',
        'orderStatus',
        'afterSaleStatus'
      ],
      config: {
        tableData: [],
        tableColumns: [
          // { prop: 'action', label: '操作', type: 'text', visible: true },
          { prop: 'orderNo', label: '订单号', type: 'text', visible: true },
          { prop: 'createTime', label: '交易时间', type: 'slot', visible: true },
          { prop: 'name', label: '购买用户', type: 'slot', visible: true },
          { prop: 'promoterRealName', label: '推广员', type: 'slot', visible: true },
          { prop: 'promoterName', label: '推广员昵称', type: 'text', visible: true },
          { prop: 'goodsNum', label: '商品数', type: 'slot', visible: true },
          { prop: 'payerTotal', label: '实付金额', type: 'slot', visible: true },
          { prop: 'refundTotal', label: '退款金额', type: 'slot', visible: true },
          { prop: 'orderStatus', label: '订单状态', type: 'slot', visible: true },
          { prop: 'afterSaleStatus', label: '售后状态', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      exportLoading: false,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'orderStatus_options'
    ])
  },
  mounted() {
    this.getList()
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      console.log(res)
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    })
  },
  methods: {
    getListBySearch() {
      this.config.currentPage = 1
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        orderStatus: this.search.orderStatus,
        afterOrderStatus: this.search.afterOrderStatus,
        current: this.config.currentPage,
        size: this.config.pageSize,
        startTime: this.search.time[0],
        endTime: this.search.time[1],
        [this.search.text.label]: this.search.text.value
      }
      getPromoteRecordpage(params).then(res => {
        console.log(res, '获取推广记录列表数据')
        this.config.tableData = res.data.records
        this.config.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.forEach(v => {
        v.visible = true
      })
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'action', label: '操作', type: 'text', visible: true },
        { prop: 'goodsName', label: '推广员码', type: 'text', visible: true },
        { prop: 'price', label: '推广员', type: 'text', visible: true },
        { prop: 'type', label: '审核状态', type: 'text', visible: true },
        { prop: 'sort', label: '姓名', type: 'text', visible: true },
        { prop: 'sort', label: '绑定手机号', type: 'text', visible: true },
        { prop: 'sort', label: '累计用户', type: 'text', visible: true },
        { prop: 'sort', label: '状态', type: 'text', visible: true },
        { prop: 'commission', label: '加入时间', type: 'text', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('promoter_tableColumns', JSON.stringify(tableColumns))
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.tableData = []
      this.config.currentPage = val
      this.getList()
    },
    handleListSelectionChange(val) {
      this.multipleSelection = val
    },
    // 导出查询条件
    exportBySearch() {
      this.exportLoading = true
      const params = {
        orderStatus: this.search.orderStatus,
        afterOrderStatus: this.search.afterOrderStatus,
        startTime: this.search.time ? this.search.time[0] : '',
        endTime: this.search.time ? this.search.time[1] : '',
        [this.search.text.label]: this.search.text.value
      }
      exportPromoteRecord(params)
        .then((res) => {
          this.exportLoading = false
          console.log(res)
          window.location = res.data
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    // 导出所选结果
    exportByTable() {
      this.exportLoading = true
      console.log(this.multipleSelection)
      const ids = []
      this.multipleSelection.forEach(v => {
        ids.push(v.id)
      })
      const params = {
        ids
      }
      exportPromoteRecord(params)
        .then((res) => {
          this.exportLoading = false
          const arr = JSON.parse(JSON.stringify(this.config.tableData))
          this.config.tableData = []
          window.location = res.data
          this.config.tableData = arr
        })
        .catch(() => {
          this.exportLoading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.userFl {
  display: flex;
  align-items: center;
  // justify-content: center;
}
.goodsDetailsView {
  .goodsview {
    padding: 10px;
    border-bottom: 1px solid #eee;
    .goodsDetails {
      width: 260px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;  /* 超出部分省略号 */
      word-break: break-all;  /* break-all(允许在单词内换行。) */
      display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
      -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
      -webkit-line-clamp: 2; /** 显示的行数 **/
    }
  }
}
</style>

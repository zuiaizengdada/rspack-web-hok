<template>
  <!--推广业绩表格渲染-->
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
        <el-input
          v-model="search.text.value"
          style="width: 300px"
          placeholder="请输入"
          class="input-with-select"
          size="small"
        >
          <el-select slot="prepend" v-model="search.text.label" placeholder="请选择" class="w-120" size="small">
            <el-option label="推广员姓名" value="realName" />
            <el-option label="推广员昵称" value="name" />
            <el-option label="推广员码" value="promoteCode" />
            <el-option label="推广员手机号" value="phone" />
          </el-select>
        </el-input>
        <el-date-picker
          v-model="search.time"
          class="m-l-20"
          size="small"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button class="m-l-10" type="primary" size="small" @click="getListBySearch">搜索</el-button>
      </div>
    </div>
    <div slot="headerRight">
      <!-- <el-popover placement="bottom-end" width="150" trigger="click">
        <el-button slot="reference" type="text" size="small">自定义表头</el-button>

        <el-checkbox
          v-model="allColumnsSelected"
          :indeterminate="allColumnsSelectedIndeterminate"
          @change="handleCheckAllChange"
        >
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
        <el-button
          v-permission="['web:promotePerformance:export', permsList]"
          type="primary"
          :loading="exportLoading"
          size="small"
        >导出<i
          class="el-icon-arrow-down el-icon--right"
        /></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="exportBySearch">导出查询结果</el-dropdown-item>
          <el-dropdown-item @click.native="exportByTable">导出所选</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <div slot="action" slot-scope="{ row }">
      <el-button v-if="!row.isEdit" type="text" @click="table_edit(row)">编辑</el-button>
      <el-button v-if="row.isEdit" type="text" @click="table_save(row)">保存</el-button>
      <el-button v-if="row.isEdit" type="text" @click="table_cancel(row)">取消</el-button>
      <el-button v-if="!row.isEdit" type="text">移除</el-button>
    </div> -->
    <div slot="totalPrice" slot-scope="{ row }">￥{{ row.totalPrice | filtersMoney }}</div>
    <div slot="type">商品类型</div>
    <div slot="sort" slot-scope="{ row }">
      <el-input-number v-if="row.isEdit" v-model="row._sort" :step="1" step-strictly :min="0" />
      <span v-else>{{ row.sort }}</span>
    </div>
    <div slot="commission" slot-scope="{ row }">
      <template v-if="row.isEdit">
        <el-input-number v-model="row._commission" :max="100" :min="0" />
        <span>%</span>
      </template>
      <span v-else>{{ row.commission }}%</span>
    </div>
    <div slot="footer" />
  </MPageLayout>
</template>

<script>
import { getPerformancePage, exportPerformance } from '@/api/promotion/promotion'
import { getDay, parseTime } from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      loading: false,
      search: {
        text: { label: 'realName', value: '' },
        time: ['', '']
      },
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'promoteCode', 'totalPrice'],
      config: {
        tableData: [],
        tableColumns: [
          // { prop: 'action', label: '操作', type: 'text', visible: true },
          { prop: 'promoteCode', label: '推广员码', type: 'text', visible: true },
          { prop: 'realName', label: '姓名', type: 'text', visible: true },
          { prop: 'name', label: '推广员昵称', type: 'text', visible: true },
          { prop: 'phone', label: '绑定手机号', type: 'text', visible: true },
          { prop: 'totalPrice', label: '订单金额', type: 'slot', visible: true },
          { prop: 'orderNum', label: '商品订单数', type: 'text', visible: true }
          // { prop: 'orderNum', label: '累计用户', type: 'text', visible: true }
          // { prop: 'commission', label: '加入时间', type: 'text', visible: true }
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
  mounted() {
    this.init()
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
        current: this.config.currentPage,
        size: this.config.pageSize,
        startTime: this.search.time ? this.search.time[0] : '',
        endTime: this.search.time ? this.search.time[1] : '',
        [this.search.text.label]: this.search.text.value
      }
      getPerformancePage(params)
        .then((res) => {
          console.log(res, '获取推广业绩列表数据')
          this.config.tableData = res.data.records
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter((v) => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.forEach((v) => {
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
      this.config.currentPage = val
      this.getList()
    },
    handleListSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
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
      exportPerformance(params)
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
      const params = {
        reqVos: this.multipleSelection
      }
      exportPerformance(params)
        .then((res) => {
          this.exportLoading = false
          console.log(res)
          const arr = JSON.parse(JSON.stringify(this.config.tableData))
          this.config.tableData = []
          window.location = res.data
          this.config.tableData = arr
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    init() {
      this.search = {
        text: { label: 'realName', value: '' },
        time: [getDay(-7) + ' 24:00:00', parseTime(new Date())]
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>

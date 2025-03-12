<template>
  <div class="page-wrap">
    <div class="filter_top">
      <filterTop :search="search" @search="searchFn" />
    </div>
    <!--表格渲染-->
    <div class="live-room-module">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <div slot="action" slot-scope="{ row }">
          <el-button type="text" @click="gotoDetail(row)">详情</el-button>
          <el-button type="text">数据</el-button>
          <el-dropdown>
            <el-button class="m-l-10" type="text">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editLiveRoom(row)">编辑</el-dropdown-item>
              <el-dropdown-item v-if="row.status === 2">恢复直播</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div slot="headerRight">
          <el-button plain size="small" type="text" class="m-r-10" @click="clear()">还原自定义列表</el-button>
          <el-popover
            placement="bottom-end"
            width="150"
            trigger="click"
          >
            <el-button slot="reference" plain size="small" type="text">自定义列表</el-button>

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
          <el-button class="m-l-10" @click="showAddDialog">新增</el-button>
        </div>
        <div slot="footer">
          <el-button size="small" :loading="loading" :disabled="multipleSelection.length === 0" @click="liveRoomEnable(1)">上架</el-button>
          <el-button size="small" :loading="loading" :disabled="multipleSelection.length === 0" @click="liveRoomEnable(2)">下架</el-button>
          <el-button size="small" :loading="loading" :disabled="multipleSelection.length === 0">删除</el-button>
          <!-- <AppTableTools ref="tableTools" @onAllChange="onAllChange" @onClick="allClick" /> -->
        </div>
        <div slot="liveName" slot-scope="{ row }">
          <div class="fl goods-info-wrapper">
            <el-image
              class="m-r-10"
              style="width: 82px; height: 60px;border-radius: 4px;background: #F5F7FA"
              :src="row.horCoverUrl"
              fit="contain"
              :preview-src-list="[row.horCoverUrl]"
            />
            <div class="goods-info-detail">
              <div class="titleOptions">
                {{ row.liveName }}
              </div>
              <div class="price-info">
                <span v-if="row.saleType === 0" class="c_777">免费</span>
                <span v-if="row.saleType === 1" class="c_777">￥{{ row.salePrice | filtersMoney }}</span>
                <span v-if="row.replay && !row.replayValidity" class="c_777">长期有效</span>
                <span v-if="row.replay && row.replayValidity" class="c_777">有效期{{ row.replayValidity }}</span>
                <span v-if="row.shelveHideFlag === 1" class="c_777 m-l-10">已隐藏</span>
              </div>
            </div>
          </div>
        </div>
        <div slot="liveStartTime" slot-scope="{ row }">
          {{ row.liveStartTime | filterDate }}
        </div>
        <div slot="status" slot-scope="{ row }">
          <AppStatus :status="{0: 'error', 1: 'success', 2: 'warning', 3:'info', 4: 'error'}[row.status]">
            <span>{{ { 0: '未开始', 1: '直播中', 2: '暂停中', 3: '已结束' }[row.status] }}</span>
          </AppStatus>
        </div>
        <div slot="liveMode" slot-scope="{ row }">
          {{ {1: '横屏直播', 2: '竖屏模式', 3: '语音模式', 4: '录屏模式'}[row.liveMode] }}
        </div>
        <div slot="shelveFlag" slot-scope="{ row }">
          {{ {0: '已上架', 1: '已下架', 2: '待上架'}[row.shelveFlag] }}
        </div>
      </MPageLayout>
    </div>

    <!-- 新增/编辑直播间弹框 -->
    <el-drawer
      :title="formDialog.title"
      :visible.sync="formDialog.visible"
      direction="rtl"
      size="auto"
      :destroy-on-close="true"
    >
      <liveDrawer
        :id="formDialog.id"
        :visible="formDialog.visible"
        :type="formDialog.type"
        @success="addRoomAfter"
        @close="formDialog.visible = false"
      />
    </el-drawer>
  </div>
</template>

<script>
import filterTop from './filterTop'
import liveDrawer from './drawer.vue'
// import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
import {
  liveRoomList
// liveRoomEnable
} from '@/api/live/live'
import AppStatus from '@/components/AppStatus'
export default {
  name: 'Live',
  components: {
    filterTop,
    liveDrawer,
    // AppTableTools,
    AppStatus
  },
  data() {
    return {
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,

      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'liveName', 'liveMode', 'liveStartTime', 'status', 'shelveFlag'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'liveName', label: '直播名称', width: 300, type: 'slot', visible: true },
          { prop: 'liveMode', label: '直播模式', type: 'slot', visible: true },
          { prop: 'studentNumber', label: '学员人数', type: 'text', visible: true },
          { prop: 'shelveFlag', label: '上架状态', type: 'slot', visible: true },
          { prop: 'liveStartTime', label: '直播开始时间', type: 'slot', visible: true },
          { prop: 'linkGoods', label: '关联商品', type: 'text', visible: true },
          { prop: 'status', label: '直播状态', type: 'slot', visible: true },
          { prop: 'action', label: '操作', width: '200', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      formDialog: {
        title: '新增',
        visible: false,
        id: '', // id, 为空为新增
        type: 1 // 1: 新增 2： 编辑
      },
      search: {
        live: { label: 'liveName', value: '' }, // 订单搜索
        liveMode: '', // 直播模式
        status: '', // 直播状态
        shelveFlag: '' // 上架状态
        // liveName: '' // 直播名称
      },
      multipleSelection: []
    }
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      localStorage.setItem('live_tableColumns', JSON.stringify(this.config.tableColumns))
    })
  },
  created() {
    const tableColumns = localStorage.getItem('live_tableColumns')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.getList()
  },
  methods: {
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('live_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('live_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击新增按钮打开新增弹框
    showAddDialog() {
      this.formDialog = {
        title: '新增',
        type: 1,
        id: '',
        visible: true
      }
    },
    // 弹框关闭前重置表单
    deforeCloseDialog() {
      this.$refs.form.clearValidate()
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'liveName', label: '直播名称', type: 'slot', width: 300, visible: true },
        { prop: 'liveMode', label: '直播模式', type: 'slot', visible: true },
        { prop: 'studentNumber', label: '学员人数', type: 'text', visible: true },
        { prop: 'shelveFlag', label: '上架状态', type: 'slot', visible: true },
        { prop: 'liveStartTime', label: '直播开始时间', type: 'slot', visible: true },
        { prop: 'linkGoods', label: '关联商品', type: 'text', visible: true },
        { prop: 'status', label: '直播状态', type: 'slot', visible: true },
        { prop: 'action', label: '操作', width: '200', type: 'slot', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('live_tableColumns', JSON.stringify(tableColumns))
    },
    // 搜索
    searchFn(res) {
      this.search = res
      this.getList()
    },

    // 获取列表数据
    getList() {
      // this.config.tableData = [
      //   { title: '直播1', liveMode: '', sum: '', prince: '', status: 1, startTime: '', linkGoods: '', state: '' }
      // ]
      this.loading = true
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        liveMode: this.search.liveMode,
        [this.search.live.label]: this.search.live.value,
        shelveFlag: this.search.shelveFlag,
        status: this.search.status
      }
      liveRoomList(params).then(res => {
        console.log(res)
        this.config.tableData = res.data.records
        this.config.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    },
    addRoomAfter() {
      this.formDialog.visible = false
      this.getList()
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.config.currentPage = 1
      this.getList()
    },
    // 点击编辑直播，打开编辑直播弹框
    editLiveRoom(row) {
      this.formDialog = {
        title: '编辑',
        type: 2,
        visible: true,
        id: row.id
      }
    },
    // 批量上,下架
    liveRoomEnable(type) {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择数据')
      }
      this.$delModal({
        tips: `确定${type === 1 ? '上架' : '下架'}这${this.multipleSelection.length}个商品?`,
        success: () => {
          this.loading = true
        }
      })
      // const data = {
      //   id
      // }
      // liveRoomEnable().then(res => {
      //   this.loading = false
      //   this.getList()
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    // 前往详情页面
    gotoDetail(row) {
      console.log(row)
      this.$router.push(`live/detail/${row.id}`)
    }
  }
}
</script>

<style lang='scss' scoped>
 ::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.head-container {
  padding: 0 20px;
  text-align: right;
}
.page-wrap {
  // background: #fff;
  height: calc(100vh - 288px);
  border-radius: 4px;
  .filter_top {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  }
  .live-room-module {
    padding: 20px;
    margin-top: 20px;
    height: 100%;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  }
}
.goods-info-wrapper {
  width: 100%;
  height: 60px;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .goods-info-detail {
    line-height: 1.5;
    width: calc(100% - 82px);
    height: 100%;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .titleOptions {
      display: flex;
      width: 100%;
      // align-items: center;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      word-wrap: break-word;
      font-size: 14px;
      color: #353535;
      cursor: pointer;
    }
  }
}
</style>

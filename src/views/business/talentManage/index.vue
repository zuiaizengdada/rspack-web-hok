<template>
  <MCard class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <filterTop
          :search="search"
          @onSearch="onSearchFn"
          @onClear="onClear"
          @onAdd="onhandleAdd"
        />
      </template>
      <template slot="expertOpenId" slot-scope="scope">
        <div v-for="item in scope.row.douAppExpertList" :key="item.expertOpenId">{{ `${item.douAppName}：${item.expertOpenId}` }}</div>
      </template>
      <template slot="action" slot-scope="scope">
        <el-button type="text" @click="onhandleEdit(scope.row)">编辑</el-button>
        <el-button type="text" class="c_red" @click="onhandleDel(scope.row)">
          删除
        </el-button>
        <el-button type="text" @click="changeDetail(scope.row)">
          变更记录
        </el-button>
      </template>
      <template slot="expertChannel" slot-scope="{ row }">
        <div class="expertChannel">
          <img
            style="
              float: left;
              margin-top: 3px;
              width: 16px;
              height: 16px;
              border-radius: 100%;
              display: inline-block;
              margin-right: 6px;
            "
            :src="returnImgSrc(row)"
          />
          {{
            getOptionsValueByKey(
              'value',
              'label',
              row.expertChannel,
              liveChannel
            )
          }}
        </div>
      </template>
    </MPageLayout>

    <!-- 弹框层 -->
    <addDialog :config="addConfig" @success="closeAddDialog" />
    <history-drawer ref="historyDrawer" />
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import addDialog from './components/addDialog.vue'
import { getColumns } from './columns'
import { getOptionsValueByKey } from '@/filters/index.js'
import { getexpertManPage, expertManDel } from '@/api/order/performanceShare'
import HistoryDrawer from './components/historyDrawer.vue'
import { searchExpertChannelEnums } from '@/api/order/performanceShare'
export default {
  components: {
    filterTop,
    addDialog,
    HistoryDrawer
  },
  data() {
    return {
      liveChannel: [],
      slotArr: ['action', 'search', 'footer', 'expertChannel', 'expertOpenId'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        expertChannel: '', // 达人渠道
        expertId: '', // 平台达人ID
        operateUid: '', // 运营人员ID
        operateName: '', // 运营人员姓名
        departmentId: '', // 部门id
        departmentName: '', // 部门名称
        bindOpenIdFlag: '',
        corpMangerFlag: true
      },
      loading: false,
      addConfig: {
        type: 1, // 1：新增 2：编辑
        row: {},
        visible: false
      }
    }
  },
  mounted() {
    this.onSearchFn()
    this.searchExpertChannelEnumsd()
  },
  methods: {
    searchExpertChannelEnumsd() {
      searchExpertChannelEnums().then(res => {
        this.liveChannel = res.data
        this.liveChannel.some(item => {
          item.label = item.message
          item.value = item.code
        })
      })
    },
    returnImgSrc(row) {
      let returnString = ''
      this.liveChannel.some(item => {
        if (item.code === row.expertChannel) {
          returnString = item.imageUrl
        }
      })
      return returnString
    },
    changeDetail(row) {
      this.$refs.historyDrawer.drawerFlag = true
      this.$refs.historyDrawer.loadData(row)
    },
    getOptionsValueByKey,
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      this.addConfig = {
        type: 2,
        row: row,
        visible: true
      }
    },
    // 点击删除按钮
    onhandleDel(row) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">删除达人账号，将导致该账号后续产生的订单，无法归属至个人业绩，请确认。</div>`,
        success: () => {
          this.loading = true
          const data = {
            ids: row.id
          }
          expertManDel(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击查询按钮
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置按钮
    onClear() {
      this.search = {
        expertChannel: '', // 达人渠道
        expertId: '', // 平台达人ID
        operateUid: '', // 运营人员ID
        operateName: '', // 运营人员姓名
        departmentId: '', // 部门id
        departmentName: '', // 部门名称
        bindOpenIdFlag: ''
      }
      this.onSearchFn()
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.addConfig = {
        type: 1,
        row: {},
        visible: true
      }
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        departmentId: this.search.departmentId,
        operateUid: this.search.operateUid,
        expertChannel: this.search.expertChannel,
        expertId: this.search.expertId,
        expertName: this.search.expertName,
        bindOpenIdFlag: this.search.bindOpenIdFlag
      }
      getexpertManPage(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击关闭弹框并刷新列表
    closeAddDialog() {
      this.addConfig.visible = false
      this.onSearchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1200px;
  padding: 20px;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.expertChannel {
  display: flex;
  align-items: center;
  .expertChannelicon {
    width: 20px;
    height: 20px;
    font-size: 20px;
    margin-right: 8px;
  }
}
</style>

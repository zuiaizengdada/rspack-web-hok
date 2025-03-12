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
      <template slot="action" slot-scope="scope">
        <el-button type="text" @click="onhandleEdit(scope.row)">编辑</el-button>
        <el-button type="text" class="c_red" @click="onhandleDel(scope.row)">
          删除
        </el-button>
      </template>
      <template slot="liveType" slot-scope="{ row }">
        <div class="liveType" :class="`liveType${row.liveType}`">
          <i :class="`liveTypeImg${row.liveType}`" />
          <p>{{ liveTypeOption[row.liveType] }}</p>
        </div>
      </template>
    </MPageLayout>

    <!-- 弹框层 -->
    <addDialog :config="addConfig" @success="onCloseAddDialog" />
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import addDialog from './component/addDialog.vue'
import { getColumns, liveTypeOption } from './columns'
import {
  getPerformanceSharePage,
  performanceShareDel
} from '@/api/order/performanceShare'
export default {
  components: {
    filterTop,
    addDialog
  },
  data() {
    return {
      liveTypeOption,
      slotArr: ['action', 'search', 'footer', 'liveType'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        position: '', // 职位
        goodsPrices: [], // 商品价格,
        source: '', // 出单场景
        classification: '', // 流量类型
        liveType: '' // 直播类型
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
  },
  methods: {
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
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确认是否删除该条规则？</div>`,
        success: () => {
          this.loading = true
          const data = {
            id: row.id,
            classification: row.classification,
            position: row.position,
            source: row.source,
            liveType: row.liveType
          }
          performanceShareDel(data)
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
      console.log(this.search)
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置按钮
    onClear() {
      this.search = {
        position: '',
        source: '',
        classification: '',
        goodsPrices: []
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
      console.log('点击新增')
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        ...this.search
      }
      getPerformanceSharePage(data)
        .then(res => {
          // if (res?.data?.items.length > 0) {
          //   res.data.items.map(v => {
          //     const arr = v.goodsPrice.split('、')
          //     v.goodsPrices = arr.reduce((pre, next) => {
          //       next && (pre.push(next))
          //       return pre
          //     }, [])
          //   })
          // }
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 弹框关闭并刷新页面
    onCloseAddDialog() {
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
.liveType {
  display: inline-block;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding: 5px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  line-height: 12px;
  i {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    float: left;
  }
  p {
    float: left;
  }
  .liveTypeImg1 {
    background-image: url(../../../assets/image/account/icn_myself.png);
    background-size: 100%;
  }
  .liveTypeImg2 {
    background-image: url(../../../assets/image/account/icn_teacher.png);
    background-size: 100%;
  }
  .liveTypeImg3 {
    background-image: url(../../../assets/image/account/icn_yunying.png);
    background-size: 100%;
  }
}
.liveType1 {
  background: #f4e7ff;
  color: #650cff;
}
.liveType3 {
  background: #e7f0ff;
  color: #0c6fff;
}
.liveType2 {
  background: #e6f7ea;
  color: #00b42a;
}
</style>

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
        <div class="m-t-20 p-b-20 searchTop">
          <div>
            <span class="formLabel">赠品ID</span>
            <el-input
              v-model.trim="search.giveawayId"
              class="w-200 m-r-20"
              size="small"
              clearable
              @clear="searchFn"
              @keyup.enter.native="searchFn"
            />
            <span class="formLabel">奖品类型</span>
            <el-select
              v-model="search.giveawayType"
              placeholder="请选择"
              clearable
              size="small"
              @change="searchFn"
            >
              <el-option label="虚拟奖品" :value="1" />
              <el-option label="实物奖品" :value="2" />
              <el-option label="优惠券" :value="3" />
            </el-select>
            <el-button
              size="small"
              class="m-l-20"
              type="primary"
              style="margin-left: 27px"
              @click="searchFn"
              >查询</el-button
            >
            <el-button
              size="small"
              class="m-l-20"
              style="margin-left: 16px"
              @click="onhanldeClear"
              >重置</el-button
            >
          </div>
          <div>
            <el-button size="small" type="primary" @click="onhandleAdd"
              ><i class="el-icon-plus" />新增赠品</el-button
            >
          </div>
        </div>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          type="text"
          class="c_F53F3F"
          :loading="row.delLoading"
          @click="onhandleDel(row)"
          >删除</el-button
        >
      </template>
      <template slot="giveawayPrice" slot-scope="{ row }">
        <span v-if="row.giveawayType === 3">— —</span>
        <span v-else>￥{{ row.giveawayPrice | filtersMoneyByZero }}</span>
      </template>
    </MPageLayout>
    <!-- 弹框层 -->
    <addDialog :config="addConfig" @success="closeAddDialog" />
  </MCard>
</template>

<script>
import { giftList, giftDelete } from '@/api/liveRoom/index.js'
import addDialog from './addDialog.vue'
import moment from 'moment'
export default {
  components: {
    addDialog
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'giveawayPrice'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'id', label: '赠品ID', type: 'text', 'min-width': '200px' },
          {
            prop: 'giveawayName',
            label: '赠品名称',
            type: 'text',
            'min-width': '200px'
          },
          {
            prop: 'giveawayType',
            label: '赠品类型',
            type: 'text',
            'min-width': '100px',
            render: row => {
              return { 1: '虚拟商品', 2: '实物商品', 3: '优惠券' }[
                row.giveawayType
              ]
            }
          },
          {
            prop: 'giveawayPrice',
            label: '价格',
            type: 'slot',
            'min-width': '200px'
          },
          {
            prop: 'operateName',
            label: '操作人',
            type: 'text',
            'min-width': '200px'
          },
          {
            prop: 'updateTime',
            label: '操作时间',
            type: 'text',
            'min-width': '200px',
            render: row => {
              return moment(row.updateTime).format('YYYY-MM-DD HH:mm')
            }
          },
          {
            prop: 'action',
            label: '操作',
            type: 'slot',
            width: '80px',
            fixed: 'right'
          }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      search: {
        giveawayId: '',
        giveawayType: ''
      },
      addConfig: {
        visible: false
      }
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    onhanldeClear() {
      this.search = {
        giveawayId: '',
        giveawayType: ''
      }
      this.config.currentPage = 1
      this.searchFn()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        giveawayId: this.search.giveawayId,
        giveawayType: this.search.giveawayType
      }
      giftList(data)
        .then(res => {
          console.log(res)
          res.data.items.map(v => {
            v.delLoading = false
            return
          })
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          setTimeout(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
            this.loading = false
          }, 200)
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    // 点击新增赠品
    onhandleAdd() {
      this.addConfig.visible = true
    },
    closeAddDialog(type) {
      !type && (this.addConfig.visible = false)
      this.searchFn()
    },
    // 点击删除
    onhandleDel(row) {
      console.log(row)
      this.$delModal({
        tips: `确定删除?`,
        success: () => {
          row.delLoading = true
          const data = { giveawayId: row.id }
          giftDelete(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              row.delLoading = false
              this.searchFn()
            })
            .catch(() => {
              row.delLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1000px;
  padding: 0 20px;
  .searchTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      margin-right: 8px;
    }
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 6px 0px 20px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>

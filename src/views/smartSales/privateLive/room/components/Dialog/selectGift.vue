<template>
  <!-- 选择赠品 -->
  <AppDialog
    v-model="config.visible"
    title="添加抽奖"
    width="800px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="selectGift">
      <div class="filterHeader">
        <span class="formLabel">赠品ID</span>
        <el-input v-model.trim="search.giveawayId" class="w-200 m-r-20" size="small" clearable @keyup.enter.native="searchFn" @clear="searchFn" />
        <span class="formLabel">赠品类型</span>
        <el-select v-model="search.giveawayType" placeholder="请选择" clearable size="small" @change="searchFn">
          <el-option label="虚拟奖品" :value="1" />
          <el-option label="实物奖品" :value="2" />
          <el-option label="优惠券" :value="3" />
        </el-select>
        <el-button size="small" class="m-l-20" type="primary" style="margin-left: 27px" @click="searchFn">查询</el-button>
        <el-button size="small" class="m-l-20" style="margin-left: 16px" @click="onhanldeClear">重置</el-button>
      </div>
      <el-table class="myTable" height="502" :header-cell-style="{ background: '#F3F3F3' }" border :data="list" @row-click="rowClick">
        <el-table-column width="55">
          <template slot-scope="{ row }">
            <el-checkbox :value="checkIds.includes(row.giveawayId)" :disabled="!checkIds.includes(row.giveawayId) && checkIds.length >= 5" @click.native.prevent />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="赠品id" />
        <el-table-column prop="giveawayName" label="赠品名称" />
        <el-table-column prop="giveawayType" label="类型">
          <template slot-scope="{ row }">
            {{ { 1: '虚拟商品', 2: '实物商品', 3:'优惠券' }[row.giveawayType] }}
          </template>
        </el-table-column>
        <el-table-column prop="giveawayPrice" label="价格(元)">
          <template slot-scope="{ row }">
            <span v-if=" row.giveawayType === 3">— —</span>
            <span v-else>￥{{ row.giveawayPrice | filtersMoneyByZero }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
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
  </AppDialog>
</template>

<script>
import { giftList } from '@/api/liveRoom/index.js'
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          checks: [],
          visible: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      visible: true,
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: {
        giveawayId: '',
        giveawayType: ''
      },
      // checkIds: [],
      checks: [],
      top: '114px'
    }
  },
  computed: {
    checkIds() {
      return this.checks.reduce((pre, next) => {
        pre.push(next.id)
        return pre
      }, [])
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        this.checks = JSON.parse(JSON.stringify(this.config.checks))
        val && this.searchFn()
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 750) / 2 + 'px'
  },
  methods: {
    rowClick(row) {
      if (!this.checkIds.includes(row.giveawayId) && this.checkIds.length >= 5) {
        return
      }
      const index = this.checkIds.findIndex(v => v === row.giveawayId)
      index > -1 ? this.checks.splice(index, 1) : this.checks.push(row)
    },
    sure() {
      this.$emit('success', this.checks)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchFn()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        giveawayId: this.search.giveawayId,
        giveawayType: this.search.giveawayType
      }
      giftList(data).then(res => {
        console.log(res)
        res.data.items.map(v => {
          v.amount = ''
          v.prizeName = ''
          v.goodsName = v.giveawayName
          v.prizeType = v.giveawayType
        })
        res.data.items.map(v => { v.giveawayId = v.id })
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onhanldeClear() {
      this.search = {
        giveawayId: '',
        giveawayType: ''
      }
      this.config.currentPage = 1
      this.searchFn()
    }
  }
}
</script>

<style lang='scss' scoped>
.selectGift {
   height: 622px;
   padding: 20px 32px;
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
        line-height: 22px;
        margin-right: 8px;
      }
   }
    .myTable {
      width: 100%;
      margin-top: 10px;
      height: 502px;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px solid #CBCFD3;
      overflow: hidden;
    }
   .pagination {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: right;
    }
}
</style>

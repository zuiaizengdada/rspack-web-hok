<template>
  <div>
    <filters ref="filtersRef" @query="getList" @resetQuery="resetQuery" />
    <div v-loading="loadding">
      <el-table :data="tableData" style="width: 100%">
        <template v-for="(item, index) in columns">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :render-header="item.renderHeader"
            :fixed="item.fixed"
          />
        </template>
      </el-table>
      <el-row type="flex" justify="end" style="margin-top: 10px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </div>
  </div>
</template>

<script>
import filters from './components/filters'
import { columns } from './table'
import { getCollectList } from '@/api/business/divideAccounts'
import { mapAmount } from '../../utils'
import moment from 'moment'
export default {
  components: {
    filters
  },
  data() {
    return {
      columns,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loadding: false
    }
  },
  methods: {
    resetQuery(params = {}) {
      this.currentPage = 1
      this.pageSize = 10
      this.getList(params)
    },
    getList(params) {
      this.loadding = true
      getCollectList({
        current: this.currentPage,
        size: this.pageSize,
        ...params
      })
        .then(res => {
          this.loadding = false
          this.tableData = res.data.records.map(m => ({
            ...m,
            settleDate: m.settleDate
              ? moment(m.settleDate).format('YYYY-MM-DD')
              : '-',
            settleAccountInt: mapAmount(m.settleAccountInt),
            settleAmountToBlank: mapAmount(m.settleAmountToBlank),
            settleAmountToDouYin: mapAmount(m.settleAmountToDouYin)
          }))
          this.total = res.data.total
        })
        .catch(() => {
          this.loadding = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.$refs.filtersRef.onSubmit()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$refs.filtersRef.onSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
.link_c {
  color: #409eff;
  cursor: pointer;
}
.tips-ms {
  width: 960px;
  border-radius: 5px;
  border: 1px solid #ffde9d;
  background: #fff5e0;
  padding: 13px;
  margin-bottom: 15px;
  .title-tips {
    user-select: none;
    font-size: 14px;
    color: #734e3a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      cursor: pointer;
      width: 14px;
      height: 14px;
    }
  }
  .content-tips {
    color: #aa5404;
    font-size: 14px;
  }
}
.sum-row {
  width: 961px;
  fill: #fff;
  border: 1px solid #dcdee1;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 28px 36px;
  .sum-item {
    width: 49%;
    .sum-label {
      font-size: 18px;
      padding-left: 24px;
      color: #777777;
    }
    .sum-amount {
      font-weight: 700;
      font-size: 28px;
      padding-left: 24px;
      color: #000000;
    }
  }
  .vertical {
    width: 1px;
    height: 50px;
    background: #dcdee1;
    margin: 0 20px;
  }
}
</style>

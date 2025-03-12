<template>
  <div class="teacherDataStatistics">
    <div class="searchTop">
      <el-page-header @back="goBack">
        <slot name="content">
          单场直播间数据
          <!-- <MTitle>
            单场直播间数据
            <span v-if="row.liveRoom" class="m-l-10 searchTopText">
              {{ row.liveRoom }}
              <span v-if="row.liveCode">({{ row.liveCode }})</span>
            </span>
          </MTitle> -->
        </slot>
      </el-page-header>
    </div>
    <el-table :data="tableData" border style="width: 100%" class="m-t-20" show-summary :summary-method="getSummaries" :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column prop="date" label="助教" />
      <el-table-column prop="date" label="线索量" align="center" />
      <el-table-column prop="date" label="加微数" align="center" />
      <el-table-column prop="date" label="加微率" align="center" />
      <el-table-column prop="date" label="报名人数" align="center" />
      <el-table-column prop="date" label="到课人数" align="center" />
      <el-table-column prop="date" label="到课率" align="center" />
      <el-table-column prop="date" label="转化订单数" align="center" />
      <el-table-column prop="date" label="到课转化率" align="center" />
      <el-table-column prop="date" label="线索转化率" align="center" />
      <el-table-column prop="date" label="转化GMV" align="center" />
      <el-table-column prop="date" label="单条线索产出" align="center" />
    </el-table>
    <el-pagination
      class="m-t-20 pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    row: {
      type: Object,
      default: () => {
        return {
          liveRoom: '',
          liveCode: ''
        }
      }
    }
  },
  data() {
    return {
      time: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {},
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {},
    goBack() {
      this.$emit('goBack')
    }
  }
}
</script>

<style lang='scss' scoped>
.teacherDataStatistics {
  padding: 20px;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  .searchTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .searchTopText {
      font-size: 14px;
      color: #999999;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

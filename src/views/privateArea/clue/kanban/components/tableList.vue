<template>
  <div class="tableList">
    <MTitle> 明细 </MTitle>
    <el-table
      v-loading="loading"
      class="m-t-20 tableListBorder"
      border
      :data="listData"
      style="width: 100%"
      :header-cell-style="{ background: '#F2F9FF' }"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="followUserName"
        label="跟进人姓名"
        align="center"
        width="100"
      />
      <el-table-column
        prop="clueNum"
        sortable
        label="分配线索数"
        align="center"
        width="120"
      />
      <el-table-column
        prop="callNum"
        sortable
        label="外呼触达线索数"
        align="center"
        width="150"
      />
      <el-table-column
        prop="sendSmsNum"
        sortable
        label="短信触达线索数"
        align="center"
        width="150"
      />
      <el-table-column
        prop="notAddWxNum"
        sortable
        label="未加微数"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div style="color: #065cff" @click="handleClue(scope.row)">
            {{ scope.row.notAddWxNum || 0 }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="addWxNum"
        sortable
        label="总加微数"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.addWxNum || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addWxRatio"
        label="总加微率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.addWxRatio) }}%</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="addQwNum"
        sortable
        label="总加企微数"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.addQwNum || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addQwRatio"
        label="总加企微率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.addQwRatio) }}%</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundNum"
        sortable
        label="线索退款订单数"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.refundNum || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundRatio"
        label="线索退款率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.refundRatio) }}%</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addQwAutoNum"
        sortable
        label="自动加微数"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.addQwAutoNum || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addQwAutoRatio"
        label="自动加微率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.addQwAutoRatio) }}%</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addQwManualNum"
        sortable
        label="手动加微数"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.addQwManualNum || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addQwManualRatio"
        label="手动加微率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.addQwManualRatio) }}%</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="addGwNum"
        sortable
        label="个微加微数"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.addGwNum || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addGwRatio"
        label="个位加微率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.addGwRatio) }}%</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="addInvitationsNum"
        sortable
        label="邀约数"
        align="center"
        width="90"
      />
      <el-table-column prop="addInvitationsRatio" label="邀约率" align="center">
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.addInvitationsRatio) }}%</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="coursesNum"
        sortable
        label="到课数"
        align="center"
        width="90"
      />
      <el-table-column prop="coursesRatio" label="到课率" align="center">
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.coursesRatio) }}%</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="completedCoursesNum"
        sortable
        label="完课数"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        prop="completedCoursesRatio"
        label="完课率"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.completedCoursesRatio) }}%</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="conversionsNum"
        sortable
        label="新线索转化人数"
        align="center"
        width="150"
      />
      <el-table-column
        prop="convertedOrdersNum"
        sortable
        label="新线索转化订单数"
        align="center"
        width="160"
      />
      <el-table-column
        prop="oldConvertedOrdersNum"
        sortable
        label="存量线索转化订单数 "
        align="center"
        width="180"
      />
      <el-table-column
        prop="conversionAmount"
        sortable
        label="新线索订单金额(GMV)"
        align="center"
        width="190"
      >
        <template slot-scope="scope">
          <div>
            {{ initNum(scope.row.conversionAmount) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="conversionRatio"
        label="新线索转化率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ initNum(scope.row.conversionRatio) }}%</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="conversionAmountTotal"
        sortable
        label="订单总金额(GMV)"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          <div>
            {{ initNum(scope.row.conversionAmountTotal) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="revenueAmount"
        sortable
        label="新线索营收"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>
            {{ initNum(scope.row.revenueAmount) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="rpl"
        label="RPL(人均转化)"
        align="center"
        width="130"
      >
        <template slot-scope="scope">
          <div>
            {{ (scope.row.rpl / 10000 || 0).toFixed(2) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="paginationBox"
      :page-sizes="[10, 20, 50]"
      :current-page="pageData.pageIndex"
      :page-size="pageData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    pageData: {
      type: Object,
      default: () => {
        return {
          pageIndex: 1,
          pageSize: 10
        }
      }
    }
  },
  methods: {
    handleClue(row) {
      const params = { followUserId: row.followUserId, taskId: row.taskId }
      this.$emit('handleClue', params)
    },
    initNum(num) {
      return `${(num / 100 || 0)?.toFixed(2)}`
    },
    sortChange(val) {
      let sort = ''
      if (val.order === 'descending') {
        sort = 'DESC'
      } else if (val.order === 'ascending') {
        sort = 'ASC'
      }
      this.$emit('orderChange', { sort, column: val.prop || '' })
    },
    handleSizeChange(val) {
      this.$emit('update:pageData', { ...this.pageData, pageSize: val })
      this.$emit('updateList')
    },
    handleCurrentChange(val) {
      this.$emit('update:pageData', { ...this.pageData, pageIndex: val })
      this.$emit('updateList')
    }
  }
}
</script>

<style lang="scss" scoped>
.tableListBorder {
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  overflow: hidden;
}
.tableList::v-deep {
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      height: 12px;
    }
  }
}
.paginationBox {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>

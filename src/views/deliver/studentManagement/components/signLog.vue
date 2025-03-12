<template>
  <div v-loading="loading">
    <!-- 签到记录 -->
    <el-table :height="height" :data="data" :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column prop="sessionDate" label="签到场次" align="center" />
      <el-table-column prop="signUserName" label="签到人员" align="center" />
      <el-table-column prop="signTime" label="签到时间" align="center" />
      <el-table-column prop="certificateFileList" label="备注" align="center">
        <template slot-scope="{ row }">
          <el-button v-if="row.certificateFileList && row.certificateFileList.length > 0" class="f_s_14" size="small" type="text" @click="handleClickVoucherSignedBehalf(row)">
            代签凭证
          </el-button>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <voucherSignedBehalf :config="voucherSignedBehalfConfig" />
  </div>
</template>

<script>
import { deliverySignPage } from '@/api/deliver/studentManagement'
import voucherSignedBehalf from './voucherSignedBehalf.vue'
export default {
  components: {
    voucherSignedBehalf
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: [String, Number]
    },
    // 	交付编号
    deliveryInfoId: {
      type: [String, Number],
      default: ''
    }
    // // 班期编号
    // scheduleId: {
    //   type: [String, Number],
    //   default: ''
    // },
    // // 场次编号
    // sessionId: {
    //   type: [String, Number],
    //   default: ''
    // }
  },
  data() {
    return {
      loading: false,
      data: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      voucherSignedBehalfConfig: {
        data: [],
        visible: false
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    init() {
      this.currentPage = 1
      this.data = []
      this.total = 0
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        deliveryInfoId: this.deliveryInfoId
        // scheduleId: this.scheduleId,
        // sessionId: this.sessionId
      }
      deliverySignPage(params).then(res => {
        this.data = res.data.records
        this.total = Number(res.data.total)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击打开代签凭证弹框
    handleClickVoucherSignedBehalf(row) {
      this.voucherSignedBehalfConfig = {
        visible: true,
        data: row.certificateFileList
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.pagination {
  height: 62px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>

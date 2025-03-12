<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <MPageLayout
        ref="MPageLayout"
        :slot-arr="slotArr"
        :current-page="config.pageIndex"
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
        <div slot="advertiserName" slot-scope="scope">
          <span>
            <p class="advers-name-cls">{{ scope.row.advertiserAlias ? scope.row.advertiserAlias : scope.row.advertiserName }}</p>
            <i class="el-icon-edit sys-cls cursor" @click="updateAdvertiserName(scope.row)" />
          </span>
        </div>
        <div slot="advertiseChannel" slot-scope="scope">
          <p v-if="scope.row.advertiseChannel === 1">千川</p>
          <p v-else-if="scope.row.advertiseChannel === 2">腾讯</p>
          <p v-else-if="scope.row.advertiseChannel === 3">枫页小店</p>
          <p v-else-if="scope.row.advertiseChannel === 4">百度小店</p>
          <p v-else-if="scope.row.advertiseChannel === 7">巨量Ad广告</p>
        </div>
        <div slot="advertiseFlag" slot-scope="scope">
          <p v-if="scope.row.advertiseFlag === 0">自投</p>
          <p v-else-if="scope.row.advertiseFlag === 1">代投</p>
        </div>
        <div slot="action" slot-scope="scope">
          <p class="blue-p" @click="update(scope.row)">修改</p>
        </div>
      </MPageLayout>
      <editStatisticsManager ref="editStatisticsManager" @success="successDialog" />
      <updateAdvertiserName ref="updateAdvertiserName" @loadData="loadDataAfterSet" />
    </div>
  </div>
</template>

<script>
import {
  getEmployeeAdvertisePage
} from '@/api/business/financial'
import { mapGetters } from 'vuex'
import editStatisticsManager from '@/views/business/financialInstruments/components/editStatisticsManager'
import updateAdvertiserName from '@/views/business/financialInstruments/components/updateAdvertiserName'
export default {
  name: 'OrderListData',
  components: {
    editStatisticsManager,
    updateAdvertiserName
  },
  props: {

  },
  data() {
    return {
      loading: false,
      searchForStart: {
        pageIndex: 1,
        pageSize: 10,
        advertiserId: '', // 投放账号
        advertiserPutterUid: '', // 投放人员
        advertiseChannel: '', // 广告渠道
        bindEmployeeFlag: 1, // 是否关联投放人
        secondDeptId: '' // 投放部门
      },
      slotArr: ['action', 'advertiseChannel', 'advertiserName', 'advertiseFlag'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'advertiseChannel', label: '渠道', type: 'slot', visible: true },
          { prop: 'advertiserId', label: '投放账号', type: 'text', visible: true },
          { prop: 'advertiserName', label: '投放账号名称', width: 360, type: 'slot', visible: true },
          { prop: 'advertiseFlag', label: '账号类型', type: 'slot', visible: true },
          { prop: 'advertiserPutterName', label: '投放人员', align: 'center', type: 'text', visible: true, disable: true },
          { prop: 'secondDeptName', label: '投放部门', type: 'text', visible: true },
          { prop: 'action', label: '操作', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }

    }
  },
  computed: {
    ...mapGetters(['goodsType_obj', 'channelSourceType'])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  activated() {
  },
  methods: {
    updateAdvertiserName(row) {
      this.$refs.updateAdvertiserName.dialogFormVisible = true
      this.$refs.updateAdvertiserName.row.advertiseChannel = row.advertiseChannel
      this.$refs.updateAdvertiserName.row.advertiserId = row.advertiserId
      this.$refs.updateAdvertiserName.form.aliasName = row.advertiserAlias ? row.advertiserAlias : row.advertiserName
    },
    successDialog() {
      this.$refs.editStatisticsManager.visibleFlag = false
      this.loadData(this.searchForStart)
    },
    update(row) {
      console.log('数据eee：', row)
      this.$refs.editStatisticsManager.visibleFlag = true
      this.$refs.editStatisticsManager.loadData(row)
    },
    loadDataAfterSet() {
      getEmployeeAdvertisePage(this.searchForStart).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    },
    loadData(search) {
      this.searchForStart = search
      getEmployeeAdvertisePage(this.searchForStart).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.searchForStart.pageIndex = val
      getEmployeeAdvertisePage(this.searchForStart).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.searchForStart.pageSize = val
      getEmployeeAdvertisePage(this.searchForStart).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page_wrap {
    height: 100%;
    // background-color: #fff;
    ::v-deep .el-table::before {
        height: 0px;
    }
    ::v-deep .page_footer {
        width: 100%!important;
        display: inline-block!important;
        text-align: right!important;
    }
    ::v-deep .customer-table .el-table__fixed-right::before,
    .el-table__fixed::before {
        width: 0;
    }
    .content {
        height: 100%;
        min-height: 600px;
        ::v-deep .tablePage .page_content {
            min-height: 560px;
            padding: 0;
        }
        ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
            min-height: 520px;
        }
        ::v-deep .el-table__body-wrapper .is-scrolling-left {
            min-height: 520px;
        }
    }
}

.red-cls,.red-p {
    color: #F53F3F;
}
.success-cls,.red-green {
    color: #67c23a;
}
.blue-p {
    color: #0C6FFF;
    cursor: pointer;
}
.sys-cls {
  color: #0C6FFF;
}

.advers-name-cls {
  float: left;
  max-width: 340px;
  margin-right: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cursor {
  cursor: pointer;
}
</style>


<template>
  <!-- 签到记录弹框 -->
  <el-drawer
    :size="1000"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">签到记录</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
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
            <span class="tips m-r-8 m-l-20">签到场次</span>
            <el-select v-model="search" class="m-r-20" size="small" clearable>
              <el-option
                v-for="(item) in option"
                :key="item.id"
                :label="item.startTime"
                :value="item.id"
              />
            </el-select>
            <el-button size="small" type="primary" :loading="loading" @click="searchFn">查询</el-button>
          </template>
          <template slot="footer" />
          <template slot="userPhone" slot-scope="{ row }">
            <watchPhoneNumber :phone-area-code="row.phoneAreaCode" :default-value="row.userPhone" :user-id="row.userId" />
          </template>
          <template slot="certificateFileList" slot-scope="{ row }">
            <el-button v-if="row.certificateFileList && row.certificateFileList.length > 0" size="medium" type="text" @click="handleClickVoucherSignedBehalf(row)">代签凭证</el-button>
          </template>
        </MPageLayout>
      </div>
    </div>
    <voucherSignedBehalf :config="voucherSignedBehalfConfig" />
  </el-drawer>
</template>

<script>
import { getScheduleSignPage, getScheduleSessionList } from '@/api/deliver/scheduleManagement'
import watchPhoneNumber from '../../components/watchPhoneNumber.vue'
import voucherSignedBehalf from '../../studentManagement/components/voucherSignedBehalf.vue'
export default {
  components: {
    watchPhoneNumber,
    voucherSignedBehalf
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    scheduleId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      slotArr: ['footer', 'search', 'userPhone', 'certificateFileList'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'sessionDate', label: '签到场次', type: 'text', width: 140 },
          { prop: 'userName', label: '学员姓名', type: 'text' },
          { prop: 'userPhone', label: '学员电话', type: 'slot', width: '170px' },
          {
            prop: 'email',
            width: '170px',
            label: '邮箱',
            visible: true,
            isEmail: true,
            emailType: 'user'
          },
          { prop: 'signUserName', label: '签到人员', type: 'text' },
          { prop: 'signTime', label: '签到时间', type: 'text' },
          { prop: 'certificateFileList', label: '备注', type: 'slot' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      search: '',
      option: [],
      voucherSignedBehalfConfig: {
        data: [],
        visible: false
      }
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visibleDialog(val) {
      val && this.init()
    }
  },
  mounted() {},
  methods: {
    // 点击关闭
    close() {
      console.log('点击关闭')
      this.$emit('update:visible', false)
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 获取签到记录列表数据
    getList() {
      this.loading = true
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        scheduleId: this.scheduleId,
        sessionId: this.search
      }
      getScheduleSignPage(params).then(res => {
        this.loading = false
        this.config.tableData = res.data.records
        this.config.total = Number(res.data.total)
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.search = ''
      this.config.currentPage = 1
      this.getList()
      this.getScheduleSessionList()
    },
    // 获取场次列表
    getScheduleSessionList() {
      getScheduleSessionList(this.scheduleId).then(res => {
        this.option = res.data || []
      })
    },
    searchFn() {
      console.log('点击查询')
      this.config.currentPage = 1
      this.getList()
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
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    flex: 1 0 0;
    padding-top: 20px;
  }
}
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
}
::v-deep {
  .my-table {
    padding: 20px 20px 0;
  }
  .tablePage .page_content {
    padding-bottom: 0px!important;
  }
  .tablePage .page_footer {
    padding: 17px 0!important;
  }
}
</style>

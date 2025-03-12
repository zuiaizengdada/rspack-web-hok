<template>
  <!-- 直播列表 -->
  <MCard class="page_wrap">
    <filterTop
      :search="search"
      @onSearch="searchFn"
      @onClear="onClear"
    />
    <el-table
      ref="MPageLayout"
      v-loading="loading"
      type="tablePage"
      tooltip-effect="dark"
      height="100%"
      class="element-table-list"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5' }"
      :data="config.tableData"
      :table-columns="config.tableColumns"
    >
      <el-table-column label="直播间ID" prop="code" min-width="113px" />
      <el-table-column
        label="直播间名称"
        prop="name"
        min-width="190px"
        show-overflow-tooltip
      />
      <el-table-column label="出场顺序" prop="appearSequence" min-width="113px" />
      <el-table-column label="直播标签" prop="type" min-width="113px" align="center">
        <template slot-scope="{ row }">
          {{ {1:'正式', 2:'测试'}[row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="直播类型" prop="feesType" min-width="113px" align="center">
        <template slot-scope="{ row }">
          {{ {1:'免费', 2:'付费'}[row.feesType] }}
        </template>
      </el-table-column>
      <el-table-column label="直播模式" prop="liveModel" min-width="152px">
        <template slot-scope="{ row }">
          <div class="liveMode" :class="`liveMode${row.liveModel}`">
            <div style="display: flex; align-items: center">
              <svg-icon
                class-name="liveModeicon"
                :icon-class="
                  getOptionsValueByKey(
                    'value',
                    'icon',
                    row.liveModel,
                    liveModeOption
                  )
                "
              />{{ row.liveModel | getOptionsValue(liveModeOption) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="讲师" prop="ipNames" min-width="120px" />
      <el-table-column label="开播时间" prop="startTime" min-width="152px">
        <template slot-scope="{ row }">
          {{ moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="endTime" min-width="152px">
        <template slot-scope="{ row }">
          {{ row.endTime ? moment(row.endTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="直播时长(分)"
        prop="liveDuration"
        min-width="108px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ renderLiveDuration(row.liveDuration) }}
        </template>
      </el-table-column>
      <el-table-column label="直播状态" prop="status" min-width="114px">
        <template slot-scope="{ row }">
          <div class="liveType" :class="`liveType${row.status}`">
            <div style="display: flex; align-items: center">
              <svg-icon
                class-name="liveTypeicon"
                :icon-class="
                  {
                    0: 'livenostart',
                    1: 'liveIng',
                    2: 'liveSuspend',
                    3: 'liveError',
                    9: 'audit_info'
                  }[row.status]
                "
              />{{ row.status | getOptionsValue(liveStateOption) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUserName" min-width="114px" />
      <el-table-column label="创建时间" prop="createTime" min-width="172px">
        <template slot-scope="{ row }">
          {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>

    <div class="page_footer">
      <div />
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </MCard>
</template>

<script>
import filterTop from './filterTop'
import {
  getColumns,
  liveStateOption,
  liveModeOption,
  renderLiveDuration
} from '../../columns.js'
import { getOptionsValueByKey } from '@/filters/index'
import {
  getPlatformLiveRoomList
} from '@/api/liveRoom/index'
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      liveStateOption,
      liveModeOption,
      slotArr: ['action', 'search', 'footer', 'status', 'liveModel', 'doneOrderCount', 'gmv'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      // 查询条件
      search: {
        tenantId: '',
        type: '',
        feesType: '',
        liveRoomCode: '',
        liveRoomName: '',
        realityTeacherUserId: '',
        createUserId: '',
        liveModel: '',
        status: '',
        teacherId: '',
        teacherName: '',
        time: {
          value: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
          label: 1
        }
      },
      addConfig: {
        visible: false,
        type: 1
      },
      inviteConfig: {
        visible: false,
        row: {}
      },
      havDataStatistics: false,
      multipleSelection: [],
      enterLiveRoom: false,
      batchRestartLoading: false,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes']),
    ...mapState({
      ifAddLiveRoom: state => state.im.ifAddLiveRoom
    })
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    moment,
    renderLiveDuration,
    getOptionsValueByKey,
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        tenantId: this.search.tenantId,
        type: this.search.type,
        feesType: this.search.feesType,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        liveRoomCode: this.search.liveRoomCode,
        createUserId: this.search.createUserId,
        liveModel: this.search.liveModel,
        liveRoomName: this.search.liveRoomName,
        realityTeacherUserId: this.search.realityTeacherUserId,
        status: this.search.status,
        timeType: this.search.time.label,
        videoTeacherName: this.search.teacherName,
        videoTeacherId: this.search.teacherId,
        startTime:
          this.search.time.value && this.search.time.value[0]
            ? this.search.time.value[0] + ' 00:00:00'
            : '',
        endTime:
          this.search.time.value && this.search.time.value[1]
            ? this.search.time.value[1] + ' 23:59:59'
            : ''
      }
      this.config.tableData = []
      getPlatformLiveRoomList(params)
        .then(res => {
          res.data.items.map(v => {
            v.exportLoading = false
            v.batchRestartLoading = false
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
    // 查询
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置
    onClear() {
      this.search = {
        tenantId: '',
        type: '',
        feesType: '',
        liveRoomCode: '',
        liveRoomName: '',
        realityTeacherUserId: '',
        createUserId: '',
        liveModel: '',
        status: '',
        teacherId: '',
        teacherName: '',
        time: {
          value: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
          label: 1
        }
      }
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  height: calc(100vh - 220px);
  min-width: 1000px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}
.page_footer {
  padding: 0 20px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
// ::v-deep .tablePage .page_footer{
//   justify-content: space-between;
//   box-shadow: none;
//   padding:6px 0px 20px;
//   height:auto;
// }
// ::v-deep .page_header{
//   padding: 0!important;
// }
// ::v-deep .my-table{
//   margin:0!important
// }
.liveType,
.liveMode {
  display: inline-block;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding: 0 8px;
  border-radius: 13px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  height: 24px;
  line-height: 24px;
  .liveTypeicon,
  .liveModeicon {
    width: 13px;
    height: 13px;
    font-size: 13px;
    margin-right: 4px;
  }
}
.liveType0 {
  background: #eef2f9;
  color: #717f99;
}
.liveType1 {
  background: #e7f0ff;
  color: #1778ff;
}
.liveType2 {
  background: #fff2e6;
  color: #ff7d00;
}
.liveType3 {
  background: #feecec;
  color: #f53f3f;
}
.liveType9 {
  background: #f5f5f5;
  color: #999999;
}
.liveModePERSON_LIVE {
  background: #e7f0ff;
  color: #0c6fff;
}
.liveModeAI_LIVE {
  background: #e6f7ea;
  color: #00b42a;
}
.liveModeDIGITAL_PERSON_LIVE {
  background: #e7f9ff;
  color: #0099ff;
}
::v-deep {
  .tips {
    .tipsText {
      font-weight: 700;
      color: rgb(119, 119, 119);
      line-height: 23px;
      font-size: 14px;
      // line-height: 12px;
    }
    .iconText {
      margin-left: 2px;
      width: 14px;
      height: 14px;
    }
  }
}
</style>

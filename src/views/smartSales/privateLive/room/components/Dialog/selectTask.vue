<template>
  <AppDialog
    v-model="visible"
    title="选择任务"
    width="1200px"
    :loading="sureLoading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <!-- 选择直播间弹框 -->
    <div class="selectTask">
      <div class="filterHeader">
        <span class="formLabel">任务名称</span>
        <el-input
          v-model.trim="search.taskName"
          size="small"
          placeholder="请输入任务名称"
          style="width: 200px"
          class="m-r-10"
          clearable
          @keyup.enter.native="searchFn"
          @clear="searchFn"
        />
        <span class="formLabel">任务创建时间</span>
        <el-date-picker
          v-model="search.time.value"
          size="small"
          class="input-with-time m-r-10"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
          @change="handleClickSearch"
        />
        <span class="formLabel">创建人</span>
        <el-select
          v-model="search.userIds"
          size="small"
          filterable
          placeholder="请选择"
          clearable
          @change="searchFn"
        >
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
        <el-button
          size="small"
          class="m-l-10"
          type="primary"
          @click="searchFn"
        >搜索</el-button>
      </div>
      <div v-loading="loading" class="myTable">
        <el-table
          height="485"
          :header-cell-style="{
            background: '#EFF2F6',
            padding: '9px 0',
            color: '#333',
            'font-weight': 700,
            'letter-spacing': '1px'
          }"
          :data="list"
          :class="{ 'zb-table': true, 'el-table-null': !list.length }"
          @row-click="rowClick"
        >
          <el-table-column width="80" align="center">
            <template slot-scope="{ row }">
              <el-checkbox
                :value="selectIdsList.includes(row.id)"
                @change="rowClick(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="任务名称"
            prop="taskName"
            min-width="190px"
            show-overflow-tooltip
          />
          <el-table-column label="创建人" prop="createUserName" />
          <el-table-column label="创建时间" prop="createTime" min-width="152px">
            <template slot-scope="{ row }">
              {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <div class="tipsError">
            <span class="tips">已选{{ selectList.length }}项</span>
            <span
              v-if="selectList.length > 50"
              class="m-l-10"
            >您关联的任务超过50个，请重新选择！</span>
          </div>
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
    </div>

    <div slot="footer">
      <div class="ss-material-box-bottom">
        <el-button type="primary" size="small" @click="sure">确认</el-button>
        <el-button size="small" @click="closeFn">取消</el-button>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import { getOptionsValueByKey } from '@/filters/index'
import AppDialog from '@/components/AppDialog'
import { userNoPage } from '@/api/addressBookApi'
import { saleTaskPage } from '@/api/liveRoom/index.js'
import { liveModeOption } from '@/views/live/columns.js'
import moment from 'moment'
export default {
  components: {
    AppDialog
  },
  filters: {},
  props: {
    successFn: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      liveModeOption,
      top: '114px',
      sureLoading: false,
      loading: false,
      visible: false,
      list: [],
      scriptId: '',
      search: {
        taskName: '',
        userIds: '',
        time: {
          value: [
            moment().subtract(3, 'month').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ],
          label: 0
        }
      },
      userArray: [],
      currentPage: 1,
      pageSize: 10,
      success: () => {},
      total: 0,
      selectList: []
    }
  },
  computed: {
    selectIdsList() {
      return this.selectList.reduce((pre, next) => {
        pre.push(next.id)
        return pre
      }, [])
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.search.time.value = [
            moment().subtract(3, 'month').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
          val && this.getList()
          val && this.loadUserNoPage()
        }
      },
      deep: true
    }
  },
  beforeDestroy() {},
  mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    moment,
    getOptionsValueByKey,
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    rowClick(row) {
      const index = this.selectIdsList.findIndex(v => v === row.id)
      console.log(index)
      if (index > -1) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
    },
    sure() {
      if (this.selectList.length > 50) {
        return
      }
      this.success && this.success(this.selectList)
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        createUserId: this.search.userIds,
        taskName: this.search.taskName,
        startCreateTime:
          this.search.time.value && this.search.time.value[0]
            ? this.search.time.value[0] + ' 00:00:00'
            : '',
        endCreateTime:
          this.search.time.value && this.search.time.value[1]
            ? this.search.time.value[1] + ' 23:59:59'
            : ''
      }
      saleTaskPage(data)
        .then(res => {
          res.data.items.map(v => {
            v.taskId = v.id
            v.taskCreateId = v.createUserId
          })
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    closeFn() {
      this.visible = false
    },
    handleClickSearch() {
      this.searchFn()
    }
  }
}
</script>

<style lang='scss' scoped>
.selectTask {
  height: 611px;
  padding: 20px;
  .filterHeader {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    display: flex;
    align-items: center;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 32px;
      margin-right: 8px;
    }
  }
  .myTable {
    width: 100%;
    margin-top: 20px;
    height: 535px;
  }
  .pagination {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // justify-content: right;
  }
}
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
.tipsError {
  color: red;
  .tips {
    padding-left: 10px;
    color: #777;
  }
}
::v-deep .zb-table {
  width: 100%;
  border-left: 1px solid #eff2f6;
  border-right: 1px solid #eff2f6;
  border-radius: 6px;
  .el-table-null {
    border-bottom: 1px solid #eff2f6;
  }
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .el-table td.el-table__cell {
    border-bottom-color: #eff2f6;
  }
  .el-table::before {
    width: 0 !important;
    height: 0 !important;
  }
  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: none;
        .cell {
          color: #000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
        }
      }
    }
  }
}
</style>

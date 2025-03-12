<template>
  <AppDialog
    v-model="visible"
    title="选择模板"
    width="800px"
    :loading="sureLoading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <!-- 选择脚本弹框 -->
    <div
      v-loading="exportloading"
      class="selectLiveRoomScript"
      :element-loading-text="importStatusObj[importStatus]"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="filterHeader">
        <span class="formLabel">直播间名称</span>
        <el-input
          v-model.trim="search.name"
          size="small"
          placeholder="请输入直播间ID或名称查询"
          style="width: 240px"
          class="m-r-10"
          clearable
          @keyup.enter.native="searchFn"
          @clear="searchFn"
        />
        <el-button
          size="small"
          type="primary"
          @click="searchFn"
        >查询</el-button>
      </div>
      <div v-loading="loading" class="myTable">
        <el-table
          height="502"
          :header-cell-style="{ background: '#F3F3F3' }"
          :data="list"
          @row-click="rowClick"
        >
          <el-table-column width="55">
            <template slot-scope="{ row }">
              <el-radio v-model="checkId" :label="row.liveRoomId" @click.native.prevent>
                <span />
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="直播间ID" width="200" />
          <el-table-column prop="name" label="直播间名称" />
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
    </div>

    <div slot="footer">
      <div class="ss-material-box-bottom">
        <el-button v-if="!taskId" type="primary" size="small" @click="sure">确认</el-button>
        <el-button :loading="exportloading" size="small" @click="closeFn">取消</el-button>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { liveRoomScriptQuery, scriptImportChatRecord } from '@/api/liveRoom/index.js'
import { getScriptImportRecord } from '@/api/liveRoom/script.js'
export default {
  components: {
    AppDialog
  },
  filters: {
  },
  props: {
    successFn: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      top: '114px',
      sureLoading: false,
      loading: false,
      visible: false,
      list: [],
      scriptId: '',
      search: {
        name: ''
      },
      currentPage: 1,
      pageSize: 10,
      success: () => {},
      checkId: '',
      total: 0,
      timer: null,
      exportloading: false,
      taskId: '',
      importStatus: 0, // 导入状态 0: 导入中 1：导入成功 2：失败
      importStatusObj: {
        0: '正在导入中，请稍等片刻！',
        1: '导入成功',
        2: '导入失败'
      }
    }
  },
  computed: {
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.taskId = ''
          this.timer && clearInterval(this.timer)
          this.timer = null
          val && this.getList()
        } else {
          this.timer && clearInterval(this.timer)
          this.timer = null
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
    this.timer = null
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    rowClick(row) {
      console.log(row, 'row')
      if (row.liveRoomId === this.checkId) {
        this.checkId = ''
      } else {
        this.checkId = row.liveRoomId
      }
      console.log(this.checkId)
    },
    sure() {
      if (!this.checkId) {
        return this.$message.error('请先选择直播间')
      }
      this.sureLoading = true
      this.exportloading = true
      const data = {
        liveRoomId: this.checkId,
        scriptId: this.scriptId
      }
      scriptImportChatRecord(data).then(res => {
        // this.visible = false
        // this.exportloading = true
        this.taskId = res.data
        this.timer = setInterval(() => {
          this.getScriptImportRecord()
        }, 1000)
        // this.success && this.success()
      }).catch(() => {
        this.exportloading = false
        this.sureLoading = false
      })
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        queryValue: this.search.name
      }
      liveRoomScriptQuery(data).then(res => {
        console.log(res, 'res')
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
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
    // 获取任务进度
    getScriptImportRecord() {
      const data = {
        taskId: this.taskId
      }
      getScriptImportRecord(data).then(res => {
        if (res.data !== 0) {
          this.timer && clearInterval(this.timer)
          this.timer = null
        }
        if (res.data === 2) {
          this.taskId = ''
          this.$message.error('导出失败')
        }
        if (res.data === 1) {
          this.taskId = ''
          this.exportloading = false
          this.success && this.success()
        }
      })
    },
    closeFn() {
      this.timer && clearInterval(this.timer)
      this.timer = null
      this.visible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.selectLiveRoomScript {
  height: 628px;
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
      color: #333333;
      line-height: 32px;
      margin-right: 8px;
    }
  }
  .myTable {
    width: 100%;
    margin-top: 20px;
    height: 554px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #cbcfd3;
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

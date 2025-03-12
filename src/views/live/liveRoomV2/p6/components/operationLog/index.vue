<template>
  <!-- 操作记录 -->
  <div class="operation-log">
    <HokSearchForm :form-opts="formOpts" ref-obj.sync="operationLogRef" />
    <div class="myTable custom-table">
      <el-table
        v-loading="loading"
        height="100%"
        :data="list"
        :header-cell-style="{ background: '#EFF2F6', color: '#000' }"
        :cell-style="{ color: '#333' }"
      >
        <el-table-column prop="userName" label="用户姓名" align="center" />
        <el-table-column prop="phoneNumber" label="用户账号" width="150">
          <template slot-scope="{ row }">
            {{ row.phoneNumber || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operationModel"
          label="操作功能"
          align="center"
        />
        <el-table-column prop="currentContent" label="操作内容" align="center">
          <template slot-scope="scope">
            <div v-html="currentContentFiter(scope.row.currentContent)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label=" 操作时间"
          align="center"
        />
      </el-table>
    </div>
    <el-pagination
      class="pagination"
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
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { userNoPage } from '@/api/addressBookApi'
import { operationLogOpts } from '../../data'
import { operationQueryApi } from '@/api/liveRoom/setting.js'
import { filtersTextPhone } from '@/utils/index'
import { liveOperationType } from '@/views/live/columns.js'
import moment from 'moment'
import { cloneDeep } from 'lodash'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      } else {
        return moment(val).format('YYYY-MM-DD HH:mm')
      }
    }
  },
  components: {
    HokSearchForm
  },
  data() {
    return {
      loading: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      liveRoomId: this.$route.params.id,
      prizeDrawId: '',
      downLoading: false,
      showAction: true,
      total: 0,
      formOpts: {
        ...cloneDeep(operationLogOpts(this.searchFn).form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          { label: '重置', type: 'plain', fn: this.clearFn }
        ]
      }
    }
  },
  mounted() {
    this.loadUserNoPage()
    this.getList()
  },
  methods: {
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    clearFn() {
      this.formOpts.formData = cloneDeep(operationLogOpts().form.formData)
      this.getList()
    },
    loadUserNoPage(val) {
      userNoPage({
        deptId: '',
        nickName: val
      })
        .then(res => {
          this.$set(this.formOpts.optionsObj, 'userId', res.data)
        })
        .catch(() => {})
    },
    filtersTextPhone(str) {
      return filtersTextPhone(str)
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
    currentContentFiter(content) {
      // 匹配以 http 或 https 开头的图片链接
      const imgRegex = /@?(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif))/g

      // 使用 replace 方法将匹配到的链接转换为 <img> 标签
      const filteredContent = content.replace(imgRegex, match => {
        return `<img src="${match}" alt="Image" />`
      })

      return filteredContent
    },
    getList() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        ...this.formMat()
      }
      operationQueryApi(data)
        .then(res => {
          console.log(res)
          this.list = res.data.items
          this.total = res.data.total
          this.$nextTick(() => {
            this.$refs.elTable && this.$refs.elTable.doLayout()
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    formMat() {
      const req = cloneDeep(this.formOpts.formData)
      delete req.time
      console.log('this.formOpts.formData.time---', this.formOpts.formData.time)
      if (
        this.formOpts.formData.time &&
        this.formOpts.formData.time[0] &&
        this.formOpts.formData.time[1]
      ) {
        req.startTime = this.formOpts.formData.time[0]
        req.endTime = this.formOpts.formData.time[1]
      }
      for (const key in req) {
        if (req[key] === '') {
          delete req[key]
        }
      }
      return req
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.winnerUserId,
        phoneNum: params.winnerUserPhone,
        operationType: liveOperationType.type7
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    operationLogsWriteEmai(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.winnerUserId,
        email: params.email,
        queryType: 2,
        operationType: liveOperationType.type7
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-log {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 15px 0;
  .myTable {
    flex: 1 0 0;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid #f2f2f2;
  }
  .pagination {
    height: 68px;
    min-height: 68px;
    max-height: 68px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  .hok-search-form {
    margin-bottom: 0;
  }
  .el-table::before {
    height: 0px;
  }
}

::v-deep {
  /**改变边框颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border,
  .custom-table.el-table--group {
    border: 1px solid #eff2f6 !important;
  }
  /**改变表格内竖线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border td,
  .custom-table.el-table--border th,
  .custom-table.el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #eff2f6 !important;
  }
  /**改变合并单元格横线颜色===》.custom-table指定上面的类id */
  .custom-table .el-table--border th.el-table__cell {
    border-bottom: 1px solid #eff2f6;
  }
  /**改变表格内常规行线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table td,
  .custom-table.el-table th.is-leaf {
    border-bottom: 1px solid #eff2f6 !important;
  }
  .custom-table .el-table th.el-table__cell.is-leaf,
  .el-table td.el-table__cell {
    border-bottom: 1px solid #eff2f6 !important;
  }
}
</style>

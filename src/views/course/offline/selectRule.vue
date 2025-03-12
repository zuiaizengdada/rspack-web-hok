<template>
  <!-- 选择短信模板弹框 -->
  <AppDialog
    v-model="visible"
    title="选择规则库"
    top="5vh"
    width="916px"
    height="695px"
    :loading="loading"
    @success="successFn"
  >
    <div v-loading="loading" class="smsDialog overflowOuto">
      <div class="headerSearch">
        <el-form ref="form" :model="form" :inline="true" label-width="90px">
          <el-form-item label="规则库名称">
            <el-input
              v-model.trim="form.search"
              class="w-250 m-l-20"
              clearable
              @clear="sureSearch"
              @keyup.enter.native="sureSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="sureSearch"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        height="520px"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
        @row-click="selectFn"
      >
        <el-table-column width="35">
          <template slot-scope="{ row }">
            <svg-icon
              v-if="active.id === row.id"
              class-name="myRadioSelect"
              icon-class="radioChecked"
            />
            <div v-else class="myRadio" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="规则库名称" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column prop="updateUserName" label="更新人" />
        <el-table-column prop="buttons" label="操作">
          <template slot-scope="{ row }">
            <button @click.stop="handleDetails(row)">查看</button>
            <button style="margin-left: 10px" @click.stop="handleEdit(row)">
              编辑
            </button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :current-page.sync="current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <teachingList ref="teachingRef" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import teachingList from './teachingList.vue'
import { getWarehouse } from '@/api/course'
export default {
  components: {
    AppDialog,
    teachingList
  },
  data() {
    return {
      loading: false,
      form: {
        search: ''
      },
      visible: false,
      current: 1, // 当前页
      pageSize: 10, // 页数
      total: 0, // 总数
      tableData: [],
      active: {},
      type: {
        1: '验证码',
        2: '通知',
        3: '营销推广'
      }
    }
  },
  mounted() {},
  methods: {
    open(row = {}) {
      this.visible = true
      this.getList()
    },
    init() {
      this.current = 1
      this.total = 0
      this.form.search = ''
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        // channelId: 1,
        name: this.form.search,
        current: this.current,
        size: this.pageSize
        // customMsgType: 2 // 1: 普通 2：客服消息(短信模板中带有https://ap.hokkj.cn/pr/${userTaskId})
      }
      getWarehouse(params)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    sureSearch() {
      this.current = 1
      this.getList()
    },
    selectFn(row) {
      this.active = row
    },
    successFn() {
      this.$emit('handleOk', this.active)
      this.visible = false
    },
    handleDetails(row) {
      this.$refs.teachingRef.open(row)
    },
    handleEdit(row) {
      this.$refs.teachingRef.open(row, 'EDIT')
    }
  }
}
</script>

<style lang='scss' scoped>
.smsDialog {
  height: 695px;
  box-sizing: border-box;
  padding: 20px;
  .headerSearch {
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 20px;
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
.myRadioSelect {
  width: 12px;
  height: 12px;
  color: #409eff;
}
.myRadio {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
}
</style>

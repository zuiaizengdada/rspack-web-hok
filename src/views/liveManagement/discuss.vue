<template>
  <div>
    <!-- 讨论设置 -->
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="讨论审核">
        <el-switch v-model="form.moderation" />
      </el-form-item>
      <el-form-item label="讨论频次限制">
        <el-switch v-model="form.frequencyLimit" />
      </el-form-item>
    </el-form>

    <div>
      <el-table ref="table" :data="listData" border max-height="500" :row-key="(row) => row.phone" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column prop="date" label="用户名称" />
        <el-table-column prop="date" label="消息内容" />
        <el-table-column prop="date" label="状态" />
        <el-table-column prop="date" label="上墙情况" />
        <el-table-column prop="date" label="删除状态" />
        <el-table-column prop="date" label="发表时间" />
        <el-table-column label="操作" width="80" />
      </el-table>
      <div>
        <div class="fl m-t-20 m-b-20">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            <span v-if="multipleSelection.length === 0">选中本页</span>
            <span v-else class="des">已选{{ multipleSelection.length }}项</span>
          </el-checkbox>
        </div>
        <el-pagination
          class="fr m-t-20 m-b-20"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      form: {
        moderation: false,
        frequencyLimit: false
      },
      listData: [],
      isIndeterminate: false,
      checkAll: false, // 选择状态
      checkAllText: '选中本页', //
      checkList: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {},
  methods: {
    // 点击选中本页触发
    handleCheckAllChange(res) {
      this.$refs.table.toggleAllSelection()
      console.log(res, 'res')
    },
    handleSelectionChange(val) {
      console.log(val)
      if (val.length > 0) {
        this.isIndeterminate = true
        this.checkAll = false
      } else {
        this.isIndeterminate = false
        this.checkAll = false
      }
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    },
    // 条数改变
    handleSizeChange(val) {
      this.sizePage = val
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
}
</script>

<style lang='scss' scoped>
</style>

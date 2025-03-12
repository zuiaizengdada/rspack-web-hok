<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="80px" size="mini" inline>
      <el-form-item label="分组名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="敏感词">
        <el-input v-model="form.sensitiveWord" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="tableRef" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column v-for="item in columns" :key="item.id" :prop="item.prop" :label="item.name" />
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleClickEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleClickDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-between" style="width:100%;padding-top:12px;">
      <div class="checkAll">
        <el-checkbox v-model="checkedAll" style="margin-right:10px;" @change="handleClickAll">全选</el-checkbox>
        <el-button v-if="checkedAll" type="primary" size="mini" @click="handleClickDeleteSelectAll">批量删除</el-button>
      </div>
      <el-pagination
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :visible.sync="visibleDialogEdit" width="500px" title="编辑敏感词">
      <dialog-form :data="currentEditRow" @submit="dialogFormSubmit" @close="visibleDialogEdit=false" />
    </el-dialog>
  </div>
</template>
<script>
import { mockData } from './mock.js'
import DialogForm from './DialogForm.vue'
export default {
  components: {
    DialogForm
  },
  data() {
    return {
      form: {
        name: '',
        sensitiveWord: ''
      },
      columns: [
        {
          name: '分组名称',
          prop: 'name'
        },
        {
          name: '敏感词内容',
          prop: 'content'
        },
        {
          name: '操作人',
          prop: 'operaMan'
        }
      ],
      tableData: mockData,
      currentPage: 1,
      checkedAll: false,
      visibleDialogEdit: false,
      currentEditRow: {}
    }
  },
  mounted() {
    console.log(this.tableData, mockData, 'tableData')
  },
  methods: {
    handleSelectionChange() {},
    handleClickEdit(data) {
      console.log(data, 'data')
      this.visibleDialogEdit = true
      this.currentEditRow = {
        type: 1,
        typeContent: '张琦',
        sensitiveContent: '11\n22\n'
      }
    },
    handleClickDelete() {
      this.$confirm('确定要删除该敏感词吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {

      })
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    handleClickAll(val) {
      const table = this.$refs.tableRef
      console.log(table, 111)
      table.clearSelection()
      if (val) {
        table.tableData.forEach(row => {
          table.toggleRowSelection(row, true) // 选中每一行
        })
      }
    },
    handleClickDeleteSelectAll() {
      this.$confirm('确定要批量删除所有的敏感词吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {

      })
    },
    dialogFormSubmit() {}

  }

}
</script>

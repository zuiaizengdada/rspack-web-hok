<template>
  <div class="container">
    <div>
      <p class="flex items-center">
        <el-button size="mini" type="primary" style="margin-right:10px;" @click="onhandleClick">关联任务线索</el-button>
        <import-excel @upload="handleUploadExcel" />
      </p>
      <el-table v-if="taskList.length > 0" :header-cell-style="{ background: '#F3F3F3' }" :data="taskList" max-height="250" style="width: 600px" border size="mini" class="m-t-20">
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="createUserName" label="创建人" />
        <el-table-column>
          <template slot-scope="{ row }">
            <el-popconfirm title="确定删除?" @confirm="onhandleClickDel(row)">
              <el-button slot="reference" class="c_red" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="excelList.length > 0" class="excel-list" style="margin-top: 10px;">
        <el-tag
          v-for="(tag,index) in excelList"
          :key="tag"
          closable
          style="margin-right:10px;margin-bottom:6px;"
          @close="handleClose(index)"
        >
          {{ tag.file }}
        </el-tag>
      </div>

    </div>
  </div>
</template>
<script>

import Dialog from '@/views/live/Dialog/index.js'

import ImportExcel from './ImportExcel.vue'
export default {
  components: {
    ImportExcel
  },
  data() {
    return {
      taskList: [],
      excelList: []
    }
  },
  methods: {
    handleUploadExcel(data) {
      console.log(this.excelList.length, '上传成功excel')
      if (this.excelList.length > 9) {
        this.$message.error('最多支持上传10个excel')
      } else {
        this.excelList.push(data)
        this.$emit('upload', this.excelList)
      }
    },
    onhandleClick() {
      Dialog.open({
        type: 'SelectTask',
        selectList: JSON.parse(JSON.stringify(this.taskList)),
        success: (res) => {
          this.taskList = res
          Dialog.close()
          this.$emit('select', res)
        }
      })
    },
    onhandleClickDel(row) {
      const index = this.taskList.findIndex(v => v.id === row.id)
      index > -1 && this.taskList.splice(index, 1)
      this.$emit('select', this.taskList)
    },
    handleClose(index) {
      this.excelList.splice(index, 1)
      this.$emit('select', this.excelList)
    }
  }
}
</script>

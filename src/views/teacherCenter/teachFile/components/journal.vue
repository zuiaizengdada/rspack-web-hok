<template>
  <el-dialog title="日志" width="600px" :visible.sync="visible" class="dialog-container">
    <div v-for="item in items" :key="item.teacherName + item.createUserName" class="dialog-item">
      <div style="flex:2">{{ item.createTime }}</div>
      <div>{{ item.createUserName }}</div>
      <div style="flex:3">{{ `修改IP姓名【${item.teacherBeforeName}】为:${item.teacherName}` }}</div>
    </div>
    <img
      v-if="!items.length"
      rc="~@/assets/image/findTeacherNodata.png"
      alt=""
    />
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" @click="visible = false">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { teacherLogDetail } from '@/api/tearchCenter/index'
import { getColumns } from './column'
export default {
  data() {
    return {
      visible: false,
      items: [],
      teacherId: '',
      columns: getColumns.call(this)
    }
  },
  methods: {
    open(row) {
      this.teacherId = row.teacherId
      this.items = []
      this.visible = true
      this.getList()
    },
    async getList() {
      const { data } = await teacherLogDetail({
        teacherId: this.teacherId
      })
      this.items = data || []
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep{
    .el-dialog{
        border-radius: 6px;
    }
    img{
        height: 160px;
        width: 260px;
        margin: 0 auto;
    }
    .dialog-item{
        display: flex;
        color: #333;
        div{
            flex:1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .el-dialog__body{
        padding: 15px 20px;
    }
}

</style>

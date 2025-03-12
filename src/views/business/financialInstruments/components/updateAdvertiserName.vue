<template>
  <div>
    <el-dialog title="备注" :visible.sync="dialogFormVisible" :append-to-body="true" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item label="设置备注：" :label-width="formLabelWidth">
          <el-input v-model="form.aliasName" maxlength="20" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureToSet">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setAdvertiserName } from '@/api/business/financial'
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      dialogFormVisible: false,
      row: {
        advertiseChannel: '',
        advertiserId: ''
      },
      form: {
        aliasName: ''
      },
      formLabelWidth: '120px'
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    sureToSet() {
      const params = {
        advertiserId: this.row.advertiserId,
        advertiseChannel: this.row.advertiseChannel,
        aliasName: this.form.aliasName
      }
      setAdvertiserName(params).then(res => {
        console.log(res)
        if (res.code === 1) {
          this.$message.success('设置成功！')
          this.dialogFormVisible = false
          this.$emit('loadData')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>


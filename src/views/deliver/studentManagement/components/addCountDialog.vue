<template>
  <AppDialog
    v-model="visible"
    title="增加次数"
    width="400px"
    height="200px"
    @success="hanldeSubmit"
  >
    <el-form ref="form" class="inner-form" :model="form" label-width="80px">
      <el-form-item label="操作人"> {{ row.operatorUserName }} </el-form-item>
      <el-form-item label="增加次数">
        <m-select
          v-model="form.defaultNumType"
          :request="getDeliveryDict"
          :param="{ value: 'type', label: 'label' }"
          placeholder="请选择单人单天默认次数"
          style="width: 200px"
        />
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getSettingAdd, getDeliveryDict } from '@/api/deliver/studentManagement'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      form: {},
      visible: false,
      row: {}
    }
  },
  methods: {
    getDeliveryDict() {
      return getDeliveryDict({ key: 'ReplacementEnrollmentDefaultNumType' })
    },
    async hanldeSubmit() {
      const { code, msg } = await getSettingAdd({
        id: this.row.id,
        num: this.form.defaultNumType
      })
      if (code === 1) {
        this.$message.success('增加成功')
        this.$emit('onOk')
        this.visible = false
        this.form = {}
      } else {
        this.$message.error(msg)
      }
    },
    open(row) {
      this.visible = true
      this.row = row
    }
  }
}
</script>

<style></style>

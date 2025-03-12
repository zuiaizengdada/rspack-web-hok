<template>
  <AppDialog
    v-model="visible"
    title="新增"
    width="518px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="editRemarks overflowOuto">
      <el-form label-position="top" label-width="auto" :model="form" size="small">
        <el-form-item label="客服名称">
          <el-input v-model="form.name" type="textarea" :rows="6" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="过期时间">
          <el-date-picker v-model="form.time" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="选中人员">
          <!-- <el-button></el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: { AppDialog },
  data() {
    return {
      form: {
        name: '',
        time: '',
        userList: []
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>

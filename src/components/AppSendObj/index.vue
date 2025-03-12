<template>
  <AppDialog v-model="visible" :title="title" width="900px" height="600px" top="10vh">
    <div v-if="visible" v-loading="loading" class="choose_resource">
      <el-tabs tab-position="left" style="height: 100%" type="border-card">
        <el-tab-pane label="按专栏">
          <column :column-disabled-fn="columnDisabledFn" @sureColumn="sureColumn" />
        </el-tab-pane>
        <el-tab-pane label="按用户">
          <user :user-disabled-fn="userDisabledFn" @successData="userDataFn" @successObj="userSearchFn" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import column from './column.vue'
import user from './user.vue'
export default {
  components: {
    AppDialog,
    column,
    user
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    success: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      columnDisabledFn: () => true,
      userDisabledFn: () => true
    }
  },
  mounted() {},
  methods: {
    // 按专栏选择
    sureColumn(res) {
      this.visible = false
      this.success && this.success({ type: 1, value: res })
    },
    // 勾选条件
    userDataFn(res) {
      this.visible = false
      this.success && this.success({ type: 2, value: res })
    },
    // 查询条件
    userSearchFn(res) {
      this.visible = false
      this.success && this.success({ type: 3, value: res })
    }
  }
}
</script>

<style lang='scss' scoped>
.choose_resource {
  width: 900px;
  height: 600px;
}
</style>

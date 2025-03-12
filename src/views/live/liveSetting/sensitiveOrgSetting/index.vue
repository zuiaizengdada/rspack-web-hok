<template>
  <div class="container relative" style="padding:20px;">
    <div class="buttons">
      <el-button size="mini" type="primary" @click="visibleDialogAdd=true">新增敏感词</el-button>
      <el-button size="mini" @click="handleClickVisibleDialogImport">导入</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in headerTabs" :key="item.id" :label="item.label" :name="item.label">
        <component :is="item.component" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="新增敏感词" :visible.sync="visibleDialogAdd" width="500px">
      <dialog-form @submit="dialogFormSubmit" @close="visibleDialogAdd=false" />
    </el-dialog>
    <dialog-import ref="dialogImport" :visible.sync="visibleDialogImport" />
  </div>
</template>
<script>
import sensGroup from './sensGroup.vue'
import sensIp from './sensIp.vue'
import sensVideo from './sensVideo.vue'
import DialogForm from './DialogForm.vue'
import DialogImport from './DialogImport.vue'
export default {
  components: {
    sensGroup,
    sensIp,
    sensVideo,
    DialogForm,
    DialogImport
  },
  data() {
    return {
      headerTabs: [{ label: 'IP老师敏感词', component: sensIp, id: 1 }, { label: '视频敏感词', component: sensVideo, id: 2 }, { label: '分组敏感词', component: sensGroup, id: 3 }],
      activeName: 'IP老师敏感词',
      visibleDialogAdd: false,
      visibleDialogImport: false
    }
  },
  methods: {
    dialogFormSubmit() {},
    handleClickVisibleDialogImport() {
      this.$refs.dialogImport.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.buttons{
  position: absolute;
  right:20px;
  top:24px;
  z-index: 10;
}
</style>

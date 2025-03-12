<template>
  <el-dialog title="企微欢迎语" :visible.sync="visible" width="600px">
    <div class="dialog-container">
      <span>任务中通用欢迎语优先级高于个人设置，若任务中通用欢迎语已设置欢迎语超过9条，此处设置无效</span>
      <welcomeMessageSettings
        ref="welcomeMessageSettings"
        :type-tour="false"
        class="welBox"
        :hide-title="true"
        :is-wx-off="false"
        @change="getTaskWelcomes"
      />
      <div class="flex-right flex">
        <el-button
          v-if="contentId"
          type="primary"
          size="small"
          @click="del(row)"
        >删除个人欢迎语</el-button>
        <el-button
          type="primary"
          size="small"
          @click="openSave"
        >保存</el-button>
        <el-button
          size="small"
          @click="close"
        >取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import welcomeMessageSettings from '../../../components/welcomeMessageSettings'
import { ITaskWelcomeGet, ITaskWelcomSaveOrUpdate } from '@/api/privateArea/CRM'
export default {
  components: {
    welcomeMessageSettings
  },
  data: () => ({
    form: {},
    visible: false,
    contentId: ''
  }),
  methods: {
    open(row) {
      this.visible = true
      this.taskId = row.id
      this.getData()
    },
    async getData() {
      const { data } = await ITaskWelcomeGet({
        taskId: this.taskId
      })
      this.form = data ?? []
      this.$nextTick(() => {
        const welcomeMessageSettings = this.$refs.welcomeMessageSettings
        const obj = data.find(i => i.content) ?? {}
        welcomeMessageSettings.form.content = obj.content
        this.contentId = obj.id
        welcomeMessageSettings.items = data.filter(i => !i.content)
      })
    },
    close() {
      this.visible = false
    },
    del() {
      this.$delModal({
        tips: '确认删除个人欢迎语吗',
        success: async () => {
          const { code } = await ITaskWelcomSaveOrUpdate({
            itaskWelcomes: [],
            taskId: this.taskId
          })
          if (code === 1) {
            this.visible = false
            this.$message.success('删除成功')
          }
        }
      })
    },
    getTaskWelcomes(data) {
      console.log(data)
    },
    async openSave() {
      const itaskWelcomes = this.$refs.welcomeMessageSettings.getItems()
      itaskWelcomes.forEach(i => {
        if (i.content && this.contentId) {
          i.id = this.contentId
        }
      })
      const { code } = await ITaskWelcomSaveOrUpdate({
        itaskWelcomes,
        taskId: this.taskId
      })
      if (code === 1) {
        this.visible = false
        this.$message.success('保存成功')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-container {
  font-size: 14px;
  color: #333;
  .reply-right {
    padding: 20px 0px;
    .reply-right-btn{
       margin: 0px 0 20px 0;
    }
  }
  .el-textarea{
    width: 100%;
  }
}
</style>

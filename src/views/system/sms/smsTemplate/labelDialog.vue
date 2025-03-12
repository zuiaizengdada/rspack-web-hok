<template>
  <AppDialog
    v-model="config.visible"
    title="标签"
    width="530px"
    :loading="loading"
    height="auto"
    :footer-text="['提交', '取消']"
    @success="sure"
  >
    <div v-loading="loading" class="labelDialog overflowOuto">
      <div>
        <label class="labelName">标签</label>
        <!-- <el-input v-model.trim="labelName" :disabled="labelList.length >= 5" placeholder="请输入" style="width: 450px" maxlength="30" show-word-limit @keyup.enter.native="addLabel" /> -->
        <LabelInput
          ref="LabelInput"
          v-model.trim="labelName"
          maxlength="30"
          placeholder="请输入"
          show-word-limit
          :disabled="labelList.length >= 5"
          @keyup.enter.native="addLabel"
          @select="labelSelect"
        />
      </div>
      <div class="tips">注：输入一个关键词后，按回车生成标签</div>
      <div v-if="labelList.length > 0" class="labelList">
        <el-tag v-for="(tag, index) in labelList" :key="index" class="m-r-10 m-b-16" closable @close="delLabel(index)">{{ tag.name }}</el-tag>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getDetailById, updateTagList } from '@/api/system/sms.js'
import LabelInput from './labelinput.vue'
export default {
  components: {
    AppDialog,
    LabelInput
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          standardTemplateId: '',
          templateId: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      labelName: '',
      labelList: []
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        val && this.getDetail()
        this.labelName = ''
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    sure() {
      this.loading = true
      const data = {
        standardTemplateId: this.config.standardTemplateId,
        tags: this.labelList
      }
      updateTagList(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.$emit('success')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addLabel() {
      if (!this.labelName) {
        return
      }
      if (this.labelList.length >= 5) {
        return this.$message.error('最多只能设置5个标签')
      }
      const obj = this.labelList.find(v => v.name === this.labelInput)
      if (!obj) {
        this.$refs.LabelInput && this.$refs.LabelInput.cancel()
        this.labelList.push({ id: '', name: this.labelName })
        this.labelName = ''
      } else {
        this.labelInput = ''
      }
    },
    labelSelect(val) {
      const obj = this.labelList.find(v => v.name === val.name)
      if (!obj) {
        this.labelList.push({ name: val.name, id: val.id })
      }
    },
    // 删除标签
    delLabel(index) {
      this.labelList.splice(index, 1)
    },
    getDetail() {
      this.loading = true
      getDetailById(this.config.templateId).then(res => {
        this.labelList = res.data.tagList || []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.labelDialog {
  padding: 16px;
  min-height: 172px;
  max-height: 300px;
  .labelName {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    font-weight: 500;
    line-height: 22px;
    margin-right: 8px;
  }
  .tips {
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: calc(2em + 8px);
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
  .labelList {
    width: 450px;
    margin-left: calc(2em + 8px);
    border-radius: 6px;
    border: 1px dashed #979797;
    padding: 18px 16px 0;
  }
}
::v-deep {
  .labelInput {
    width: 450px!important;
  }
}
</style>

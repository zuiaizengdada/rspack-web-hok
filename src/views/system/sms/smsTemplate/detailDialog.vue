<template>
  <AppDialog
    v-model="config.visible"
    title="详情"
    width="694px"
    :loading="loading"
    height="auto"
  >
    <div v-loading="loading" class="detailDialog overflowOuto">
      <div v-for="(item) in formColumn" :key="item.key" class="formBox">
        <div class="formLabel">{{ item.label }}</div>
        <div class="formValue">
          <template v-if="item.key === 'tagList'">
            <div v-for="(tag) in detail[item.key]" :key="tag.tagId" class="tagListLabel">{{ tag.name }}</div>
          </template>
          <template v-else-if="item.key === 'sceneLink'">
            <a class="sceneLink" :href="detail[item.key]" target="_blank">{{ detail[item.key] }}</a>
          </template>
          <template v-else-if="item.key === 'examineStatus'">
            <div class="examineStatus" :style="{ background: getOptionsValueByKey('value', 'background', detail.examineStatus, examineStatusOption), color: getOptionsValueByKey('value', 'color', detail.examineStatus, examineStatusOption) }">
              <svg-icon class-name="examineStatusicon" :icon-class="getOptionsValueByKey('value', 'icon', detail.examineStatus, examineStatusOption)" />
              {{ getOptionsValueByKey('value', 'label', detail.examineStatus, examineStatusOption) }}
            </div>
          </template>
          <template v-else>
            {{ detail[item.key] }}
          </template>
        </div>
      </div>
    </div>
    <div slot="footer" class="detailFooter">
      <el-button v-if="detail.examineStatus === 3" type="primary" size="small" :loading="loading" @click="onhandleAlignApply">重新发起申请</el-button>
      <el-button v-if="detail.editFlag" size="small" :loading="loading" @click="onhandleEdit">编辑</el-button>
      <el-button size="small" :loading="loading" @click="config.visible = false">关闭</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getOptionsValueByKey } from '@/filters'
import { examineStatusOption } from './columns.js'
import { getDetailById, reapplySmsChannelTemplate } from '@/api/system/sms.js'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          id: ''
        }
      }
    }
  },
  data() {
    return {
      examineStatusOption,
      loading: false,
      formColumn: [
        { label: '模版名称：', key: 'templateName' },
        { label: '模版类型：', key: 'smsTypeName' },
        { label: '标签：', key: 'tagList' },
        { label: '模版内容：', key: 'channelTemplateContent' },
        { label: '场景链接：', key: 'sceneLink' },
        { label: '场景说明：', key: 'sceneDescription' },
        { label: '创建时间：', key: 'createTime' },
        { label: '创建人：', key: 'createUserName' },
        { label: '渠道商名称：', key: 'channelName' },
        { label: '审核状态：', key: 'examineStatus' },
        { label: '审批内容：', key: 'examineContent' }
      ],
      detail: {
        channelName: '',
        channelTemplateContent: '',
        createTime: '',
        createUserName: '',
        examineContent: '',
        examineStatus: 0,
        examineStatusName: '',
        id: 0,
        sceneDescription: '',
        sceneLink: '',
        smsTypeName: '',
        standardTemplateId: 0,
        tagList: [],
        templateName: '',
        editFlag: false // 是否显示编辑按钮
      }
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        val && this.getDetail()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    getOptionsValueByKey,
    getDetail() {
      this.loading = true
      getDetailById(this.config.id).then(res => {
        this.detail = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击编辑按钮跳转编辑页面
    onhandleEdit() {
      this.config.visible = false
      this.$router.push(`/system/systemSms/smsTemplate/${this.config.id}`)
    },
    // 点击重新发起申请按钮
    onhandleAlignApply() {
      this.loading = true
      reapplySmsChannelTemplate(this.config.id).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.$emit('success')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.detailDialog {
  padding: 16px;
  height: 575px;
  .formBox {
    display: flex;
    margin-bottom: 16px;
    .formLabel {
      width: 96px;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      text-align: right;
    }
    .formValue {
      padding-top: 2px;
      flex: 1 0 0;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
    }
  }
}
.detailFooter {
  padding-right: 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.examineStatus {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  line-height: 12px;
  .examineStatusicon {
    width: 12px;
    height: 12px;
    font-size: 12px;
    margin-right: 4px;
  }
}
.tagListLabel {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 10px;
  padding: 4px 8px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #0C6FFF;
  line-height: 20px;
  background: #E7F0FF;
  border-radius: 4px;
  border: 1px solid #DAE9FF;
}
.sceneLink {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #0C6FFF;
  line-height: 22px;
  text-decoration:underline;
  cursor: pointer;
}
</style>

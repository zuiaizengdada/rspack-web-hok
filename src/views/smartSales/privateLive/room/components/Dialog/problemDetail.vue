<template>
  <el-drawer
    :visible.sync="visible"
    title="查看"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    size="540px"
    direction="rtl"
    :loading="loading"
  >
    <div v-loading="loading" class="drawerBody overflowOuto">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">详情</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent  overflowOuto">
        <div class="problemDetail">
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">画面问题：</div>
            <div class="problemDetailFormValue">{{ detail.frameQuestion }}</div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">声音问题：</div>
            <div class="problemDetailFormValue">{{ detail.soundQuestion }}</div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">体验问题：</div>
            <div class="problemDetailFormValue">{{ detail.userExperienceQuestion }}</div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">问题描述：</div>
            <div class="problemDetailFormValue">{{ detail.questionDesc }}</div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">版本号：</div>
            <div class="problemDetailFormValue">{{ detail.version }}</div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">反馈人手机号：</div>
            <div class="problemDetailFormValue">{{ detail.feedbackPhone }}</div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">反馈时间：</div>
            <div class="problemDetailFormValue">{{ detail.createTime | filterTime }}</div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">解决状态：</div>
            <div class="problemDetailFormValue">
              <MIconStatus
                :background="getOptionsValueByKey('value','background',detail.status,option)"
                :color="getOptionsValueByKey('value','color', detail.status,option)"
                :icon-class="getOptionsValueByKey('value', 'icon', detail.status, option)"
                :title="getOptionsValueByKey('value','label',detail.status,option)"
              />
            </div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">处理人：</div>
            <div class="problemDetailFormValue">{{ detail.handleUserName }}</div>
          </div>
          <div class="problemDetailForm">
            <div class="problemDetailFormLabel">处理时间：</div>
            <div class="problemDetailFormValue">{{ detail.handleTime | filterTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { getOptionsValueByKey } from '@/filters/index'
import { getQuestionFeedbackDetail } from '@/api/liveRoom/problemFeedback.js'
import moment from 'moment'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      } else {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      visible: false,
      option: [],
      questionFeedbackId: '',
      detail: {
        id: '',
        frameQuestion: '',
        soundQuestion: '',
        experiuserExperienceQuestionenceMatters: '',
        questionDesc: '',
        version: '',
        feedbackPhone: '',
        createTime: '',
        status: 1,
        handleUserName: '',
        handleTime: ''
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.getDetail()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    getOptionsValueByKey,
    close() {
      this.visible = false
    },
    getDetail() {
      this.loading = true
      const data = {
        questionFeedbackId: this.questionFeedbackId
      }
      getQuestionFeedbackDetail(data).then(res => {
        this.detail = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    padding: 20px;
    flex: 1 0 0;
    .problemDetailForm {
      padding: 18px 0;
      // // background: #F2F9FF;
      // border-radius: 8px;
      // display: flex;
      // flex-wrap: wrap;

    }
  }
}
.btn_close {
  transform: rotate(180deg);
}
::v-deep {
  .el-questionDescriptions__body {
    background-color: transparent;
    .my-label {
      width: 112px;
      text-align: right;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
    }
    .my-content {
      padding-top: 1px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
      display: flex;
      flex-wrap: wrap;
    }
    .el-questionDescriptions-item__label:not(.is-bordered-label) {
      margin-right: 8px;
    }
  }
  .el-questionDescriptions--medium:not(.is-bordered) .el-questionDescriptions-item__cell {
    padding-bottom: 16px;
  }
}
.problemDetail {
  .problemDetailForm {
    display: flex;
    flex-wrap: wrap;
    background: #F2F9FF;
    .problemDetailFormLabel {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      width: 120px;
      text-align: right;
    }
    .problemDetailFormValue {
      flex: 1 0 0;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
  }
}
</style>

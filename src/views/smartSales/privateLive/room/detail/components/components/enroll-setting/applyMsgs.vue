<template>
  <el-form ref="applyMsgsForm" :model="list" size="small" class="marginTop_16">
    <div class="applyMsgsForm-title">{{ list.msgType === 1 ? '短信通知':'公众号通知' }}</div>
    <div class="applyMsgs-sendMsgFlag marginTop_5">
      <div class="applyMsgs-laber">发送通知</div>
      <el-switch
        v-model="list.sendMsgFlag"
        :active-value="1"
        :inactive-value="0"
        :disabled="isEdit"
      />
      <span v-show="!list.sendMsgFlag" class="applyMsgs-tip">{{ list.msgType === 1 ? '短信通知':'公众号通知' }}将不会发送</span>
    </div>
    <div v-for="(value,index) in list.applyMsgs" :key="index" class="applyMsgs-container">
      <div class="applyMsgs-item">
        <div class="applyMsgs-laber">通知时间</div>
        <div class="order-time-box">
          <el-select v-model="value.timeType" :disabled="isEdit || value.isSent === 1" placeholder="请选择模版" class="input-with-select input-with-select-chang" @change="optionsTimeChange($event,index)">
            <el-option v-for="item in optionsTime" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-form-item
            :rules="{
              required: true, message: '时间不能为空', trigger: 'change'
            }"
            :prop="'applyMsgs.'+index+'.timeMinute'"
          >
            <el-time-picker
              v-model="value.timeMinute"
              :disabled="isEdit || value.isSent === 1"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:00',
              }"
              :default-value="new Date(0,0,0,0,0,0)"
              format="HH小时mm分钟"
              value-format="HH:mm"
              style="width:155px; height:36px;"
              placeholder="请选择时间"
            />
          </el-form-item>
        </div>
        <div class="m-l-20">
          <el-button v-if="list.applyMsgs.length === index + 1" :disabled="isEdit" plain icon="el-icon-plus" circle style="border-radius:0;border: 1px dashed #DCDCDC;" @click="addApplyMsgs" />
          <el-button v-if="list.applyMsgs.length !== 1" :disabled="isEdit || value.isSent === 1" plain icon="el-icon-minus" circle style="border-radius:0;border: 1px dashed #DCDCDC;" @click="delApplyMsgs(index)" />
        </div>
      </div>
      <div class="applyMsgs-item alignItemsStart">
        <div class="applyMsgs-laber">{{ config.msgType === 1 ? '短信模版':'公众号模版' }}</div>
        <div style="flex:1;">
          <el-form-item
            :rules="{
              required: true, message: '模版不能为空', trigger: 'change'
            }"
            :prop="'applyMsgs.'+index+'.msgTemplateId'"
          >
            <el-select
              v-model="value.msgTemplateId"
              style="width:245px;"
              clearable
              :disabled="isEdit || value.isSent === 1"
              @change="msgTemplateChange"
            >
              <el-option
                v-for="item in handleMsgTemplatesList(value.timeType)"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div v-if="value.msgTemplateId" class="applyMsgsTemplate-content">
            <div>{{ msgTemplateChange(value.msgTemplateId, value.isSent).title }}：</div>
            <div>{{ msgTemplateChange(value.msgTemplateId, value.isSent).templateContent }}</div>
          </div>
        </div>
      </div>

    </div>
  </el-form>
</template>

<script>
import { liveMsgTemplatesAjax } from '@/api/liveRoom/register'

export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    applyOfficialId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      startTime: '',
      optionsTime: [
        { label: '直播前', value: 1 },
        { label: '直播中', value: 2 }
      ],
      msgTemplatesList: [],
      isSentMsgTemplatesList: [], // 已发送消息的模版
      templateContent: ''
    }
  },
  computed: {
    list() {
      return this.config
    }
  },
  watch: {
    applyOfficialId: {
      handler(val) {
        this.clearLiveMsgTemplates()
      }
    }
    // config: {
    //   handler(val) {
    //     console.log(val)
    //   },
    //   deep: true
    // }
  },
  created() {
    this.getLiveMsgTemplates()
  },
  methods: {
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    handleMsgTemplatesList(timeType) {
      return this.msgTemplatesList.filter(item => item.timeType === timeType)
    },
    // 添加模板
    addApplyMsgs() {
      if (this.list.applyMsgs.length === 2) {
        return this.$message.warning('最多添加2条通知')
      }
      const list = {
        timeMinute: '',
        timeType: 1,
        msgTemplateId: '',
        id: ''
      }
      this.list.applyMsgs.push(list)
    },
    // 减少模版
    delApplyMsgs(index) {
      this.list.applyMsgs.splice(index, 1)
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    // 获取模版数据
    getApplyMsgs() {
      return this.list
    },
    // 重置模版
    clearLiveMsgTemplates() {
      this.list.applyMsgs.forEach(item => {
        // 已发送模版不重置
        if (!item.isSent) {
          item.msgTemplateId = ''
        }
      })
      this.getLiveMsgTemplates()
    },
    // 获取消息模版列表
    getLiveMsgTemplates() {
      const officialId = this.config.msgType === 2 ? this.applyOfficialId : ''
      const params = {
        msgType: this.list.msgType,
        officialId
      }
      liveMsgTemplatesAjax(params).then(res => {
        this.msgTemplatesList = res.data
        this.isSentMsgTemplatesList.length === 0 && (this.isSentMsgTemplatesList = res.data)
      })
    },
    // 模版change
    msgTemplateChange(e, isSent) {
      const list = isSent ? this.isSentMsgTemplatesList : this.msgTemplatesList
      return list.find(item => item.id === e) || []
    },
    // 直播前 change
    optionsTimeChange(e, index) {
      this.list.applyMsgs[index].msgTemplateId = ''
    },
    validate(callback) {
      this.$refs.applyMsgsForm.validate((valid) => {
        callback(valid)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .applyMsgs-item {
    display: flex;
    align-items: top;
  }
  .applyMsgs-sendMsgFlag {
    display: flex;
    align-items: center;
  }
  .alignItemsStart {
    align-items: flex-start !important;
  }
  .applyMsgs-laber {
    width: 85px;
    margin-right: 10px;
  }
  .applyMsgsForm-title {
    font-size: 16px;
   font-family: PingFangSC-Regular, PingFang SC;
    color: #333333;
  }

  .applyMsgsTemplate-content {
    background: #F5F5F5;
    border-radius: 4px;
    line-height: 20px;
    // margin-bottom: 18px;
    padding: 8px;
    font-size: 14px;
    color: #333333;
  }
  .order-time-box {
    display: flex;
  }
  .input-with-select {
    width: 90px;
    height: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    border-radius: 3px 0px 0px 3px;
  }
  .input-with-select-chang {
    ::v-deep  .el-input__inner {
      border: none;
      border-radius: 3px 0px 0px 3px;
      border: 1px solid #D8DCE6;
      border-right: none;
    }
  }
  .applyMsgs-tip {
    font-size: 12px;
    color: rgb(245, 63, 63);
    transition: all 0.2s;
    margin-left: 10px;
  }

::v-deep .el-input__inner{
   border-radius: 0px 3px 3px 0px;
}
// ::v-deep .el-input__prefix {
//   right: -50px;
//   height: 36px;
// }
.applyMsgs-container {
  margin-top: 16px;
}
.marginTop_0 {
  margin-top: 0;
}
.marginTop_5 {
  margin-top: 5px;
}
.marginTop_16 {
  margin-top: 16px;
}
</style>

<template>
  <el-dialog
    class="setting-rule-dialog"
    :visible.sync="visible"
    width="648px"
    :before-close="handleCancel"
    :show-close="false"
    :destroy-on-close="true"
    :wrapper-closable="false"
    :close-on-click-modal="false"
    :modal="false"
  >
    <div slot="title" class="ss-material-box-header">
      <div class="ss-material-box-header-title">闯关模式-设置规则</div>
      <i class="el-icon-close close" @click="handleCancel" />
    </div>

    <div class="rule-box">
      <div class="rule-box-item">
        <div class="rule-box-item-title">图片</div>
        <div class="rule-box-item-tip">点击目录查看图片即为闯关成功！</div>
      </div>

      <div class="rule-box-item">
        <div class="rule-box-item-title">视频</div>
        <div class="rule-box-item-tip">
          <span>观看单个视频进度</span>
          <el-input
            v-model.number="configData.videoProgress"
            type="number"
            :min="1"
            :max="100"
            style="width: 120px; margin: 0 10px"
            @input="handleVideoProgressInput"
          />
          <span style="margin-right: 10px">%</span>
          <span>即为闯关成功！</span>
        </div>
      </div>

      <div class="rule-box-item">
        <div class="rule-box-item-title">直播</div>
        <div class="rule-box-item-tip">进入直播即为闯关成功！</div>
      </div>

      <div class="rule-box-item">
        <div class="rule-box-item-title">打卡</div>
        <div class="rule-box-item-tip">完成打卡即为闯关成功！</div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="handleSubmit">
        保存
      </el-button>
      <el-button size="mini" @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SettingRuleDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    configData: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
    },
    handleVideoProgressInput(val) {
      const value = parseInt(val)

      if (isNaN(value)) {
        this.configData.videoProgress = 1
        return
      }

      if (value < 1) {
        this.configData.videoProgress = 1
      } else if (value > 100) {
        this.configData.videoProgress = 100
      } else {
        this.configData.videoProgress = value
      }
    },
    handleSubmit() {
      if (
        !this.configData.videoProgress ||
        this.configData.videoProgress < 1 ||
        this.configData.videoProgress > 100
      ) {
        this.$message.error('请输入1-100之间的整数')
        return
      }

      this.$emit('update:visible', false)
      this.$emit('confirm', this.configData.videoProgress)
    }
  }
}
</script>

<style scoped>
::v-deep {
  .el-dialog__header {
    padding: 0 !important;
  }

  .el-dialog__body {
    padding: 0 10px !important;
  }

  .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
    padding: 0 10px !important;
  }
}

.ss-material-box-header {
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  height: 52px;
  padding: 30px 30px;
  background: #ffffff;
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid #f2f2f2;
  color: #353535;
  font-size: 16px;
  font-weight: bold;
  justify-content: space-between;

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

.rule-box {
  padding: 20px;

  .rule-box-item {
    margin-bottom: 20px;

    .rule-box-item-title {
      font-size: 14px;
      font-weight: 600;
      color: #000000;
    }

    .rule-box-item-tip {
      font-size: 14px;
      color: #777777;
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
  }
}
</style>

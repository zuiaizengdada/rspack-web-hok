<template>
  <el-dialog
    :width="width"
    :title="title"
    :visible.sync="visible"
    :append-to-body="true"
    custom-class="dialog-body"
    :show-close="false"
    :close-on-click-modal="false"
    :press-escape="false"
    :top="top"
    :close-on-press-escape="false"
  >
    <div slot="title" class="ss-material-box-header">
      <div class="ss-material-box-header-title">
        <svg-icon class="c_FF7D00" icon-class="icon_zhuyi" style="stroke:currentColor" />
        {{ title }}
      </div>
      <i class="el-icon-close close" @click="cancel()" />
    </div>
    <div class="dialog-body-content">
      <el-row class="formContent m-b-16">
        <div class="formLabel">名称：</div>
        <div class="formValue">{{ projectName }}</div>
      </el-row>
      <el-row class="m-b-16">
        <el-col class="formContent" :span="12">
          <div class="formLabel">视频数量：</div>
          <div class="formValue">{{ selectLength }}个</div>
        </el-col>
        <el-col class="formContent" :span="12">
          <div class="formLabel" style="width: 130px">预计导出时间：</div>
          <div class="formValue">{{ percentage | filterPercentage }}分钟</div>
        </el-col>
      </el-row>
      <!-- <el-row class="formContent m-b-16">
        <div class="formLabel">保存位置：</div>
        <div class="formValue">{{ catalogue }}</div>
      </el-row> --> 
      <div class="contentTips">注：具体进度可前往任务中心查看！</div>
    </div>
    <div class="ss-material-box-bottom">
      <el-button class="myBtn btnCancel" size="small" :loading="loading" @click="cancel">取消</el-button>
      <el-button class="myBtn" size="small" :loading="loading" type="primary" @click="sure">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'MyModal',
  filters: {
    filterPercentage(val) {
      if (!val) {
        return 0
      } else {
        return parseInt(Number(val) / 60)
      }
    }
  },
  data() {
    return {
      visible: false,
      width: '614px',
      title: '视频导出',
      loading: false,
      success: null,
      top: '357px',
      fail: null,
      projectName: '', // 名称
      selectLength: '', // 数量
      percentage: '', // 预计时长
      catalogue: '' // 保存位置
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    sure() {
      this.visible = false
      if (this.success) {
        this.success && this.success()
      }
    },
    cancel() {
      this.visible = false
      if (this.fail) {
        this.fail && this.fail()
      }
    },
    open(obj) {
      this.success = obj.success
      this.fail = obj.fail
      this.projectName = obj.projectName
      this.selectLength = obj.selectLength
      this.percentage = obj.percentage
      this.catalogue = obj.catalogue
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .dialog-body {
    position: relative;
    width: 614px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #232324;
    border-radius: 2px;
    overflow: hidden;
    border-radius: 10px;
      .el-dialog__header {
        padding: 0;
        padding-bottom: 0;
      }
      .el-dialog__body {
        padding: 0;
      }
    .ss-material-box-header {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 52px;
      padding: 15px 20px;
      // background: #fafbfc;
      background: #232324;
      border-radius: 2px 2px 0 0;
      border-bottom: 1px solid #000000;
      color: #DEDEDE;
      font-size: 16px;
      // font-weight: 500;
      font-weight: bold;
      .ss-material-box-header-title {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .close {
      color: #D9D9D9;
      margin-left: auto;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .ss-material-box-bottom {
      display: flex;
      padding-right: 20px;
      padding-left: 20px;
      padding-bottom: 20px;
      justify-content: flex-end;
      align-items: self-end;
      width: 100%;
      height: 84px;
      // background-color: #fafbfc;
      border-radius: 2px 2px 0 0;
      .myBtn {
        width: 68px;
        height: 32px;
        background: #1778FF;
        border-radius: 4px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #FFFFFF;
      }
      .btnCancel {
        width: 68px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #4D4D4D;
        background: transparent;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #999999;
      }
    }
  }
  .el-form-item__label {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 32px;
  }
  .dialog-body-content {
    padding: 20px 20px 0;
    .formContent {
      display: flex;
      .formLabel {
        width: 80px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #999999;
        line-height: 24px;
        text-align: right;
      }
      .formValue {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #D9D9D9;
        line-height: 24px;
      }
    }
  }
}
.c_FF7D00 {
  margin-right: 8px;
  font-size: 28px;
  color: #FF7D00;
}
.m-b-16 {
  margin-bottom: 16px;
}
.contentTips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #FF7D00;
  line-height: 22px;
}
</style>

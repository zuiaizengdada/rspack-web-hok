<template>
  <div class="set-shop-notice">
    <el-drawer
      title="商品未映射通知"
      :visible.sync="productNotMappedFlag"
      :direction="direction"
      :before-close="handleClose"
      size="600px"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="" label-width="10px">
            <span class="title-p">未映射订单超额提醒</span>
            <el-switch v-model="form.isFeishuNotice" @change="feishuChange" />
          </el-form-item>
          <el-form-item label="未映射订单达到" label-width="120px">
            <el-input
              v-model.number="form.dataNum"
              oninput="if(value > 9999) value = 9999; if(value < 0 || value == '' || value == null) value = 0;"
              size="mini"
              class="short-input"
            />
            <span>条 <em class="tips-em">使用加急提醒</em></span>
          </el-form-item>
          <el-form-item label="启动时间" :label-width="formLabelWidth">
            <el-time-picker
              v-model="form.timeArray"
              is-range
              range-separator="-"
              format="HH:mm"
              value-format="HH:mm"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              :picker-options="{
                selectableRange: '00:00 - 23:59'
              }"
              class="time-choose"
            />
          </el-form-item>
          <el-form-item label="提醒间隔" :label-width="formLabelWidth">
            <el-input
              v-model.number="form.remindTime"
              oninput="if(value > 99) value = 99; if(value < 0 || value == '' || value == null) value = 0;"
              size="mini"
              class="short-input"
            />
            <span>分钟</span>
          </el-form-item>
          <el-form-item label="" label-width="10px">
            <span class="label-span-tips">短信通知</span>
            <el-switch v-model="form.isMessageNotice" @change="dxChange" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button type="primary" size="mini" @click="sureToSubmit">
            确 定
          </el-button>
          <el-button size="mini" @click="cancelForm">取 消</el-button>
        </div>
      </div></el-drawer
    >
  </div>
</template>

<script>
import {
  getReminderSettingDetail,
  setReminderSettingDetail
} from '@/api/system/dataConfiguration.js'
export default {
  components: {},
  props: {
    productNotMappedFlag: {
      type: Boolean,
      default: false
    },
    unAssioncationFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      direction: 'rtl',
      form: {
        isFeishuNotice: false,
        isMessageNotice: false,
        remindTime: 0,
        timeArray: ['00:00', '23:59'],
        dataNum: 0
      },
      formLabelWidth: '80px'
    }
  },
  mounted() {},
  created() {
    this.getReminderSettingDetail()
  },
  methods: {
    feishuChange() {
      if (!this.unAssioncationFlag) {
        this.$message.error('请先打开商品未映射通知！')
        this.form.isFeishuNotice = !this.form.isFeishuNotice
      }
      const that = this
      setTimeout(function () {
        if (!that.form.isFeishuNotice) {
          that.form.isMessageNotice = false
        }
      }, 200)
    },
    dxChange() {
      if (!this.form.isFeishuNotice) {
        this.$message.error('请先打开未映射订单超额提醒的通知！')
        this.form.isMessageNotice = !this.form.isMessageNotice
      }
    },
    sureToSubmit() {
      const params = {
        dataNum: this.form.dataNum,
        startTime: this.form.timeArray[0],
        endTime: this.form.timeArray[1],
        isFeishuNotice: this.form.isFeishuNotice ? 1 : 0,
        isMessageNotice: this.form.isMessageNotice ? 1 : 0,
        remindTime: this.form.remindTime
      }
      setReminderSettingDetail(params).then(res => {
        if (res.code === 1) {
          this.$message.success('设置成功！')
          this.$emit('closeUnAssionDrawer')
        }
      })
    },
    getReminderSettingDetail() {
      getReminderSettingDetail().then(res => {
        console.log('商品未映射', res)
        if (res.code === 1) {
          this.form.timeArray = [res.data.startTime, res.data.endTime]
          this.form.dataNum = res.data.dataNum
          this.form.isFeishuNotice = res.data.isFeishuNotice === 1
          this.form.isMessageNotice = res.data.isMessageNotice === 1
          this.form.remindTime = res.data.remindTime
        }
      })
    },
    handleClose(done) {
      this.$emit('closeUnAssionDrawer')
    },
    cancelForm() {
      this.$emit('closeUnAssionDrawer')
    }
  }
}
</script>

<style lang="scss" scoped>
.set-shop-notice {
  ::v-deep .el-drawer__header {
    padding-bottom: 20px;
    font-weight: bold;
    color: #3c3c3c;
    border-bottom: 1px solid #ececec;
  }
  .demo-drawer__content {
    padding: 15px;
  }
  .title-p {
    margin-right: 20px;
    color: #409eff;
    font-weight: bold;
  }
  .short-input {
    width: 100px;
    margin-right: 20px;
  }
  .tips-em {
    margin-left: 20px;
    font-style: normal;
  }
  .span-tips {
    margin-left: 20px;
    margin-right: 15px;
  }
  .label-span-tips {
    width: 60px;
    display: inline-block;
    text-align: right;
    font-weight: bold;
    margin-right: 15px;
    color: #606266;
  }
}
</style>

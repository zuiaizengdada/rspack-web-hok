<template>
  <MCard class="aIPhoneSetting">
    <div class="title">外呼设置</div>
    <div style="margin-top: 24px">
      <span style="color: #F53F3F;">*</span>
      <span class="formLabel">允许外呼时间段</span>
      <el-time-picker
        v-model="form.startTime"
        style="width: 100px"
        class="m-l-10 m-r-10"
        size="small"
        format="HH:mm"
        value-format="HH:mm:ss"
        :picker-options="pickerOptions1"
        @change="timeChange1"
      />-<el-time-picker
        v-model="form.endTime"
        style="width: 100px"
        class="m-l-10"
        size="small"
        format="HH:mm"
        :picker-options="pickerOptions2"
        value-format="HH:mm:ss"
        @change="timeChange2"
      />
      <div class="tips">允许外呼时间段外的外呼动作，在设置的开始时间重新执行外呼。（举例：晚上21点之后的外呼任务，在早上8点执行。）</div>
    </div>
    <div class="m-t-20">
      <span style="color: #F53F3F;">*</span>
      <span class="formLabel">同一号码1天内最多允许外呼</span>
      <el-input-number v-model="form.maxCall" class="m-r-8 m-l-8" size="mini" :max="3" :min="1" :precision="0" :controls="false" style="width: 60px" />
      次（限制在1-3），默认2
    </div>
    <el-button :loading="loading" size="small" type="primary" class="formbtn" @click="save">保存</el-button>
  </MCard>
</template>

<script>
import { getSaleCallSettingInfo, updateSaleCallSettingInfo } from '@/api/deliver/baseSeeting'
export default {
  components: {},
  data() {
    return {
      form: {
        startTime: '08:00:00',
        endTime: '21:00:00',
        id: '',
        maxCall: 2 // 同一号码1天内最多允许外呼,（限制在1-3），默认2
      },
      currentTime: '',
      pickerOptions1: {
        selectableRange: '08:00:00 - 21:00:00',
        format: 'HH:mm'
      },
      pickerOptions2: {
        selectableRange: '08:00:00 - 21:00:00',
        format: 'HH:mm'
      },
      loading: false
    }
  },
  watch: {
    'form.startTime': {
      handler(val) {
        if (val) {
          this.pickerOptions2.selectableRange = `${val} - 21:00:00`
        } else {
          this.form.startTime === '08:00:00'
        }
      }
    },
    'form.endTime': {
      handler(val) {
        if (val) {
          this.pickerOptions1.selectableRange = `08:00:00 - ${val}`
        } else {
          this.form.endTime === '21:00:00'
        }
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    timeChange1(val) {
      if (!val) {
        this.$set(this.form, 'startTime', '08:00:00')
      }
    },
    timeChange2(val) {
      if (!val) {
        this.$set(this.form, 'endTime', '21:00:00')
      }
    },
    getDetail() {
      this.loading = true
      getSaleCallSettingInfo().then(res => {
        console.log(res, '获取详情')
        this.form = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    save() {
      this.loading = true
      const data = {
        ...this.form
      }
      updateSaleCallSettingInfo(data).then(res => {
        this.loading = false
        this.getDetail()
        this.$notify.success({ title: '提示', message: '操作成功' })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.aIPhoneSetting {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  min-width: 851px;
  overflow: hidden;
  .title {
    width: 100%;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
  }
  .formLabel {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333;
    line-height: 22px;
  }
  .tips {
    margin-left: 7px;
    margin-top: 8px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
  .formbtn {
    margin-top: 32px;
    width: 69px;
  }
}
.m-t-36 {
    margin-top: 36px;
}
</style>

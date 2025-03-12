<template>
  <!-- 加热人气 -->
  <div class="page_wrap">
    <div v-loading="loading" class="liveToolPopularity">
      <el-scrollbar
        ref="P5ScrollContainer"
        :vertical="false"
        class="liveToolPopularity_scroll"
      >
        <div class="form">
          <el-form
            ref="form"
            label-position="left"
            :rules="rules"
            :model="form"
            size="mini"
          >
            <el-form-item label="加热时长" prop="hotTime">
              <div style="opacity: 0">1111</div>
              <div class="hotTime">
                <!-- <div class="hotTimeLabel">开始时间</div> -->
                <el-date-picker
                  v-if="liveStatus === 0"
                  v-model="form.hotStartDay"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  type="date"
                  placeholder="选择日期"
                  style="margin-right: 10px"
                  class="flex-1"
                />
                <el-time-picker
                  v-if="liveStatus === 0"
                  v-model="form.hotStartTime"
                  value-format="HH:mm:ss"
                  placeholder="选择时间"
                  class="flex-1"
                  style="margin-right: 10px"
                />
                <el-select
                  v-model="form.hotTime"
                  placeholder="请选择"
                  class="hotTimeLabelSelect flex-1"
                >
                  <el-option
                    v-for="item in timeoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item
              label="预计提升观众数"
              prop="upSection"
              label-width="120px"
            >
              <div class="upSection">
                <div
                  v-for="item in upSectionOption"
                  :key="item.value"
                  :class="{ active: form.upSection === item.value }"
                  class="upSectionItem"
                >
                  {{ item.label }}
                </div>
              </div>
              <div class="form-tips">
                预计提升热度及时长仅供参考，系统智能推荐给潜在用户
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <div class="footerBtn">
      <el-button class="footerBtnSure" :loading="loading" @click="sure"
        >发送</el-button
      >
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { liveRoomHeatCreate } from '@/api/liveRoom/liveRoom.js'
export default {
  name: 'LiveToolPopularity',
  components: {},
  data() {
    var validateStartTime = (rule, value, callback) => {
      if (this.liveStatus !== 0) {
        return callback()
      }
      if (!this.form.hotStartDay) {
        return callback('请选择开始加热时间')
      }
      if (!this.form.hotStartTime) {
        return callback('请选择开始加热时间')
      }
      if (!this.form.hotTime) {
        return callback('请选择加热持续时间')
      }
      const starTime = this.form.hotStartDay + ' ' + this.form.hotStartTime
      console.log(starTime, moment().format('YYYY-MM-DD HH:mm:ss'))

      if (starTime < moment().format('YYYY-MM-DD HH:mm:ss')) {
        return callback('开始加热时间需要大于当前时间')
      }
      return callback()
    }
    return {
      liveStartTime: '',
      loading: false,
      liveRoomId: this.$route ? this.$route.params.id : '',
      form: {
        hotStartDay: '',
        hotStartTime: '',
        hotTime: 30,
        upSection: 1
      },
      upSectionOption: [
        { label: '100-200', value: 1 },
        { label: '200-300', value: 2 },
        { label: '300-500', value: 3 }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        }
      },
      timeoptions: [
        { label: '0.5小时', value: 30 },
        { label: '1小时', value: 60 },
        { label: '1.5小时', value: 90 },
        { label: '2小时', value: 120 },
        { label: '2.5小时', value: 150 },
        { label: '3小时', value: 180 }
      ],
      rules: {
        hotTime: [
          { required: true, validator: validateStartTime, trigger: 'change' }
        ],
        upSection: [
          { required: true, message: '请选择预计提升观众数', trigger: 'blur' }
        ]
      },
      liveRoomStatus: -1, // 直播状态
      success: () => {}
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    }),
    liveStatus() {
      return this.liveRoomDetail
        ? this.liveRoomDetail.status
        : this.liveRoomStatus
    }
  },
  watch: {
    'form.hotTime': {
      handler(val) {
        if (val <= 60) {
          this.form.upSection = 1
        } else if (val <= 120) {
          this.form.upSection = 2
        } else {
          this.form.upSection = 3
        }
      },
      immediate: true
    },
    liveStatus: {
      handler() {
        this.$refs.$form && this.$refs.$form.validateField('hotTime')
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    sure() {
      if (this.liveStatus === 9) {
        this.$delModal({
          tips: '当前直播已结束，无法加热直播间',
          sureBtnText: '我知道了',
          noCancelBtn: true,
          success: () => {}
        })
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          // alert('submit!')
          this.onSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    init() {
      this.form = {
        hotStartDay: moment(
          this.liveStartTime || this.liveRoomDetail.startTime
        ).format('YYYY-MM-DD'),
        hotStartTime: moment(
          this.liveStartTime || this.liveRoomDetail.startTime
        ).format('HH:mm:ss'),
        hotTime: 30,
        upSection: 1
      }
    },
    onSubmit() {
      this.loading = true
      const data = {
        heatDuration: this.form.hotTime, // 加热时长，单位：分钟
        heatStartTime: this.form.hotStartDay + ' ' + this.form.hotStartTime, // 加热开始时间
        heatType: 1, // 加热类型，1-加热人气 2-加热下单 3-加热领卷
        liveRoomId: this.liveRoomId,
        upSection: this.form.upSection
      }
      liveRoomHeatCreate(data)
        .then(() => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.init()
          this.success && this.success()
          this.loading = false
        })
        .catch(err => {
          if (err.code && err.code === 20220609) {
            this.$delModal({
              width: '505px',
              sureBtnText: '我知道了',
              sureBtnBgColor: '#0C6FFF',
              tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">友情提示</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">您正在加热的直播间过多，请调整已设置的加热直播间。</div>
        `
            })
          } else {
            this.$message.error(err.message || err.msg || err)
          }
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .liveToolPopularity {
    height: 100%;
    flex: 1 0 0;
    overflow: hidden;
    .liveToolPopularity_scroll {
      height: 100%;
    }
  }
  .form {
    padding: 0 15px;
    .hotTime {
      display: flex;
      align-items: center;
      .flex-1 {
        flex: 1;
        flex-shrink: 0;
      }
      .hotTimeLabel {
        height: 32px;
        line-height: 32px;
        padding: 0 15px 0 10px;
        border-radius: 5px 0 0 5px;
        border: 1px solid #dcdee1;
        border-right: none;
        background: #fff;
        color: #333333;
        font-family: 'Microsoft YaHei';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
      }
    }
    .upSection {
      display: flex;
      flex-wrap: wrap;
      .upSectionItem {
        width: 92px;
        height: 34px;
        flex-shrink: 0;
        border-radius: 5px;
        background: #f7f7f7;
        color: #333333;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-weight: bold;
        line-height: 34px;
        margin-right: 10px;
        cursor: pointer;
      }
      .active {
        background: #deebff;
        color: #0c6fff;
      }
    }
    .form-tips {
      margin-top: 10px;
      color: #999999;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
    }
  }
  .footerBtn {
    width: 100%;
    height: 52px;
    min-height: 52px;
    max-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #dcdee1;
    background: #fff;
    .footerBtnSure {
      width: 70px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #0c6fff;
      color: #fff;
      line-height: 32px;
      padding: 0;
    }
  }
}
::v-deep {
  // .hotTimeLabelSelect {
  //   .el-input__inner {
  //     border-radius: 0 4px 4px 0;
  //   }
  // }
  .el-form-item {
    padding-bottom: 10px;
    margin-bottom: 0;
  }
  .el-form-item + .el-form-item {
    padding-top: 10px;
    border-top: 1px solid #f2f2f2;
  }
  .el-form-item__label {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-weight: bolder;
  }
  .el-input__inner {
    color: #000;
  }
}
</style>

<template>
  <div>
    <AppDialog
      v-model="visible"
      width="691px"
      height="auto"
      top="10vh"
      title=""
      @success="sure()"
    >
      <div slot="title">数据同步检测设置</div>
      <div class="detectionVideo_content">
        <div class="tips">
          开启后，系统检测时间段内运营使用“在线剪辑”和“一键发布”功能时，系统会检测该运营者所有“非停更状态”的自媒体账号是否已数据同步，任意账号未同步则无法使用该功能。
        </div>
        <el-form ref="form" :rules="rules" label-width="150px" :model="form">
          <el-form-item label="是否开启数据同步检测">
            <el-switch
              v-model="form.value"
              active-text="开启"
              inactive-text="关闭"
            />
            <div class="def_font">
              默认关闭，如果开启则在系统检测时间段内开启运营者数据未同步的检测限制剪辑和发布功能权限
            </div>
          </el-form-item>
          <el-form-item label="开启检测时间段" prop="timeArray">
            <el-time-picker
              v-model="form.timeArray"
              style="width: 255px"
              size="mini"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            />
            <span class="def_font">
              默认12:01:00~23:59:59，修改后即时生效
            </span>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import { syncCheckGetInfo } from '@/api/videoManagement/accountManage'
export default {
  components: {
    AppDialog
  },
  props: {
    userArray: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      form: {
        value: false,
        timeArray: [
          new Date(2023, 10, 13, 12, 1, 0),
          new Date(2023, 10, 13, 23, 59, 59)
        ]
      },
      rules: {
        timeArray: [
          {
            type: 'array',
            required: true,
            message: '请选择时间段',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    close() {
      this.visible = false
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('success', this.form)
          this.visible = false
        }
      })
    },
    convertTime(str) {
      const timeString = str
      const date = new Date()
      const [hours, minutes, seconds] = timeString.split(':')
      date.setHours(hours)
      date.setMinutes(minutes)
      date.setSeconds(seconds)
      const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
      return result
    },
    async openDialog() {
      const { data } = await syncCheckGetInfo({})
      if (data) {
        this.form.value = data.status === 2
        this.form.timeArray = [this.convertTime(data.startTime), this.convertTime(data.endTime)]
        this.form.id = data.id
      }
      console.log('获取配置信息', data)
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.detectionVideo_content {
  padding: 20px;
}
.tips {
  background: #e7f0ff;
  padding: 8px 14px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-bottom: 10px;
}
.def_font {
  width: 443px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
</style>

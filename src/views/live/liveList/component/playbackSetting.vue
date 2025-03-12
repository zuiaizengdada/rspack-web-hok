<template>
  <div v-loading="loading" class="playbackSetting">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      size="small"
    >
      <el-form-item label="回放功能" prop="visible">
        <el-switch
          :value="form.playbackSwitch"
          :disabled="disabledFn"
          @click.stop.native="playbackSet('playbackSwitch')"
        />
        <span class="playbackSetting-tip" style="color: rgb(245, 63, 63);">注：只有直播结束后才能开启回放。</span>
      </el-form-item>
      <el-form-item v-if="form.playbackSwitch" label="开放对象" prop="authorizedPersonnel">
        <el-radio-group
          v-model="form.authorizedPersonnel"
          @input="playbackSet('authorizedPersonnel')"
        >
          <el-radio :label="1" :disabled="detail.feesType === 2">所有报名过直播间的人员</el-radio>
          <el-radio :label="2" :disabled="detail.feesType === 2">所有获得邀课链接的人员</el-radio>
          <el-radio :label="3">指定人员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.playbackSwitch && form.authorizedPersonnel === 3" prop="authorizedPersonnel">
        <playbackSettingUser />
      </el-form-item>
      <el-form-item v-if="form.playbackSwitch" label="回放有效期" prop="validityType" class="validityType">
        <el-radio-group
          v-model="form.validityType"
          @input="playbackSet('validityType')"
        >
          <el-radio :label="1">一年</el-radio>
          <el-radio :label="2">限时</el-radio>
          <el-date-picker
            v-model="form.expirationDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择截止日期"
            :clearable="false"
            :disabled="form.validityType === 1"
            class="datepicker"
            @change="playbackSet('expirationDate')"
          />
          <div style="height: 18px; font-size: 12px" class="playbackSetting-tip">
            到期后，学员无法观看回放内容，但仍可以进直播间查看聊天内容
          </div>
        </el-radio-group>

        <div v-if="detail.liveModel === 'AI_LIVE'" style="font-size: 14px;font-weight: 400;color: #F53F3F;line-height: 22px;" class="m-t-5">注：数字直播的回放视频取的是本次上课的视频文件，也就是视频管理下的视频文件。</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { playbackSetAjax, getPlaybackSetDetailAjax } from '@/api/liveRoom/index'
import playbackSettingUser from './playbackSettingUser'
import moment from 'moment'
export default {
  components: {
    playbackSettingUser
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    disabledFn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {},
      rules: {},
      loading: false,
      liveRoomId: '',
      data: {} // 回放设置
    }
  },
  // watch: {
  //   form: {
  //     handler(val) {
  //       if (this.loading === false) {
  //         this.playbackSet()
  //       }
  //     },
  //     deep: true
  //   }
  // },
  mounted() {
    this.liveRoomId = this.$route.params.id
    this.getPlaybackSetDetail()
  },
  methods: {
    // 获取回放详情
    getPlaybackSetDetail() {
      this.loading = true
      getPlaybackSetDetailAjax({ liveRoomId: this.liveRoomId })
        .then(res => {
          if (res.code === 1) {
            this.data = JSON.parse(JSON.stringify(res.data))
            this.form = res.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 设置回放
    playbackSet(type) {
      console.log(this.detail, '直播间详情')
      if (this.detail.status !== 9) {
        return
      }
      if (type === 'playbackSwitch') {
        this.$delModal({
          tips: `${!this.form.playbackSwitch ? '请确认是否开启回放！' : '请确认是否关闭回放！'}`,
          success: () => {
            this.loading = true
            const {
              playbackSwitch,
              authorizedPersonnel,
              validityType,
              expirationDate
            } = this.form
            const data = {
              ...(type === 'playbackSwitch' && { playbackSwitch: !playbackSwitch }),
              ...(type === 'authorizedPersonnel' && { authorizedPersonnel }),
              ...((type === 'validityType' || type === 'expirationDate') && { validityType }),
              ...(((type === 'validityType' || type === 'expirationDate') && validityType === 2 && expirationDate) && {
                expirationDateStr: moment(expirationDate).format(
                  'YYYY-MM-DD 23:59:59'
                )
              }),
              liveRoomId: this.liveRoomId
            }
            playbackSetAjax(data).then(res => {
              if (res.code === 1) {
                if (this.detail.feesType === 2) {
                  this.form.authorizedPersonnel = 3
                  this.playbackSet('authorizedPersonnel')
                } else {
                  this.$message({ message: '设置成功', type: 'success', duration: 1500 })
                  this.loading = false
                  this.getPlaybackSetDetail()
                }
              }
            }).catch(() => {
              this.loading = false
              this.getPlaybackSetDetail()
            })
          },
          fail: () => {
            // this.form.playbackSwitch = !this.form.playbackSwitch
          }
        })
      } else {
        this.loading = true
        const {
          playbackSwitch,
          authorizedPersonnel,
          validityType,
          expirationDate
        } = this.form
        const data = {
          ...(type === 'playbackSwitch' && { playbackSwitch }),
          ...(type === 'authorizedPersonnel' && { authorizedPersonnel }),
          ...((type === 'validityType' || type === 'expirationDate') && { validityType }),
          ...(((type === 'validityType' || type === 'expirationDate') && validityType === 2 && expirationDate) && {
            expirationDateStr: moment(expirationDate).format(
              'YYYY-MM-DD 23:59:59'
            )
          }),
          liveRoomId: this.liveRoomId
        }
        playbackSetAjax(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                message: '设置成功',
                type: 'success',
                duration: 1500
              })
            }
          })
          .finally(() => {
            this.loading = false
            this.getPlaybackSetDetail()
          })
      }
    }
  }
}
</script>

<style scoped>
.playbackSetting .validityType ::v-deep .el-radio-group {
  display: flex;
  align-items: center;
}
.playbackSetting ::v-deep .el-radio__label {
  color: #333333;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}

.playbackSetting .playbackSetting-tip {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  margin-left: 16px;
  vertical-align: middle;
}
.playbackSetting .datepicker {
  margin-left: -20px;

}
</style>

<template>
  <div v-loading="loading" class="lecturerSettings">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
      <!-- <el-form-item v-if="detail.liveModel === 'PERSON_LIVE'" label="圆桌会议" prop="visible">
        <el-switch :value="form.roundTableStatus" :disabled="[9].includes(form.status)" class="m-l-14" @change="setRoundTable" />
        <span class="lecturerSettings-tip">开启圆桌会议后，主持人可以和其他讲师进行同屏分享直播</span>
      </el-form-item> -->
      <el-form-item v-if="detail.liveModel === 'PERSON_LIVE'" label="讲师设置">
        <el-button :disabled="ifDisabled() || form.status === 9" type="primary" size="small" icon="el-icon-plus" class="m-l-14" @click="addTearch">添加讲师</el-button>
        <span class="lecturerSettings-tip">讲师最多添加10个人，且只能设置一个主持人</span>
        <lecturerTable :detail="detail" :config="form" class="m-l-14" :enter-live-room="enterLiveRoom" @operateHostTeacherSuccess="getLecturerSettings" />
      </el-form-item>
      <el-form-item v-if="detail.liveModel === 'AI_LIVE'" label="视频讲师">
        <span class="m-l-14">
          {{ detail.liveRoomIntelligentInfo.videoTeacherName || '--' }}
        </span>
      </el-form-item>
      <el-form-item label="助教设置">
        <assistantTable :detail="detail" class="m-l-14" :form="form" :enter-live-room="enterLiveRoom" @success="getLecturerSettings" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getLiveRoomInfo,
  setRoundTableAjax,
  editHostTeacherAjax
} from '@/api/liveRoom/index'
import lecturerTable from './lecturerTable.vue'
import assistantTable from './assistantTable.vue'
import { getIds } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    lecturerTable,
    assistantTable
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    enterLiveRoom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        realityTeacherUser: [],
        tutorTeacherUser: [],
        roundTableStatus: false,
        roundTableMasterId: '',
        status: ''
      },
      defaultDisabledUser: [],
      rules: {},
      loading: false,
      liveRoomId: '',
      data: {} // 原始数据
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getLecturerSettings()
  },
  methods: {
    // 获取老师详情
    getLecturerSettings() {
      this.loading = true
      const params = {
        liveRoomId: this.$route.params.id
      }
      getLiveRoomInfo(params)
        .then(res => {
          if (res.code === 1) {
            const { roundTableStatus, roundTableMasterId } =
              res.data?.liveRoomPersonInfo
            const realityTeacherUser = []
            const tutorTeacherUser = []
            const defaultDisabledUser = []
            res.data.teacherInfoList.map(v => {
              v.teacherRole === 0 &&
                realityTeacherUser.push({
                  ...v,
                  userId: v.teacherId,
                  nickName: v.teacherName
                })
              v.teacherRole === 1 &&
                tutorTeacherUser.push({
                  ...v,
                  userId: v.teacherId,
                  nickName: v.teacherName
                })
              defaultDisabledUser.push(v.teacherId)
            })

            this.form = {
              realityTeacherUser,
              tutorTeacherUser,
              roundTableStatus,
              roundTableMasterId,
              status: res.data.status
            }
            if ([1, 2, 3, 9].includes(this.form.status)) {
              this.defaultDisabledUser = defaultDisabledUser
            }
            this.data = JSON.parse(JSON.stringify(this.form))
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 添加老师
    lecturerSettings() {
      const realityTeacherUserIds = getIds(
        this.form.realityTeacherUser,
        'userId'
      )
      const params = {
        liveRoomId: this.$route.params.id,
        realityTeacherUserIds
      }
      if (realityTeacherUserIds.length === 0) {
        this.$message.error('真人讲师不能为空')
        return
      }
      this.loading = true
      editHostTeacherAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              message: '设置成功',
              type: 'success',
              duration: 1500
            })
          }
        })
        .catch(() => {
          this.form = JSON.parse(JSON.stringify(this.data))
        })
        .finally(() => {
          this.loading = false
          this.getLecturerSettings()
          this.$emit('lecturerSettingsChange')
        })
    },
    // 添加讲师弹窗
    addTearch() {
      let disabledUser = []
      // 助教添加了就不能为讲师
      this.form.tutorTeacherUser.forEach(i => {
        disabledUser.push(i.userId)
      })
      if ([1, 2].includes(this.form.status)) {
        disabledUser = disabledUser.concat(this.defaultDisabledUser)
      }
      if (this.form.roundTableMasterId && this.form.roundTableStatus) {
        // 圆桌会议 存在主持人的话主持人不能删除
        disabledUser.push(this.form.roundTableMasterId)
      }
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.realityTeacherUser,
        disabledUser,
        maxlength: 10,
        success: res => {
          this.form.realityTeacherUser = res.user
          this.lecturerSettings()
        }
      })
    },
    // 圆桌会议开启-关闭
    setRoundTable(e) {
      if (e === true) {
        // 开启
        this.$delModal({
          tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">重要提示</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">开启圆桌会议，必须设置一位主持人。</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">1、主持人负责开始直播和结束直播。</div>
          <div style="font-size: 14px;color: #333333;line-height: 22px;">2、主持人负责给老师开通上课和关闭上课的权限。</div>
        `,
          width: '513px',
          success: () => {
            this.setRoundTableRequest(true)
          },
          fail: () => {}
        })
      } else {
        // 关闭
        this.setRoundTableRequest(false)
      }
    },
    setRoundTableRequest(val) {
      this.loading = true
      const params = {
        liveRoomId: this.$route.params.id,
        onOrOff: val
      }
      setRoundTableAjax(params)
        .then(res => {
          if (res.code === 707102) {
            // 直播间存在老师提示
            const { onOrOff } = params
            this.$delModal({
              tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">提示</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">已经有老师在直播间，如需要${onOrOff ? '开启' : '关闭'}圆桌会议，</div>
          <div style="font-size: 14px;color: #333333;line-height: 22px;"> 需请正在直播间的老师退出直播间，再进行设置。</div>
        `,
              sureBtnText: '我知道了',
              noCancelBtn: true,
              width: '513px',
              sureBtnStyle: { marginRight: '176.5px' },
              success: () => {}
            })
          }
        })
        .catch(() => {
          this.form = JSON.parse(JSON.stringify(this.data))
        })
        .finally(() => {
          this.loading = false
          this.getLecturerSettings()
        })
    },
    // 是否禁止操作 true禁止 false不禁止
    // 只有创建人和白名单人员才可以设置
    ifDisabled() {
      // 是否是创建人
      const ifCreate = this.detail?.createUserId === this.userInfo.userId
      if (this.detail.status === 9) {
        return true
      } else if (this.enterLiveRoom) {
        // 白名单可直接设置
        return false
      } else if (ifCreate) {
        // 创建人可操作
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
.lecturerSettings .validityType ::v-deep .el-radio-group {
  display: flex;
  align-items: center;
}

.lecturerSettings ::v-deep .el-radio__label {
  color: #333333;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}

.lecturerSettings .lecturerSettings-tip {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  margin-left: 16px;
  vertical-align: middle;
}
</style>

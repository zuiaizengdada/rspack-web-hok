<template>
  <div class="liveRoomInfo">
    <div class="liveRoomName">
      <span class="liveRoomNameTitle text_hidden_ellipsis">{{ liveRoomDetail.name }}</span>
    </div>
    <div class="liveRoomContent">
      <div class="liveRoomTearch">主讲: {{ liveRoomDetail | renderTearch }}</div>
      <div v-if="liveRoomDetail.liveModel === 'PERSON_LIVE' && liveRoomDetail.displayMode === 2" style="width: 130px">
        <!-- <el-select v-model="mainScreenPerson.userId" :disabled="disabledFn" size="small" placeholder="请选择主屏人" clearable :loading="loading" @visible-change="onlineTeacherList" @change="editPageLayout">
          <el-option v-for="item in userList" :key="item.sysUserId" :label="item.sysUserName" :value="item.sysUserId" />
        </el-select> -->
        <m-select
          v-model="mainScreenPerson.userId"
          style="width: 150px"
          filterable
          :clearable="false"
          placeholder="请选择主屏人"
          :dict-list="userList"
          :param="{ value: 'sysUserId', label: 'sysUserName' }"
          @change="editPageLayout"
          @visible-change="onlineTeacherList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { onlineTeacherList, editPageLayout } from '@/api/liveRoom/index.js'
export default {
  components: {},
  filters: {
    renderTearch(val) {
      if (val.liveModel === 'PERSON_LIVE') {
        const arr = val.teacherInfoList
        if (!arr || arr.length === 0) {
          return ''
        }
        return arr.filter(v => v.teacherRole === 0).reduce((pre, next, index) => {
          pre += `${index === 0 ? '' : ','}${next.teacherName}`
          return pre
        }, '')
      } else if (val.liveModel === 'AI_LIVE') {
        return val.liveRoomIntelligentInfo.videoTeacherName || '——'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      loading: false,
      inviteConfig: {
        visible: false,
        row: {}
      },
      mainScreenPerson: {
        userId: '',
        userName: ''
      },
      userList: []
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    }),
    ...mapGetters(['orgModules', 'userInfo']),
    disabledFn() {
      const index = this.liveRoomDetail.teacherInfoList.findIndex(v => v.teacherId === this.userInfo.userId)
      return index === -1
    }
  },
  watch: {
    'liveRoomDetail.liveRoomPersonInfo': {
      handler(val) {
        if (val.mainScreenCharacters && val.mainScreenCharacters.teacherId) {
          this.onlineTeacherList(true).then(() => {
            const index = this.userList.findIndex(v => v.sysUserId === val.mainScreenCharacters.teacherId)
            if (index === -1) {
              this.userList.push({
                sysUserId: val.mainScreenCharacters.teacherId,
                sysUserName: val.mainScreenCharacters.teacherName
              })
            }
            this.mainScreenPerson = {
              userId: val.mainScreenCharacters.teacherId,
              userName: val.mainScreenCharacters.teacherName
            }
          })
        } else {
          this.mainScreenPerson = {
            userId: '',
            userName: ''
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.onlineTeacherList(true)
  },
  methods: {
    onhandleShare() {
      console.log('点击分享')
      this.inviteConfig = {
        visible: true,
        row: {
          liveModel: this.liveRoomDetail.liveModel,
          name: this.liveRoomDetail.name,
          code: this.liveRoomDetail.code,
          startTime: this.liveRoomDetail.startTime,
          id: this.$route.params.id
        }
      }
    },
    closeInviteDialog() {
      this.inviteConfig.visible = false
    },
    // 获取可选主屏人数据列表
    onlineTeacherList(flag) {
      console.log(flag, 'flag')
      if (flag) {
        this.loading = true
        const params = {
          liveRoomId: this.$route.params.id
        }
        return onlineTeacherList(params).then(res => {
          console.log(res, '获取可选主屏人数据列表res')
          this.userList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 切换主屏人
    editPageLayout() {
      this.loading = true
      const data = {
        liveRoomId: this.$route.params.id,
        mainScreenCharacters: this.mainScreenPerson.userId,
        verticalScreenModel: this.liveRoomDetail.liveRoomPersonInfo.verticalScreenModel,
        landscapeModel: this.liveRoomDetail.liveRoomPersonInfo.landscapeModel
      }
      editPageLayout(data).then(res => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.liveRoomInfo {
    padding: 10px 24px;
    border-bottom: 1px solid #F5F5F5;
    .liveRoomName {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .liveRoomNameTitle {
        width: 280px;
      }
      .shareIcon {
        color: #0C6FFF;
        cursor: pointer;
      }
    }
    .liveRoomContent {
      display: flex;
      margin-top: 16px;
      justify-content: space-between;
      align-items: center;
        .liveRoomTearch {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          max-width: 180px
        }
        .shareCourse {}
    }
}
</style>

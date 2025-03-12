<template>
  <div class="roomSeeting">
    <!-- <div class="roomSeetingTitle">直播间设置</div> -->
    <div class="roomSeetingContent">
      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">显示在线人数</div>
        <div><el-switch v-model="form.isShow" :disabled="liveRoomDetail.status === 9" :width="30" @change="liveRoomChange('isShow')" /></div>
      </div>

      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">显示购物车</div>
        <div><el-switch v-model="form.showShoppingCart" :disabled="liveRoomDetail.status === 9" :width="30" @change="liveRoomChange('showShoppingCart')" /></div>
      </div>

      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">显示点赞</div>
        <div><el-switch v-model="form.showLikeIcon" :disabled="liveRoomDetail.status === 9" :width="30" @change="liveRoomChange('showLikeIcon')" /></div>
      </div>

      <div class="roomSeetingForm">
        <!-- <div class="roomSeetingFormLabel">显示系统消息</div> -->
        <div class="roomSeetingFormLabel">显示学员进出消息</div>
        <div><el-switch v-model="form.isShowNotice" :disabled="liveRoomDetail.status === 9" :active-value="1" :inactive-value="0" :width="30" @change="liveRoomChange('isShowNotice')" /></div>
      </div>

      <!-- <div v-if="liveRoomDetail.liveModel === 'AI_LIVE'" class="roomSeetingForm">
        <div class="roomSeetingFormLabel">不允许学员进入教室看同一个视频</div>
        <div><el-switch v-model="form.isRepeatedViewing" :disabled="liveRoomDetail.status === 9" :active-value="false" :inactive-value="true" @change="liveRoomChangeRepeatedViewing" /></div>
      </div> -->
      <div v-if="liveRoomDetail.liveModel === 'AI_LIVE'" class="roomSeetingForm">
        <div class="roomSeetingFormLabel">允许同一人重复观看</div>
        <div><el-switch v-model="form.isRepeatedViewing" :disabled="liveRoomDetail.status === 9" :active-value="true" :inactive-value="false" :width="30" @change="liveRoomChangeRepeatedViewing" /></div>
      </div>

      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">全员禁言</div>
        <div><el-switch v-model="form.isShutUp" :disabled="liveRoomDetail.status === 9" :active-value="1" :inactive-value="0" :width="30" @change="liveRoomChange('isShutUp')" /></div>
      </div>

      <div v-if="liveRoomDetail.liveModel === 'AI_LIVE' && liveRoomDetail.status === 1" class="roomSeetingForm">
        <div class="roomSeetingFormLabel">允许学员连麦</div>
        <div><el-switch v-model="form.isVoiceChat" :disabled="liveRoomDetail.status === 9" :active-value="1" :inactive-value="0" :width="30" @change="liveRoomChange('isVoiceChat')" /></div>
      </div>

      <div v-if="liveRoomDetail.liveModel === 'PERSON_LIVE' && liveRoomDetail.displayMode === 2" class="roomSeetingForm">
        <div class="roomSeetingFormLabel">切换主屏人物</div>
        <div>
          <m-select
            v-model="mainScreenPerson.userId"
            style="width: 150px"
            filterable
            size="small"
            :clearable="false"
            placeholder="请选择主屏人"
            :dict-list="userList"
            :param="{ value: 'sysUserId', label: 'sysUserName' }"
            @change="editPageLayout"
            @visible-change="onlineTeacherList"
          />
        </div>
      </div>

      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">自嗨消息可见</div>
        <div>
          <el-checkbox-group v-model="checkboxGroup" size="small" :disabled="loading" @change="onChange">
            <el-checkbox label="teacherVisible">主讲</el-checkbox>
            <el-checkbox label="assistantVisible">助教</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { editGroupInfo } from '@/api/liveRoom/im.js'
import { getLiveRoomAmuse, saveLiveRoomAmuse, onlineTeacherList, editPageLayout } from '@/api/liveRoom/index.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
      form: {
        isRepeatedViewing: true, // 是否重复观看
        isShutup: 0,
        isAllowSendPic: 0,
        isShowNotice: 0,
        isVoiceChat: 0, // 是否允许学员连麦
        isShow: false, // 显示在线人数
        showShoppingCart: false, // 显示购物车
        showLikeIcon: true // 显示点赞
      },
      mainScreenPerson: {
        userId: '',
        userName: ''
      },
      userList: [],
      checkboxGroup: [],
      liveRoomId: this.$route.params.id
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    }),
    ...mapGetters(['orgModules', 'userInfo'])
  },
  watch: {
    liveRoomDetail: {
      handler(val) {
        console.log('改变', val)
        this.form = {
          isRepeatedViewing: val.liveRoomIntelligentInfo.isRepeatedViewing,
          isShutUp: val.isShutUp || 0,
          isAllowSendPic: val.isAllowSendPic || 0,
          isShowNotice: val.isShowNotice || 0,
          isVoiceChat: val.isVoiceChat ? 1 : 0,
          isShow: val.isShow || false,
          showShoppingCart: val.showShoppingCart || false,
          showLikeIcon: val.showLikeIcon
        }
      },
      deep: true,
      immediate: true
    },
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
    this.getDetail()
  },
  methods: {
    liveRoomChange(key) {
      console.log(this.form, key)
      const obj = {
        isRepeatedViewing: 'isRepeatedViewing',
        isShutUp: 'isShutUp',
        isAllowSendPic: 'allowSendPic',
        isShowNotice: 'displaySysMessage',
        isVoiceChat: 'isVoiceChat',
        showShoppingCart: 'showShoppingCart',
        isShow: 'showOnlineNum'
      }

      const mykey = obj[key]
      const params = {
        groupId: this.liveRoomDetail.groupId,
        liveRoomId: this.liveRoomId,
        ...(mykey && { [mykey]: !!(this.form[key]) })
      }
      if (mykey === 'isRepeatedViewing') {
        params.videoId = this.liveRoomDetail.liveRoomIntelligentInfo.videoId
        params.isRepeatedViewing = this.form[key]
      }
      // 操作类型
      const operationType = {
        showLikeIcon: 1
      }
      if (['showLikeIcon'].includes(key)) {
        params.action = !!(this.form[key])
        params.operationType = operationType[key]
      }
      editGroupInfo(params).then((res) => {
        this.$store.commit('im/SET_liveRoomDetailByKey', { data: this.form[key], key: key })
      })
    },
    liveRoomChangeRepeatedViewing(res) {
      console.log(res, 'res')
      if (!res) {
        this.$delModal({
          tips: '一旦不允许，则这个学员进任何直播间都看不了这个视频',
          success: () => {
            // this.$emit('delHandle', node.data)
            this.liveRoomChange('isRepeatedViewing')
          },
          fail: () => {
            console.log('取消')
            this.$store.commit('im/set_isRepeatedViewing', true)
            this.form.isRepeatedViewing = true
          }
        })
      } else {
        this.liveRoomChange('isRepeatedViewing')
      }
    },
    // 自嗨消息可见设置
    onChange(res) {
      console.log(res, 'res')
      if (this.loading) { return this.$message.warn('正在提交中，请稍后') }
      this.loading = true
      const data = {
        'assistantVisible': this.checkboxGroup.includes('assistantVisible'),
        'liveRoomId': this.liveRoomId,
        'teacherVisible': this.checkboxGroup.includes('teacherVisible')
      }
      saveLiveRoomAmuse(data).then(res => {
        this.getDetail()
      }).catch((err) => {
        console.log(err, 'err222')
        this.checkboxGroup.includes(res) ? this.checkboxGroup = this.checkboxGroup.filter(item => item !== res) : this.checkboxGroup.push(res)
        // this.checkboxGroup.includes(res) ? (this.checkboxGroup = this.checkboxGroup.filter(item => item !== res)) : this.checkboxGroup.push(res)
        this.loading = false
      })
      // this.$delModal({
      //   tips: `确定设置${res === 'teacherVisible' ? '主讲' : '助教'}${this.checkboxGroup.includes(res) ? '不可见' : '可见'}？`,
      //   success: () => {
      //   },
      //   fail: () => {
      //     this.checkboxGroup.includes(res) ? (this.checkboxGroup = this.checkboxGroup.filter(item => item !== res)) : this.checkboxGroup.push(res)
      //   }
      // })
    },
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId
      }
      getLiveRoomAmuse(data).then(res => {
        console.log(res, '获取自嗨设置')
        const checkboxGroup = []
        if (res && res.data) {
          res.data.assistantVisible && checkboxGroup.push('assistantVisible')
          res.data.teacherVisible && checkboxGroup.push('teacherVisible')
        }
        this.checkboxGroup = checkboxGroup
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
.roomSeeting {
padding: 11px 2px 5px 5px;
  overflow-x: hidden;
  height: 100%;
  overflow-y: auto;
  .roomSeetingContent {
    .roomSeetingForm {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      padding-bottom: 20px;
      &:first-child {
        padding-top: 0px;
      }
      &:last-child {
        padding-bottom: 0px;
      }
      .roomSeetingFormLabel {
        font-size: 14px;
        font-weight: bolder;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #000;
      }
    }
    .roomSeetingForm + .roomSeetingForm {
      border-top: 1px solid #F2F2F2;
    }
  }
}
</style>

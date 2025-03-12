<template>
  <div v-loading="loading" class="head-info-wrapper">
    <!-- 详情基本信息 -->
    <div class="info-item">
      <!-- 详情图 -->
      <div
        class="cover-image"
        :style="{ 'background-image': 'url(' + detailInfo.imgUrl + ')' }"
      />
      <!-- 右侧信息 -->
      <div class="fi">
        <div class="nr">
          <span>{{ detailInfo.name || '-' }}</span>
          <span v-if="detailInfo.name">（直播间ID:{{ detailInfo.code }}）</span>
        </div>
        <div class="fr-row">
          <div class="frc frc-w33">
            <span class="flabel">直播模式 : </span>
            <span class="fvalue">{{
              detailInfo.liveModel | getOptionsValue(liveModeOption)
            }}</span>
          </div>
          <div class="frc frc-w33">
            <span class="flabel">
              {{
                detailInfo.liveModel === 'PERSON_LIVE' ? '直播讲师' : '视频讲师'
              }}
              :
            </span>
            <span class="fvalue">{{ renderTearch(detailInfo) }}</span>
          </div>
          <div class="frc frc-w33" style="display: flex; align-items: center">
            <span class="flabel">运营助教 : </span>
            <span class="fvalue">
              <textShowMore
                ref="textShowMore"
                :text="renderAssistantTearch(detailInfo.teacherInfoList)"
                :line-clamp="1"
              />
            </span>
          </div>
        </div>

        <div class="fr-row">
          <div class="frc frc-w33">
            <span class="flabel">开播时间 : </span>
            <span class="fvalue">
              {{
                detailInfo.startTime
                  ? moment(detailInfo.startTime).format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }}
            </span>
          </div>
          <div class="frc frc-w33">
            <span class="flabel">直播人数 : </span>
            <span class="fvalue">{{
              detailInfo.isShow ? '显示' : '隐藏'
            }}</span>
          </div>
          <div class="frc frc-w33">
            <span class="flabel">回放设置 : </span>
            <span class="fvalue">
              {{ { 0: '无回放', 1: '云端录制' }[detailInfo.playbackSet] }}
            </span>
          </div>
        </div>

        <div class="fr-row">
          <div class="frc frc-w33">
            <span class="flabel">创建时间 : </span>
            <span class="fvalue">
              {{
                detailInfo.createTime
                  ? moment(detailInfo.createTime).format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }}
            </span>
          </div>
          <div class="frc frc-w33">
            <span class="flabel">创建人员 : </span>
            <span class="fvalue">{{ detailInfo.createUserName }}</span>
          </div>
        </div>

        <div v-if="detailInfo.liveModel === 'AI_LIVE'" class="fr-row">
          <div class="frc frc-w33">
            <span class="flabel">视频名称 : </span>
            <span
              class="fvalue a_link2"
              @click="gotoVideo(detailInfo.liveRoomIntelligentInfo)"
            >
              {{ detailInfo.liveRoomIntelligentInfo.videoName }}
            </span>
          </div>
          <div class="frc frc-w33">
            <span class="flabel">课件名称 : </span>
            <span class="fvalue">
              <template v-if="detailInfo.liveRoomIntelligentInfo.scriptId">
                <span
                  class="a_link2"
                  @click="gotoScript(detailInfo.liveRoomIntelligentInfo)"
                >
                  {{ detailInfo.liveRoomIntelligentInfo.scriptName }}
                </span>
              </template>
              <template v-else> 未使用课件 </template>
            </span>
          </div>
        </div>
        <div class="fr-row" style="margin-top: 20px">
          <div
            v-permission="['btn:liveDetail:invite', permsList]"
            class="fr-btn fr-btn-link"
            @click="onhandleInvite(detailInfo)"
          >
            <img
              class="lk-img"
              src="@/assets/svg/roomDetail/link-icon.svg"
              alt=""
            />
            邀课链接
          </div>
          <div
            v-permission="['btn:liveDetail:enterLive', permsList]"
            class="fr-btn fr-btn-tzb"
            @click="onhandleGotoLiveRoom()"
          >
            进入直播间
            <img
              class="toicon"
              src="@/assets/image/smartSales/roomdetail/chevron-right.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <InviteDialog :config="inviteConfig" @close="closeInviteDialog" />
  </div>
</template>

<script>
import { liveModeOption } from '../../../columns.js'
import InviteDialog from '@/views/live/liveList/component/InviteDialog2.vue'
import moment from 'moment'
import { getLiveRoomInfo, canEnterLiveRoom } from '@/api/liveRoom/index'
import { mapGetters } from 'vuex'
import textShowMore from '@/components/textShowMore/index2.vue'
export default {
  components: { InviteDialog, textShowMore },
  data() {
    return {
      moment,
      permsList: this.$route?.meta?.permsList || [],
      liveModeOption,
      id: undefined,
      loading: false,
      detailInfo: {
        liveRoomIntelligentInfo: {
          videoTeacherName: '',
          scriptName: '',
          videoName: ''
        },
        imgUrl: '',
        liveModel: 'PERSON_LIVE',
        teacherInfoList: [],
        createTime: '',
        startTime: '',
        isShow: false,
        playbackSet: 0,
        createUserName: '',
        createUserId: '',
        liveRoomId: ''
      },
      inviteConfig: {
        visible: false,
        row: {}
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.id = this.$route.params.id
    if (!this.id) {
      this.$message.error('页面路径错误')
      this.$router.replace({ path: '/privateLive/room' })
      return
    }
    this.canEnterLiveRoom().then(() => {
      this.getDetail()
    })
  },
  methods: {
    // 点击进入直播间
    onhandleGotoLiveRoom() {
      if (!this.canShowGotoLiveRoom()) {
        return this.$message.error('你暂无权限访问。')
      }
      // this.$router.push(`/liveRoom/${row.id}`)
      const { href } = this.$router.resolve({
        path: `/liveRoomV2/${this.id}`
      })
      window.open(href, '_blank')
    },
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    canShowGotoLiveRoom() {
      const row = this.detailInfo
      if (this.enterLiveRoom) {
        return true
      }
      if (!row.teacherInfoList || row.teacherInfoList.length === 0) {
        return false
      }
      const obj = row.teacherInfoList.find(
        v => v.teacherId === this.userInfo.userId
      )
      return Boolean(obj)
    },
    onhandleInvite() {
      this.inviteConfig = {
        visible: true,
        row: {
          liveModel: this.detailInfo.liveModel,
          name: this.detailInfo.name,
          code: this.detailInfo.code,
          startTime: this.detailInfo.startTime,
          id: this.$route.params.id
        }
      }
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      const params = {
        liveRoomId: this.id
      }
      getLiveRoomInfo(params)
        .then(res => {
          this.loading = false
          this.detailInfo = { ...res.data }
        })
        .catch(() => {
          this.loading = false
        })
    },
    gotoScript(row) {
      const { href } = this.$router.resolve({
        path: `/privateLive/liveNewScript?videoId=${row.videoId}&coursewareName=${row.scriptName}`
      })
      window.open(href, '_blank')
    },
    gotoVideo(row) {
      const { href } = this.$router.resolve({
        path: `/privateLive/newMaterialLibrary/newLiveVideo?videoId=${row.videoId}&videoName=${row.videoName}`
      })
      window.open(href, '_blank')
    },
    renderAssistantTearch(arr) {
      if (!arr) {
        return ''
      }
      const value = arr
        .filter(v => v.teacherRole === 1)
        .reduce((pre, next) => {
          next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
          return pre
        }, '')
      return value
    },
    renderTearch(row) {
      if (row.liveModel === 'PERSON_LIVE') {
        const arr = row.teacherInfoList
        if (!arr) {
          return ''
        }
        const value = arr
          .filter(v => v.teacherRole === 0)
          .reduce((pre, next) => {
            next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
            return pre
          }, '')
        return value
      } else if (row.liveModel === 'AI_LIVE') {
        return row.liveRoomIntelligentInfo.videoTeacherName || '——'
      } else {
        return ''
      }
    },
    closeInviteDialog() {
      this.inviteConfig.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.head-info-wrapper {
  .info-item {
    display: flex;
    padding: 20px 20px 0 20px;
    .cover-image {
      width: 302px;
      height: 226px;
      margin-right: 32px;
      border-radius: 4px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% auto;
      background-color: #f7f7f7;
    }
    .fi {
      flex: 1;
      .nr {
        display: flex;
        align-items: baseline;
        span:nth-of-type(1) {
          font-size: 20px;
          color: #333;
          font-weight: 600;
          padding-right: 14px;
        }
        span:nth-of-type(2) {
          font-size: 16px;
          color: #777777;
        }
      }
      .fr-row {
        display: flex;
        align-items: center;
        margin-top: 12px;
        .frc {
          font-size: 16px;
          font-weight: 400;
          .flabel {
            min-width: 76px;
            color: #777;
          }
          .fvalue {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333;
            line-height: 24px;
            margin-left: 5px;
            color: #000;
          }
          .a_link2 {
            cursor: pointer;
            color: #0c6fff;
          }
        }
        .frc-w33 {
          width: 33%;
        }
        .fr-btn {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 4px;
          user-select: none;
          font-size: 14px;
          user-select: none;
          cursor: pointer;

          .lk-img {
            width: 12px;
            height: 12px;
            margin-right: 4px;
          }
          .toicon {
            width: 12px;
            height: 12px;
            margin-left: 4px;
            padding-top: 2px;
          }
        }
        .fr-btn-link {
          width: 113px;
          background-color: #0c6fff;
          border: 1px solid #0c6fff;
          color: #fff;
        }
        .fr-btn-tzb {
          width: 121px;
          background-color: #f9f9f9;
          border: 1px solid #dcdfe5;
          color: #161616;
          margin-left: 13px;
        }
      }
    }
  }
}
</style>

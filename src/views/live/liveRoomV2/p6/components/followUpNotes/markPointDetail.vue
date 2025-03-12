<template>
  <div ref="markPointDetail" v-loading="loading" class="markPointDetail" @click.stop>
    <div class="markPointDetailHeader">
      <div class="markPointDetailHeader_title">
        <template v-if="detail.markType === 99">
          【自定义标记】-{{ detail.typeDesc }}
        </template>
        <template v-else>
          {{ {
            1: '推课数据',
            2: '干货数据',
            3: '用户互动高',
            4: '金句标记',
            5: '情绪共鸣',
            6: '繁复表达',
            7: '讲时间点'
          }[detail.markType] }}
        </template>
      </div>
      <div class="markPointDetailHeader_action">
        <img src="~@/assets/image/liveRoom/editTags.png" alt="编辑" class="action_btn" @click.stop="onhandleEdit" />
        <img src="~@/assets/image/liveRoom/deleteTags.png" alt="删除" class="action_btn" @click.stop="onhandleDel" />
      </div>
    </div>

    <div class="markPointDetailContent">{{ detail.markContent }}</div>
    <div class="videoInfo">
      <div class="videoTitle">查看讲课内容</div>
      <div class="videoInfoDetail">
        <div class="videoView" @click="onhandPlayVideo">
          <el-image :src="coverUrl" alt="" class="posterImg" fit="contain" />
          <img v-if="!(mediaProcessTaskStatus === 1 || mediaProcessTaskStatus === 3)" src="~@/assets/image/liveRoom/small_play.png" alt="" class="playImg" />
        </div>
        <div v-if="mediaProcessTaskStatus === 1 || mediaProcessTaskStatus === 3" class="videoStatus">
          <div class="status">
            <img src="~@/assets/image/liveRoom/video_progress.png" alt="" />
            <div>正在生成中...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { markDetail, delMark } from '@/api/liveRoom/liveRoom.js'
import { getVideoDetail } from '@/api/liveVideo/index.js'
import AppVideo from './AppVideo'
export default {
  components: {},
  data() {
    return {
      loading: false,
      id: '',
      videoInfo: {
        videourl: '',
        videoTime: '',
        videoStatus: ''
      },
      detail: {
        followClassRecordId: 0,
        id: 0,
        markChannelType: 0,
        markContent: '',
        markType: 0,
        typeDesc: ''
      },
      followClassMarkId: '',
      liveRoomDetail: {},
      videoId: '', // 视频ID
      url: '', // 视频的播放url
      pushTime: '', // 开始推流时间，数字直播为开播时间
      videoStatus: true, // 视频的状态：真人直播存在videoId转码的过程，为false表示没有videoId，视频转码中
      mediaProcessTaskStatus: 1, // 媒体处理任务状态 1-转码中 2-转码成功 3-转码失败
      playTime: 0,
      videoTime: 0, // 点击的标记点的时间起始
      coverUrl: '', // 封面图
      onEdit: () => {},
      onDel: () => {}
    }
  },
  mounted() {
    console.log(this, 'this')
    this.$nextTick(() => {
      this.getDetail()
      this.getVideoDetail()
    })
  },
  methods: {
    // 点击编辑
    onhandleEdit() {
      this.onEdit && this.onEdit().then(() => {
        this.getDetail()
      })
    },
    // 点击删除
    onhandleDel() {
      this.$delModal({
        tips: `确定移除该标记吗？`,
        success: () => {
          this.loading = true
          const data = {
            followClassMarkId: this.followClassMarkId
          }
          delMark(data).then(() => {
            this.loading = false
            this.onDel && this.onDel()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      const data = {
        followClassMarkId: this.followClassMarkId
      }
      markDetail(data).then((res) => {
        this.detail = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取视频数据详情
    getVideoDetail() {
      this.videoId = ''
      if (this.liveRoomDetail.liveModel === 'AI_LIVE') {
        this.videoId = this.liveRoomDetail.liveRoomIntelligentInfo.videoId
        this.pushTime = this.liveRoomDetail.startTime
      } else {
        this.videoId = this.liveRoomDetail.liveRoomPersonInfo.videoId
        this.pushTime = this.liveRoomDetail.liveRoomPersonInfo.pushTime
      }
      if (!this.videoId) return
      // this.$refs.videoView && this.$refs.videoView.getSubtitleList(this.videoId)
      this.videoInit().then((res) => {
        // console.log(res, '获取的视频时长')
        // 根据开始时间和视频时长，计算时间维度
        // this.$refs.interactiveTrend && this.$refs.interactiveTrend.init(this.pushTime, res.duration)
      })
    },
    // 初始化视频播放器
    videoInit() {
      const data = {
        videoId: this.videoId
      }
      return getVideoDetail(data.videoId).then(res => {
        this.videoDetail = res.data
        this.mediaProcessTaskStatus = res.data.covertStatus // 1-转码中 2-转码成功 3-转码失败
        this.url = res.data.hlsUrl ? res.data.hlsUrl : res.data.url
        this.coverUrl = res.data.coverUrl
        // this.$refs.videoView && this.$refs.videoView.play('', res.data.coverUrl, res.data)
        return res.data
      })
    },
    onhandPlayVideo() {
      if (this.mediaProcessTaskStatus === 1 || this.mediaProcessTaskStatus === 3) {
        return this.$message.error('视频正在生成中，请稍后...')
      }
      AppVideo.play({
        url: this.url,
        initBc: () => {
          return new Promise((resolve, reject) => {
            const time = this.getKeyPoniterTime(this.pushTime, this.videoTime)
            resolve({ time: time, ifPlayer: 'play', videoId: this.videoId })
          })
        }
      })
    },
    getKeyPoniterTime(startTime, endTime) {
      const time = new Date(endTime).getTime() - new Date(startTime).getTime()
      return time < 0 ? 0 : time / 1000
    }
  }
}
</script>

<style lang='scss' scoped>
.markPointDetail{
  width: 367px;
  height: 234px;
  border-radius: 10px;
  border: 1px solid #DCDEE1;
  background: #FFF;
  box-shadow: 0 0 10px 0 #0000000d;
  .markPointDetailHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 10px;
    border-bottom: 1px solid #F2F2F2;
    .markPointDetailHeader_title {
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: bolder;
    }
    .markPointDetailHeader_action {
      display: flex;
      > img {
        width: 26px;
        height: 26px;
        margin-left: 12px;
        cursor: pointer;
      }
    }
  }
  .markPointDetailContent {
    max-height: 57px;
    overflow: auto;
    flex-shrink: 0;
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    padding: 6px 10px;
    border-bottom: 1px solid #F2F2F2;
  }
  .videoInfo {
    padding: 0 10px;
    .videoTitle {
      padding: 6px 0 10px 0;
      color: #999999;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
    }
    .videoInfoDetail {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      border-radius: 2px;
      border: 1px solid #F2F2F2;
      background: #FFF;
      padding: 5px;
      .videoView {
        width: 100px;
        height: 57px;
        flex-shrink: 0;
        border-radius: 2px;
        background: pink;
        position: relative;
        cursor: pointer;
        > .posterImg {
          width: 100%;
          height: 100%;
        }
        > .playImg {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .videoStatus {
        margin-left: 8px;
        flex: 1 0 0;
        height: 22px;
        line-height: 22px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #999999;
        font-family: "Microsoft YaHei";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
        .status {
          padding: 4px;
          display: flex;
          align-items: center;
          border: 1px solid #F2F2F2;
          border-radius: 4px;
          > img {
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>

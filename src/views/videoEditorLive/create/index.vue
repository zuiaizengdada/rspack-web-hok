<template>
  <div class="video-create-container flex flex-col">
    <div class="create-header flex items-center justify-center">
      <p class="back cursor-pointer" @click="handelClickBack">
        <i class="el-icon-arrow-left" />
        返回
      </p>
      <p class="title">{{ projectName }}</p>
    </div>
    <div class="create-content flex">
      <div class="create-info">
        <h4 class="title">视频生成</h4>
        <fragment-list ref="list" class="frame-list" :name="videoName" :list="cuttingList" @check="fragmentCheck" @preview="videoPreview" />
        <div class="frame-info">
          <p>
            <span>导出格式：MP4</span>
            <span>清晰度：超清1080P</span>
          </p>
          <p>
            储存位置：剪辑工作台/我的工程/{{ projectName }} <i class="el-icon-arrow-right" /> 视频生成列表</p>
        </div>
        <el-button type="primary" :disabled="disableCreateBtn" @click="handleClickCreateVideo">生成视频</el-button>
      </div>
      <div class="create-preview">
        <p class="title">视频预览</p>
        <video-player :list="selectedList" :src="videoUrl" :preview="previewVideoData" @play="videoPlaying" />
        <div class="player-info flex">
          <p>视频名称：{{ videoName }}</p>
          <div v-show="Object.keys(previewVideoData).length" class="flex" style="margin-left:16px;">
            <p>片段{{ previewVideoData.previewPlayIndex+1 }}:  {{ previewVideoData.label }}</p>
            <p style="margin-left:25px;color:#999999">时长: {{ previewVideoData.duration }}</p>
          </div>
          <!-- <div v-if="selectedList.length" class="flex flex-wrap list">
            <p
              v-for="item in selectedList"
              :key="item.item"
            >片段{{ item.index + 1 }}：{{ item.item }}
              <span style="">时长：{{ item.duration }}</span></p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FragmentList from './components/FragmentList.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import { videoGenerateDetail, videoGgenerate, markList } from '../api'

import { formatPrTime, getFormatSSS } from '../utils'
import _ from 'lodash'
export default {
  components: {
    FragmentList,
    VideoPlayer
  },
  data() {
    return {
      cuttingList: [],
      fragmentList: [],
      selectedList: [],
      indexs: [],
      videoName: '',
      videoUrl: '',
      projectName: '',
      previewVideoData: {}
    }
  },
  computed: {
    disableCreateBtn() {
      return !!(this.cuttingList.length && this.selectedList.length < 1)
    }
  },
  mounted() {
    this.getVideoDetail()
    this.setLocalStorage()
  },
  methods: {
    setLocalStorage() {
      const index = this.$route.query.index
      if (index) {
        const params = {
          index: this.$route.query.index,
          list: this.$route.query.list
        }
        localStorage.setItem('videoEditUrlQuery', JSON.stringify(params))
      }
    },
    handelClickBack() {
      this.$router.go(-1)
    },

    fragmentCheck(list) {
      this.selectedList = _.sortBy(list, (item) => {
        return item.start
      })
    },
    async getVideoDetail() {
      const { videoId } = this.$route.query
      const { data } = await videoGenerateDetail({ videoId })
      const markListRes = await markList({ videoId })
      if (data.cutting.length) {
        const list = []
        data.cutting.forEach((item, index) => {
          const obj = { markList: [] }
          if (markListRes.data.length) {
            markListRes.data.forEach(_item => {
              if (item.end > _item.startTime && item.start < _item.endTime) {
                obj.markList.push(_item)
              }
            })
          }
          obj.start = item.start * 1000
          obj.end = item.end * 1000
          obj.label = getFormatSSS(item.start * 1000) + ' - ' + getFormatSSS(item.end * 1000)
          list.push(obj)
        })
        this.cuttingList = list
      }
      this.videoName = data.name
      this.videoUrl = data.videoUrl
      this.projectName = data.projectName
    },
    async handleClickCreateVideo() {
      const { videoId } = this.$route.query
      const list = []
      this.selectedList.forEach(item => {
        const arr = item.item.replaceAll(' ', '').split('-')
        list.push({
          videoId,
          startTime: formatPrTime(arr[0]) * 1000,
          endTime: formatPrTime(arr[1]) * 1000
        })
      })
      if (list.length === 0) {
        list.push({ videoId })
      }
      const loading = this.$loading({
        lock: true,
        text: '视频生成中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        await videoGgenerate(list)
        setTimeout(() => {
          loading.close()
          this.handelClickBack()
        }, 2000)
      } catch (err) {
        loading.close()
      }
    },
    videoPreview(data) {
      this.previewVideoData = data
    },
    videoPlaying(index) {
      this.$refs.list.updateActiveItem(index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .video-create-container {
    width: 100%;
    height: 100%;
    background: #1e1f1e;
    color: #d9d9d9;
    font-size: 14px;
    line-height: 22px;
    .create-header {
      height: 58px;
      border-bottom: 4px solid #000;
      position: relative;
      .back {
        position: absolute;
        top: 0;
        left: 30px;
        height: 100%;
        display: flex;
        align-items: center;
        i {
          margin-right: 4px;
        }
      }
      .title {
        font-size: 18px;
      }
    }
    .create-content {
      // height: calc(100% - 58px);
      height: 100%;
      .create-info {
        border-right: 4px solid #000;
        padding:20px 30px 0 30px;
        .title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .frame-list {
          margin-bottom: 30px;
        }
        .frame-info {
          color: #999;
          margin-bottom: 32px;
          p {
            margin-bottom: 16px;
            span {
              margin-right: 32px;
            }
          }
        }
      }
      .create-preview {
        padding: 20px;
        .title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .player-info {
          margin-top: 32px;
          width: 740px;
          p {
            span {
              color: #999;
              margin-left: 8px;
            }
          }
          .list{
            padding-top:10px;
            p{
              margin-right:26px;
              margin-bottom:6px;
            }
          }
        }
      }
    }
  }
   ::v-deep .el-loading-mask{
    background-color: rgba(255, 255, 255, 0.1);
  }

</style>

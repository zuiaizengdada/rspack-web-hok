<template>
  <div class="video-list-container" :style="{width:videoListWidth+'px'}">
    <p class="move-line" @mousedown="mousedownFun" />
    <div class="video-tit">
      <h4 class="title flex items-center">项目资源 <span>({{ list.length }})</span></h4>
    </div>
    <ul class="content">
      <li
        v-for="(item, index) in list"
        :key="item.id"
        :class="activeIndex === index ? 'active' : ''"
        draggable="true"
        @dragstart="dragStartVideoItem(item)"
        @click="handleClickVideomItem(item, index)"
      >
        <div class="image-box">
          <p class="bg" />
          <el-image :src="getHuoshanPosterUrl(item.posterUrl)" class="image" fit="cover" />
          <span v-if="item.exportStatus!==1" :class="`exportStatus${item.exportStatus}`">{{ exportStatusMap[item.exportStatus] }}</span>
          <el-button class="button" size="mini">编辑</el-button>
          <p class="editing">
            <img :src="TimesIcon" style="margin-right:4px;" />
            <span>编辑中</span>
          </p>
        </div>
        <p class="truncate" :title="item.name"><el-tooltip class="item" effect="dark" :content="`时间：${item.videoCreateTime}`" placement="top-start">
          <span v-if="item.version>0" class="video-version">V{{ item.version }}</span>
        </el-tooltip>{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import { videoList } from '../api'
import { getHuoshanPosterUrl } from '@/utils'
import TimesIcon from '../icons/time.svg'
import eventBus from '@/utils/eventBus'
export default {
  inject: ['video', 'updateAutoVideoSave', 'updateLayoutMoveSave', 'updateActiveDragVideoItemData'],
  data() {
    return {
      list: [],
      activeIndex: -1,
      exportStatusMap: {
        1: '未导出',
        2: '部分导出',
        3: '已导出'
      },
      value: '',
      visibleSuccessMsg: true,
      isMove: false,
      videoListWidth: 440,
      TimesIcon
    }
  },
  mounted() {
    eventBus.$on('updateVideoList', () => {
      this.getVideoList()
    })
    this.getVideoList()
    this.$nextTick(() => {
      this.videoListWidth = this.video.layoutMoveData && Object.keys(this.video.layoutMoveData).length > 0 ? this.video.layoutMoveData.videoListWidth : 440
      const $videoList = document.querySelector('.video-edit-container .edit-main')
      $videoList.addEventListener('mousemove', this.mousemoveFun)
      $videoList.addEventListener('mouseup', this.mouseupFun)
    })
  },
  methods: {
    async handleClickVideomItem(item, index) {
      if (index !== this.activeIndex) {
        this.activeIndex = index
        this.$emit('add', item)
        if (this.visibleSuccessMsg) {
          this.$message.success('保存成功')
        }
        this.visibleSuccessMsg = true
        this.updateAutoVideoSave()
        const scrollDom = document.querySelector('.tracks-box')
        scrollDom.scrollTo(0, 0)
      }
    },
    async getVideoList() {
      const { projectId, projectVideoId } = this.$route.query
      const { data } = await videoList({ projectId })
      console.log(data, '项目资源')
      this.list = data
      this.$nextTick(() => {
        this.visibleSuccessMsg = false
        const $lis = document.querySelectorAll('.video-list-container .content li')
        if ($lis) {
          const urlParams = localStorage.getItem('videoEditUrlQuery')
          if (urlParams) {
            const urlParamsData = JSON.parse(urlParams)
            const { index } = urlParamsData
            $lis[index].click()
          } else if (projectVideoId) {
            this.list.forEach((item, index) => {
              if (item.id === String(projectVideoId)) {
                $lis[index].click()
              }
            })
          } else {
            $lis[0].click()
          }
          localStorage.removeItem('videoEditUrlQuery')
        }
      })
    },
    mousedownFun() {
      this.isMove = true
    },
    mousemoveFun(e) {
      if (this.isMove) {
        const moveX = e.movementX
        const width = this.videoListWidth + moveX
        const videoRightWidth = document.querySelector('.video-edit-container .video-right-container').clientWidth + 4
        const documentWidth = document.body.clientWidth
        const maxWidth = documentWidth - videoRightWidth - 600
        if (width < 180 || width > maxWidth) return false
        this.videoListWidth = width
      }
    },
    mouseupFun() {
      this.isMove = false
      this.updateLayoutMoveSave({ videoListWidth: this.videoListWidth })
    },
    // 视频拖动
    dragStartVideoItem(item) {
      this.updateActiveDragVideoItemData(item)
    },
    getHuoshanPosterUrl
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep{
    .el-input__inner{
      border: 1px solid #4D4D4D;
      background: #1E1F1E;
      color: #d9d9d9;
    }
  }
  .screen{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
  }
  .exportStatus2,.exportStatus3{
        border-radius: 0px 0px 8px 0px;
        padding: 0 10px;
        height: 18px;
        line-height: 18px;
        box-sizing: border-box;
        font-size: 12px;
        font-weight: 400;
        color: #FFFFFF;
        margin-right: 10px;
        position: absolute;
        left: 0;
      }
      .exportStatus2{
        background: #1A8EC7;
      }
      .exportStatus3{
        background: #00B42A;
      }
  .video-list-container {
    user-select:none;
    position: relative;
    .video-tit{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom:1px solid #000;
      padding-right: 24px;
      box-sizing: border-box;
    }
    .video-version{
      background: #00B8D2;
      border-radius: 2px;
      padding: 0 4px;
      font-size: 12px;
      font-weight: 400;
      color: #FFFFFF;
      margin-right: 4px;
    }
    .move-line{
      cursor:col-resize ;
      position: absolute;
      top:0;
      right:-5px;
      width:10px;
      height: 100%;
      z-index: 2;
    }
    .title {
      color: #dedede;
      height: 40px;
      font-size: 16px;
      line-height: 24px;
      padding-left:24px;
      span{
        margin-left:4px;
      }
    }
    ul {
      overflow-y: auto;
      height: calc(100% - 44px);
      padding-right: 18px;
      background: #1e1f1e;
       padding: 10px 0px 0 24px;
      li {
        width: 125px;
        margin-bottom: 16px;
        margin-right:6px;
        display: inline-block;
        &.active {
          .image-box {
            border: 2px solid rgb(255, 144, 10);
            .bg {
              display: block;
            }
            .editing {
              display: flex;
              align-items: center;
              justify-content: center;
              i {
                font-size: 12px;
                margin-right: 5px;
              }
            }
          }
        }
        &:hover:not(.active) {
          .button {
            display: block;
          }
          .bg {
            display: block;
          }
        }
        // &:nth-child(3n){
        //   margin-right:auto;
        // }
        .image-box {
          width: 100%;
          border-radius: 4px;
          height: 70px;
          border: 2px solid #1e1f1e;
          margin-bottom: 4px;
          position: relative;
          .bg {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(0.5px);
          }
          .editing {
            display: none;
            width: 74px;
            height: 24px;
            background: #FF7D00;
            border-radius: 12px;
            color: #fff;
            font-size: 12px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3;
          }

          .image {
            width: 100%;
            height: 100%;
          }
          .button {
            display: none;
            position: absolute;
            z-index: 3;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        p {
          font-size: 12px;
          color: #a6a6a6;
        }
      }
    }
  }
</style>

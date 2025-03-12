<template>
  <div class="video-list-container">
    <div class="mapslist-header flex justify-between items-center ">
      <p class="title">视频 ({{ videoList.length }}个)</p>
      <div class="relative">
        <el-upload :before-upload="beforeUpload" accept=".mp4" :http-request="huoshanUpload" action="#" :show-file-list="false">
          <div class="upload-add flex items-center justify-between cursor-pointer">
            <el-image :src="uploadAddIcon" />
            <span>上传视频</span>
          </div>
        </el-upload>
      </div>
    </div>
    <ul class="list-content">
      <li
        v-for="(item, index) in videoList"
        :key="item.id"
        :class="{'active':activeIndexList.includes(index) }"
        :draggable="item.covertStatus===2"
        @dragstart="dragStartVideoItem(item)"
      >
        <div class="image-box relative" :class="{'cursor-move':item.covertStatus===2}">
          <p class="bg" />
          <el-image :src="item.posterUrl" class="image" fit="cover" style="background:#eee">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size:26px;color:#999" />
            </div>
          </el-image>
          <!-- <span v-if="item.exportStatus!==1" :class="`exportStatus${item.exportStatus}`">{{ exportStatusMap[item.exportStatus] }}</span> -->
          <el-button class="button" size="mini">编辑</el-button>
          <!-- <p v-if="item.covertStatus===2" class="editing">
            <img :src="TimesIcon" style="margin-right:4px;">
            <span>编辑中</span>
          </p> -->
          <p v-if="index!==0" class="hover-bg">
            <img :src="DeleteIcon" class="delete-btn absolute cursor-pointer" @click="handleClickDelete(index)" />
          </p>

          <div v-if="item.type=='transcoding'|| item.covertStatus===1" class="transcoding editing flex items-center justify-center">

            <img :src="TimesIcon" style="margin-right:4px;" />
            <span>转码中</span>
          </div>
        </div>
        <p class="truncate" :title="item.name" style="height:24px;">
          <span v-show="!item.isEdit" @dblclick="handleDbClickItem(index)">{{ item.name }}</span>
          <el-input v-show="item.isEdit" :ref="'videoItemInput'+index" v-model="currentEditVideoName" maxlength="20" auto-focus size="mini" style="height:100%" @blur="handleBlurItemName(index)" @keyup.native.enter="handleBlurItemName(index)" />
        </p>
        <div v-if="item.showLoadding" class="loadding-div">
          <p class="upload-p">上传中... {{ percentageData.toFixed(2) }}%</p>
          <el-progress :percentage="percentageData" :text-inside="true" />
        </div>

      </li>
    </ul>
  </div>
</template>
<script>

import { operateClipsProjectVideoList, updateVideoName, deleteVideo } from '../../api/live'
import uploadAddIcon from '../../icons/videoGroup/uploadAddIcon.svg'
import { getHuoshanPosterUrl } from '@/utils'
import { getSignature } from '@/api/liveVideo'
import TimesIcon from '../../icons/time.svg'
import DeleteIcon from '../../icons/videoGroup/deleteIcon.svg'
import uploadingIcon from '../../icons/videoGroup/uploadingIcon.svg'
export default {
  inject: ['updateCurrentDragItemData', 'video'],
  data() {
    return {
      percentageData: 0,
      listContentName: '视频文件（10）',
      getHuoshanPosterUrl,
      uploadAddIcon,
      videoList: [],
      activeIndexList: [0],
      exportStatusMap: {
        1: '未导出',
        2: '部分导出',
        3: '已导出'
      },
      TimesIcon,
      DeleteIcon,
      uploadingIcon,
      currentEditVideoName: '',
      isUploading: false
    }
  },
  computed: {
    getCutLineList() {
      return this.video.cutLineList
    }
  },
  watch: {
    getCutLineList() {
      const list = this.video.cutLineList
      console.log(list, 111111111)
      this.activeIndexList = []
      this.videoList.forEach((item, index) => {
        list.forEach(_item => {
          if (item.id === _item.videoData.id) {
            this.activeIndexList.push(index)
          }
        })
      })
    }
  },
  mounted() {
    this.getVideoList(true)
    this.intervalGetVideoList()
  },
  methods: {
    async updateVideoList() {
      const { projectId } = this.$route.query
      const { data } = await operateClipsProjectVideoList({ projectId })
      data.forEach(item => {
        item.isEdit = false
      })
      return data
    },
    async getVideoList(isInit = false) {
      this.videoList = await this.updateVideoList()
      if (isInit) {
        this.$emit('active', this.videoList[0])
      }
    },
    // 定时刷新videoList
    intervalGetVideoList() {
      setInterval(async () => {
        // const isHasLoading = this.videoList.findIndex(item => item.showLoadding)
        const list = await this.updateVideoList()
        this.videoList.forEach(item => {
          list.forEach(_item => {
            if (item.id === _item.id) {
              item.covertStatus = _item.covertStatus
            }
          })
        })
      }, 5000)
    },
    dragStartVideoItem(data) {
      this.updateCurrentDragItemData(data)
    },

    // 上传格式以及大小校验
    beforeUpload(file) {
      return new Promise((resolve) => {
        const isMP4 = file.type === 'video/mp4'
        if (!isMP4) {
          this.$message.error('只能上传mp4格式的视频！')
          return false
        }
        const isLt2M = file.size / 1024 / 1024 / 1024 < 20
        if (!isLt2M) {
          this.$message.error('上传视频大小不能超过20G！')
          return false
        }
        const maxUploadNum = 39
        if (this.videoList.length > maxUploadNum) {
          this.$message.error('视频不能超过40个')
          return false
        }
        const videoElement = document.createElement('video')
        videoElement.src = URL.createObjectURL(file)
        videoElement.addEventListener('loadedmetadata', () => {
          if (this.video.detail.width !== videoElement.videoWidth || this.video.detail.height !== videoElement.videoHeight) {
            this.$message.error('所上传的视频分辨率与主视频不一致！')
            return false
          } else {
            return resolve(true)
          }
          // return resolve(true)
        })
      })
    },
    // 火山云上传
    huoshanUpload(e) {
      if (this.isUploading) return
      // eslint-disable-next-line new-cap
      const tcVod = new window.TcVod.default({
        getSignature: this.queryGetSignature // 前文中所述的获取上传签名的函数
      })
      const uploader = tcVod.upload({
        mediaFile: e.file // 媒体文件（视频或音频或图片），类型为 File
      })
      this.videoList.push({
        name: e.file.name,
        type: 'loading',
        showLoadding: true
      })
      this.isUploading = true
      // 视频上传进度
      uploader.on('media_progress', (info) => {
        const percentage = Number(info.percent.toFixed(2))
        this.percentageData = parseFloat(percentage * 100)
        if (info.percent === 1) {
          this.videoList.some(item => {
            this.$set(item, 'showLoadding', false)
          })
        }
      })
      // 视频上传进度
      uploader.on('cover_upload', (info) => {
        console.log(info, 6666)
      })
      uploader.done().then((doneResult) => {
        const lastItem = this.videoList[this.videoList.length - 1]
        lastItem.type = 'transcoding'
        this.percentageData = 0
        this.isUploading = false
      }).catch(() => {

      })
    },
    // 生成签名
    async queryGetSignature() {
      const projectId = this.$route.query.projectId
      const res = await getSignature({
        projectId
      })
      return res.data
    },
    handleDbClickItem(index) {
      const videoItem = this.videoList[index]
      if (videoItem.covertStatus !== 2) return
      this.videoList[index].isEdit = true
      this.$nextTick(() => {
        this.currentEditVideoName = this.videoList[index].name
        this.$refs['videoItemInput' + index][0].focus()
      })
    },
    async handleBlurItemName(index) {
      const videoItem = this.videoList[index]
      // const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
      // if (this.currentEditVideoName.length && !regex.test(this.currentEditVideoName)) {
      //   this.$message.error('视频名称只能输入中文、英文、数字')
      //   this.currentEditVideoName = videoItem.name
      //   return
      // }

      if (this.currentEditVideoName.length === 0) {
        this.currentEditVideoName = videoItem.name
        return
      }
      if (videoItem.name !== this.currentEditVideoName) {
        const projectId = this.$route.query.projectId
        const videoId = videoItem.id
        await updateVideoName({
          projectId,
          videoId,
          videoName: this.currentEditVideoName
        })
        this.$message.success('视频名称修改成功')
        videoItem.name = this.currentEditVideoName
      }
      this.currentEditMapsItemName = ''
      videoItem.isEdit = false
    },
    async handleClickDelete(index) {
      if (index === 0) return
      const videoItem = this.videoList[index]
      const projectId = this.$route.query.projectId
      const params = {
        projectId,
        videoId: videoItem.id
      }
      await deleteVideo(params)
      this.getVideoList()
    }
  }
}
</script>
<style lang="scss" scoped>
.video-list-container{
    .mapslist-header{
      height:40px;
      padding:0 20px;
      border-bottom:1px solid #000;
      color:#DEDEDE;
      font-size:16px;
      width:100%;
      .upload-add{
          width: 102px;
          height: 30px;
          background: #3B3B3B;
          border-radius: 4px;
          border: 1px solid #4D4D4D;
          padding:0 10px;
          font-size:14px;
      }
  }
    .list-content{
         overflow: auto;
         height: calc(100% - 42px);
         padding:16px 20px;
        li {
            width: 110px;
            margin-bottom: 16px;
            margin-right:10px;
            display: inline-block;
            position: relative;
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
            // &:hover:not(.active) {
            //     .button {
            //     display: block;
            //     }
            //     .bg {
            //     display: block;
            //     }
            // }
            // &:nth-child(3n){
            //   margin-right:auto;
            // }
            .loadding-div {
              width: 100%;
              border-radius: 4px;
              height: 70px;
              background: rgba(0, 0, 0, 0.4);
              position: absolute;
              top:0;
              left:0;
              float: left;
              .upload-p {
                margin-top: 16px;
                color: #fff;
                height: 16px;
                line-height: 16px;
                width: 100%;
                text-align: center;
                float: left;
              }
              ::v-deep .el-progress {
                width: 90%;
                margin-top: -3px;
                margin-left: 5%;
                float: left;
              }
            }
            .image-box {
                width: 100%;
                border-radius: 4px;
                height: 70px;
                border: 2px solid #1e1f1e;
                margin-bottom: 4px;
                position: relative;
                .bg,.hover-bg {
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
                .transcoding{
                  display: flex;
                  // background: #fff;
                  // color:#FF7D00;
                  // text-align: center;
                  // line-height: 24px;;
                }
                .delete-btn{
                  top:45px;
                  left:4px;
                  display: none;
                }
                &:hover{
                    border: 2px solid #FF7D00;
                  .delete-btn{
                    display: block;
                  }
                  .hover-bg {
                    display: block;
                  }
                }
                .image {
                width: 100%;
                height: 100%;
                border-radius: 4px;
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

::v-deep .el-input--mini .el-input__inner{
  height:24px;
  line-height: 24px;
}
</style>

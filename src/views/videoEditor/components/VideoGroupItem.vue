<template>
  <div class="video-list-container" :style="{width:videoListWidth+'px'}">
    <p class="move-line" @mousedown="mousedownFun" />
    <div class="video-tit">
      <h4 class="title flex items-center">项目资源 <span>({{ list.length }})</span></h4>
      <div class="flex">
        <div class="addMaterial" @click="showMaterial">添加素材</div>
        <span v-if="cameraOptions.length>1" class="camera-select">
          <span>机位</span>
          <el-select v-model="currentCamera" class="search-select" size="mini" @change="filterCamera">
            <el-option v-for="item in cameraOptions" :key="item.multiCameraGroupId" :label="item.caremaName" :value="item.multiCameraGroupId" />
          </el-select>
        </span>
      </div>
    </div>
    <ul class="content">
      <div>
        <li
          v-for="(item, index) in list"
          :key="item.id"
          :class="selectVideo === item.id ? 'active' : ''"
          @click="handleClickVideomItem(item, index)"
        >
          <div class="image-box">
            <p class="bg" />
            <el-image :src="getHuoshanPosterUrl(item.posterUrl)" class="image" fit="cover" />
            <div class="markList">
              <span v-if="item.isEmptyMirror === 1" class="emptyScene">空镜</span>
              <span v-if="item.exportStatus!==1" :class="`exportStatus${item.exportStatus}`" :style="item.isEmptyMirror === 1?'border-radius:0px 0px 8px 4px':''">{{ exportStatusMap[item.exportStatus] }}</span>
            </div>
            <el-button class="button" size="mini">编辑</el-button>
            <p class="editing">
              <img :src="TimesIcon" style="margin-right:4px;" />
              <span>编辑中</span>
            </p>
          </div>
          <p class="truncate flex" :title="item.name">
            <el-tooltip class="item" effect="dark" :content="`时间：${item.videoCreateTime}`" placement="top-start">
              <span v-if="item.version>0" class="video-version">V{{ item.version }}</span>
            </el-tooltip>
            <span class="flex" style="overflow: hidden;">
              <span class="text_hidden_ellipsis flex-1">
                {{ item.name }}
              </span>
              <span v-if="item.videoGroupType === 2" class="caremaName">{{ item.caremaName }}</span>
            </span>
          </p>
        </li>
      </div>

      <div v-if="externalList.length" class="flex flex-column">
        <div class="externalName flex flex-middle">
          <span>外部素材</span>
          <span class="externalLine" />
        </div>
        <div class="m-t-12">
          <li
            v-for="(item, index) in externalList"
            :key="item.id"
            :class="selectVideo === item.id ? 'active' : ''"
            @click="handleClickVideomItem(item, index)"
          >
            <div class="image-box">
              <p class="bg" />
              <el-image :src="getHuoshanPosterUrl(item.posterUrl)" class="image" fit="cover" />
              <div class="markList">
                <span v-if="item.isEmptyMirror === 1" class="emptyScene">空镜</span>
                <span v-if="item.exportStatus!==1" :class="`exportStatus${item.exportStatus}`" :style="item.isEmptyMirror === 1?'border-radius:0px 0px 8px 4px':''">{{ exportStatusMap[item.exportStatus] }}</span>
              </div>
              <el-button class="button" size="mini">编辑</el-button>
              <p class="editing">
                <img :src="TimesIcon" style="margin-right:4px;" />
                <span>编辑中</span>
              </p>
            </div>
            <p class="truncateExternal flex flex-middle" :title="item.name">
              <el-tooltip class="item" effect="dark" :content="`时间：${item.videoCreateTime}`" placement="top-start">
                <span v-if="item.version>0" class="video-version">V{{ item.version }}</span>
              </el-tooltip>
              <span class="truncate truncateExternalName">{{ item.name }}</span>
              <i class="el-icon-delete myDelete" @click.stop="deleteVideo(item)" />
            </p>
          </li>
        </div>
      </div>
    </ul>
    <videoAddMaterial ref="addMaterial" :external-list="externalList" @updataList="updataList" />
  </div>
</template>
<script>
import { videoList, externalVideoDelete, getGroupByVideoProjectId } from '../api'
import { getHuoshanPosterUrl } from '@/utils'
import videoAddMaterial from './videoAddMaterial'
import TimesIcon from '../icons/time.svg'
import eventBus from '@/utils/eventBus'
export default {
  inject: ['video', 'updateAutoVideoSave', 'updateLayoutMoveSave'],
  components: {
    videoAddMaterial
  },
  data() {
    return {
      list: [],
      externalList: [], // 外部视频
      activeIndex: -1,
      selectVideo: -1,
      currentCamera: 0,
      cameraOptions: [],
      allVideoList: [],
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
    eventBus.$on('updateVideoList', async () => {
      this.updataList()
    })
    this.getVideoList()
    this.getGroupByVideoProjectId()
    this.$nextTick(() => {
      this.videoListWidth = this.video.layoutMoveData && Object.keys(this.video.layoutMoveData).length > 0 ? this.video.layoutMoveData.videoListWidth : 440
      const $videoList = document.querySelector('.video-edit-container .edit-main')
      $videoList.addEventListener('mousemove', this.mousemoveFun)
      $videoList.addEventListener('mouseup', this.mouseupFun)
    })
  },
  methods: {
    filterCamera() {
      if (this.currentCamera) {
        this.list = this.allVideoList.filter(item => item.multiCameraGroupId === this.currentCamera)
      } else {
        this.list = this.allVideoList.filter(item => item.isExternal === 2)
      }
    },
    async getGroupByVideoProjectId() {
      const { projectId } = this.$route.query
      const { data } = await getGroupByVideoProjectId({ projectId })
      // 插入一条全部数据
      this.cameraOptions = [{ multiCameraGroupId: 0, caremaName: '全部' }, ...data]
      console.log(this.cameraOptions, 'multiCameraGroupId')
    },
    async updataList() {
      const { projectId } = this.$route.query
      const { data } = await videoList({ projectId })
      // 根据返回的isExternal区分是内部视频还是外部视频 内部视频加到list 外部视频加到externalList
      this.list = data.filter(item => item.isExternal === 2)
      const arr = data.filter(item => item.isExternal === 1)
      // this.externalList 根据id排序 id大的在后面
      arr.sort((a, b) => Number(a.createTime) - Number(b.createTime))
      this.externalList = arr
      console.log(this.externalList, '外部视频')
    },
    // 展示选择素材弹窗
    showMaterial() {
      this.$refs.addMaterial.loadData()
      this.$refs.addMaterial.showMaterial()
    },
    // 删除外部视频
    async deleteVideo(item) {
      // 二次确认
      this.$confirm('确定删除该视频吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await externalVideoDelete({ projectVideoId: item.id })
        console.log(res, '删除外部视频')
        this.$message.success('删除成功')
        this.updataList()
      })
    },
    async handleClickVideomItem(item, index) {
      console.log(item, '视频信息')
      if (item.id !== this.selectVideo) {
        this.selectVideo = item.id
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
      this.allVideoList = data
      this.list = data.filter(item => item.isExternal === 2)
      console.log(this.list, '本身的视频')
      this.externalList = data.filter(item => item.isExternal === 1)
      console.log(this.externalList, '外部视频')
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
    getHuoshanPosterUrl
  }
}
</script>
<style lang="scss" scoped>
.truncateExternalName{
  width: 100px;
  flex: 1;
}
.caremaName{
  padding: 0 4px;
    box-sizing: border-box;
    // width: 44px;
    // height: 18px;
    border-radius: 4px;
    border:1px solid #a6a6a6;
    // background: #d9d9d9;
    color: #a6a6a6;
    font-size: 12px;
    font-weight: 400;
    margin-left: 8px;
    box-sizing: border-box;
}
.camera-select{
  margin-left: 4px;
  color: #d9d9d9;
  font-size: 14px;
}

.search-select{
    width: 100px;
    border:1px solid #4D4D4D;
    border-radius: 4px;
    margin-left: 4px;
  }
.myDelete{
  cursor: pointer;
  display: none;
}
.externalName{
 color: #ffffff;
 font-size: 16px;
 text-align: left;
 padding-right: 24px;
 box-sizing: border-box;
 .externalLine{
  // 虚线
  //border-top: 1px dashed #4D4D4D;
  border-top: 0;
  background-image: linear-gradient(to right, #ffffff 33%, transparent 33%, transparent 66%, #ffffff 66%);
  background-size: 12px 1px;
  height: 1px;
  flex: 1;
  margin-left: 10px;
 }
}
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
  .markList{
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    .emptyScene{
      padding: 0 5px;
      background: #00D2B2;
      text-align: center;
      border-radius: 0px 0px 8px 0px;
      font-size: 12px;
      font-weight: 400;
      color: #FFFFFF;
      margin-right: 5px;
    }
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
      .addMaterial{
        border-radius: 4px;
        border: 1px solid #4d4d4d;
        color: #d9d9d9;
        font-size: 14px;
        padding: 2px 8px;
        cursor: pointer;
      }
      .addMaterial:hover{
        border:1px solid #1778ff;
        color: #1778ff
      }
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
          .myDelete {
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

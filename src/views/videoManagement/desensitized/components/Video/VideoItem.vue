<template>
  <div class="video-container">
    <div class="top flex justify-between items-center">
      <p class="title truncate">{{ data.name }}</p>
      <i v-if="visibleDeleteBtn" class="el-icon-delete cursor-pointer" title="删除" @click="handleClickDelete" />
      <!-- <i v-if="visibleDownload" class="el-icon-download cursor-pointer" title="下载" @click="handleClickDownload" /> -->
    </div>
    <div class="image">
      <span v-if="data.isEmptyMirror === 1" class="emptyScene">空镜</span>
      <el-image fit="cover" style="height:180px;width:100%;border-radius:5px" :src="getHuoshanPosterUrl(data.posterUrl)" />
      <img src="@/assets/image/icon_bofang.png" class="icon cursor-pointer" @click="handleClickPlay(data)" />
      <p class="tips flex items-center">
        <span>大小：{{ data.size | filterSize }}</span>
        <span>时长：{{ getPlayDuration(data.duration*1000) }}</span>
      </p>
    </div>
    <ul class="flex items-center bottom">
      <li>
        <label class=" font-normal">上传者：</label>
        <span>{{ data.createUserName }}</span>
      </li>
      <li>
        <label class=" font-normal">上传时间：</label>
        <span>{{ data.createTime }}</span>
      </li>
    </ul>
    <div v-if="visibleStatus" class="video-status flex justify-between" style="margin-top:20px">
      <p class="status flex justify-center items-center">
        <label class=" font-normal">状态：</label>
        <span :class="statusList[data.status-1].class" class="flex items-center">
          <img v-if="statusList[data.status-1].src&&statusList[data.status-1].src.length" :src="statusList[data.status-1].src" style="width:14px;margin-right:4px;" alt="" />
          <i v-else :class="[statusList[data.status-1].icon,'mr-1'] " />
          {{ statusList[data.status-1].name }}</span>
      </p>
      <el-button v-if="visibleReloadBtn" size="mini" :disabled="data.status===1" @click="handleClickReload">重新脱敏</el-button>
    </div>
    <video-player :visible="visibleVideoPlayer" :src="data.src" :video-name="data.name" />
  </div>
</template>
<script>
import VideoPlayer from '../../../component/videoplayer/videoplayer.vue'
import videoplayer from '../../../component/videoplayer/index.js'
import timeIcon from '@/assets/svg/videoManga/time.svg'
import { checkDesensitized, delOriginalVideoId, videoDownLoadRecord } from '@/api/videoManagement/origin'
import { getPlayDuration, getHuoshanPosterUrl, downVideo } from '@/utils/index'
export default {
  components: {
    VideoPlayer
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    visibleDelete: {
      type: Boolean,
      default: true
    },
    visibleDownload: {
      type: Boolean,
      default: false
    },
    visibleStatus: {
      type: Boolean,
      default: false
    },
    createId: {
      type: String,
      default: ''

    },
    // 多视频且主机位
    isHostCamera: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visibleVideoPlayer: false,
      statusList: [
        { name: '脱敏中', class: 'orange', icon: 'el-icon-warning', src: timeIcon },
        { name: '已脱敏', class: 'green', icon: 'el-icon-success' },
        { name: '脱敏失败', class: 'red', icon: 'el-icon-error' }],
      visibleReloadBtn: true,
      visibleDeleteBtn: false
    }
  },

  mounted() {
    const userId = this.$store.getters.userInfo.userId
    if (this.visibleDelete) {
      if (userId === this.createId) {
        this.visibleDeleteBtn = true
      } else {
        if (userId === this.data.createUserId) {
          this.visibleDeleteBtn = true
        }
      }
    }
    this.visibleReloadBtn = this.createId === userId
  },
  methods: {
    async handleClickReload() {
      const { originalVideoId } = this.data
      await checkDesensitized({ originalVideoId })
      this.$emit('reload')
    },
    handleClickPlay(data) {
      console.log(data, '点击数据')
      // data.name 后缀名是不是mxf或者MXF
      if ((data.name.indexOf('mxf') > -1 || data.name.indexOf('MXF') > -1) && data.status === 1) {
        this.$message.error('视频自动脱敏完成之后可以预览')
        return
      }
      const { videoUrl, name, originalVideoId } = this.data
      videoplayer.play({
        visible: true,
        url: videoUrl,
        videoName: name,
        videoId: originalVideoId,
        autoplay: false
      })
    },
    handleClickDelete() {
      // if (this.isHostCamera) {
      //   this.$confirm('删除主机位视频之前，请删除副机位视频！', '提示', {
      //     type: 'warning'
      //   })
      // } else {
      this.$confirm('确定要删除此视频吗', '提示', {
        type: 'warning'
      }).then(async () => {
        const { originalVideoId } = this.data
        await delOriginalVideoId({ originalVideoId })
        this.$message.success('删除成功')
        this.$emit('delete')
      }).catch(() => {

      })
      // }
    },
    async handleClickDownload() {
      const { videoUrl, name, originalVideoId } = this.data
      downVideo(videoUrl, name)
      await videoDownLoadRecord({
        originalVideoId,
        videoGroupId: '',
        videoType: 1
      })
    },
    getPlayDuration,
    getHuoshanPosterUrl
  }
}
</script>
<style lang="scss" scoped>
.video-container{
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #EFF2F6;
    font-size:14px;
    padding:16px;
    line-height: 1;
    color:#333;

    .top{
       padding-bottom:12px;
       i{
        font-size:18px;
        visibility: hidden;
        color:#0C6FFF;
       }
    }
    &:hover{
        i{
            visibility: visible;
        }
        box-shadow: -2px 4px 12px 0px rgba(22,22,22,0.25);
    }
    .image{
        width:100%;
        position: relative;
        margin-bottom:16px;
        .emptyScene{
          position: absolute;
          top:0;
          left:0;
          width: 39px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          background: #00D2B2;
          border-radius: 4px 0px 8px 0px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          z-index: 999;
        }
        .icon{
            position:absolute;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
            font-size:50px;
            z-index: 2;
        }
        .tips{
            position: absolute;
            bottom:0;
            left:0;
            width:100%;
            background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
            border-radius: 0px 0px 5px 5px;
            height:32px;
            color:#fff;
            z-index: 3;
            padding:0 8px;
            span{
                margin-right:16px;
            }
        }
    }
    .bottom{
        li{
              font-size:12px;
              margin-right:8px;
               label{
                color:#777;
            }
        }
    }
    .video-status{
      font-size:14px;
      color:#777;
      .status{
        .green{
          color:#00B42A;
          background: #E6F7EA;
        }
        .orange{
            color:#FF7D00;
            background: #FFF2E6;
        }
        .red{
            color:#F53F3F;
            background: #FEECEC;
        }
        span{
          height: 24px;
          border-radius: 12px;
          line-height: 24px;;
          padding:0 10px;
          font-size:12px;
        }
      }
    }
}
</style>

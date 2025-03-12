<template>
  <div class="video-container" :class="checked?'sbxuanzhongle':''">
    <div v-loading="itemLoadding" class="block-down">
      <div class="top flex justify-between">
        <p v-if="desensflag" class="title"><span>{{ data.name }}</span><span v-if="type === 2" class="caremaName">{{ data.caremaName }}</span></p>
        <div v-else class="title-update">
          <div v-if="!inputFlag" class="title-update-detail">
            <span class="flex">
              <span class="flex-1 dataName">{{ data.name }}</span>
              <span v-if="type === 2" class="caremaName">{{ data.caremaName }}</span>
            </span>
            <em @click="toUpdateInput">修改</em>
          </div>
          <div v-else class="title-input-row">
            <el-input v-model="updateName" size="mini" />
            <el-button size="mini" type="primary" @click="sureToUpdate">确定</el-button>
          </div>
        </div>
        <el-checkbox v-show="!istmflag" :key="data.originalVideoId" :label="data.originalVideoId" :disabled="data.status === 2&&data.checkShare?false:true" :value="data.originalVideoId"><pre>&nbsp;</pre></el-checkbox>
        <img v-if="isUploaderFlag && istmflag && showstatus && data.status === 2 && !downloadNowFlag" v-permission="['web:desenitization:download', permsList]" class="download-ls" src="@/assets/image/video/download.png" />
        <a
          v-if="isUploaderFlag && istmflag && showstatus && data.status === 2"
          :href="data.videoUrl"
          target="tempiframe"
          download=""
          class="download-a"
          @click="downloadOne(data)"
        />
        <i v-if="downloadNowFlag" class="el-icon-loading" style="color: #0C6FFF" />
        <i v-if="visibleDelete" class="el-icon-delete cursor-pointer" @click="handleClickDelete" />
      </div>
      <div class="image">
        <div class="tipsContent">
          <span v-if="data.isEmptyMirror === 1" class="tmshare emptyScene">空镜</span>
          <!-- <span v-if="data.isShare && showstatus" class="tmshare" :style="data.isEmptyMirror === 1?'border-radius:0px 0px 6px 3px':'' ">已脱敏共享</span> -->
          <span v-if="!data.isShare && showstatus" class="tmshare untmshare" :style="data.isEmptyMirror === 1?'border-radius:0px 0px 6px 3px':'' ">待共享</span>
          <el-tooltip
            v-if="data.isShare && showstatus"
            placement="right-start"
            popper-class="share-user-tool"
            :open-delay="200"
          >
            <div slot="content">
              <div>共享给：</div>
              <template v-if="shareUserList.length">
                <div v-for="(item, index) in shareUserList" :key="index">
                  {{ index+1 }}、{{ item.username }}
                </div>
              </template>
              <div v-else>所有人</div>
            </div>
            <span class="tmshare pointer" :style="data.isEmptyMirror === 1?'border-radius:0px 0px 6px 3px':'' " @mouseover="getShareUserList">
              已脱敏共享
            </span>
          </el-tooltip>
          <el-tooltip
            v-if="data.deliveryStatus"
            placement="right-start"
            :open-delay="200"
          >
            <div slot="content">
              <div v-for="(deliveryItem, index) in deliveryList" :key="deliveryItem.orgId">
                {{ index+1 }}、{{ deliveryItem.deliveryTime }} {{ deliveryItem.orgName }}
              </div>
            </div>
            <span class="tmshare pointer" @mouseover="getDelivery">
              已分发
            </span>
          </el-tooltip>
        </div>
        <el-image fit="cover" style="height:180px;width:100%; border-radius: 8px;" :src="data.posterUrl && data.posterUrl.indexOf('http') >= 0?data.posterUrl:getHuoshanPosterUrl(data.posterUrl)" />
        <img src="@/assets/image/icon_bofang.png" class="icon cursor-pointer" @click="handleClickPlay" />
        <p class="tips flex items-center">
          <span>大小：{{ data.size | filterSize }}</span>
          <span>时长：{{ getPlayDuration(data.duration*1000) }}</span>
        </p>
      </div>
      <ul class="flex items-center bottom" :style="listtype?'margin-bottom:20px;':''">
        <li v-if="!desensflag">
          <label>上传者：</label>
          <span>{{ data.createUserName }}</span>
        </li>
        <li>
          <label v-if="desensflag">生成时间：</label>
          <label v-else>上传时间：</label>
          <span>{{ DateFormat(new Date(data.createTime),'yyyy-MM-dd hh:mm:ss') }}</span>
        </li>
      </ul>
      <div v-if="listtype" class="video-status flex justify-between">
        <p class="status flex justify-center items-center">
          <label v-if="desensflag">视频处理：</label>
          <span v-if="desensflag" style="font-size: 12px;" :class="statusListRg[data.status-1].class"><i :class="[statusListRg[data.status-1].icon,'mr-1'] " />{{ statusListRg[data.status-1].name }}</span>
          <span v-if="!desensflag && data.isInvalid!==1" style="font-size: 12px;" :class="statusList[data.status-1].class"><i :class="[statusList[data.status-1].icon,'mr-1'] " />{{ statusList[data.status-1].name }}</span>
        </p>
        <div v-if="data.isInvalid === 1 && isUploaderFlag">
          <el-button style="font-size: 14px;" size="mini" @click="setCancelInvalid(data)">取消“无效素材”</el-button>
        </div>
        <div v-else-if="data.multiVideoType !==2">
          <div v-if="!desensflag" style="float: left;">
            <el-button v-if="isUploaderFlag && data.status != 1 && data.isEmptyMirror !== 1" style="font-size: 14px;" size="mini" :disabled="data.status===1" @click="handleClickReload(data)">重新脱敏</el-button>
          </div>
          <div v-else style="float: left;">
            <el-button v-if="(isUploaderFlag && data.status === 3)" style="font-size: 14px;" size="mini" :disabled="data.status===1" @click="reForChuli(data)">重新处理</el-button>

          </div>
          <el-button v-if="isUploaderFlag && !desensflag && data.status === 2 && data.isEmptyMirror !== 1" style="font-size: 14px; margin-left: 10px;" size="mini" type="primary" @click="toDesensitizationVideo(data)">在线脱敏</el-button>
        </div>

      </div>
      <video-player :visible="visibleVideoPlayer" :close-on-press-escape="true" :src="data.src" :video-name="data.name" />
    </div>
    <iframe name="tempiframe" style="display: none" />
  </div>
</template>
<script>
import VideoPlayer from '../../../component/videoplayer/videoplayer.vue'
import videoplayer from '../../../component/videoplayer/index.js'
import { toDesensitized, toDesensitizedRg, reprocessVideo, updateVideoName } from '@/api/product/videoManager'
import { getDeliveryCpOrgListApi, getDesensitizedVideoShareSpecificUser } from '@/api/videoManagement/vedioSetting'
import { setInvalidVideo } from '@/api/videoManagement/subtitleEditor'
// import { urlVodExportZip } from '@/utils/zip'
import { getPlayDuration, getHuoshanPosterUrl } from '@/utils/index'
import { videoDownLoadRecord } from '@/api/videoManagement/origin'
import { DateFormat } from '@/utils/index'

export default {
  components: {
    VideoPlayer
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    // 1单机位 2多机位
    type: {
      type: Number,
      default: 1
    },
    checkedVideo: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    visibleDelete: {
      type: Boolean,
      default: true
    },
    desensflag: {
      type: Boolean,
      default: false
    },
    isUploaderFlag: {
      type: Boolean
    },
    istmflag: {
      type: Boolean
    },
    listtype: {
      type: Boolean
    },
    showstatus: {
      type: Boolean
    },
    groupid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      updateName: '',
      inputFlag: false,
      downloadNowFlag: false,
      checked: false,
      permsList: this.$route.meta.permsList || [],
      itemLoadding: false,
      visibleVideoPlayer: false,
      statusList: [{ name: '自动脱敏中', class: 'orange', icon: 'el-icon-warning' }, { name: '已自动脱敏', class: 'green', icon: 'el-icon-success' }, { name: '自动脱敏失败', class: 'red', icon: 'el-icon-error' }],
      statusListRg: [{ name: '处理中', class: 'orange', icon: 'el-icon-warning' }, { name: '已处理', class: 'green', icon: 'el-icon-success' }, { name: '处理失败', class: 'red', icon: 'el-icon-error' }],
      deliveryList: [],
      shareUserList: []
    }
  },
  watch: {
    checkedVideo: {
      handler (newName, oldName) {
        this.checked = false
        newName.some(item => {
          if (item === this.data.originalVideoId) {
            this.checked = true
          }
        })
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    DateFormat,
    getPlayDuration,
    getHuoshanPosterUrl,
    toDesensitizationVideo(row) {
      console.log('roooowwww:', row)
      const videoGroupId = this.groupid
      const videoGroupName = row.name
      this.$router.push(`/subtitleEditor/${videoGroupId}?videoGroupName=${videoGroupName}&toZimuOriginalVideoId=${row.originalVideoId}`)
    },
    async setCancelInvalid(item) {
      item.isInvalid = 0
      await setInvalidVideo({ originalVideoId: item.originalVideoId, type: 2 })
      this.$emit('loadingData')
    },
    toUpdateInput() {
      this.inputFlag = true
      this.updateName = this.data.name.substring(0, this.data.name.lastIndexOf('.'))
    },
    sureToUpdate() {
      const reg = /^[\w\u4E00-\u9FA5\-\.\(\)\ （\）\:]+$/
      // 过滤掉空格
      this.updateName = this.updateName.replace(/\s+/g, '')
      if (!reg.test(this.updateName)) {
        this.$message.error('填写的名称中不能有特殊字符！')
        return
      }
      const params = {
        originalVideoId: this.data.originalVideoId,
        videoName: this.updateName + this.data.name.substring(this.data.name.lastIndexOf('.'), this.data.name.length)
      }
      updateVideoName(params).then(res => {
        if (res.code === 1) {
          this.$message.success('修改成功！')
          this.data.name = params.videoName
          this.inputFlag = false
        }
      })
    },
    async downloadOne(data) {
      // const list = []
      this.downloadNowFlag = true
      /* list.push({ src: data.videoUrl, name: data.name.replace('.mp4', '') + '.mp4' })
      list.push({ src: data.subtitleFileUrl, name: data.name.replace('.mp4', '') + '.srt' })
      await urlVodExportZip(list, data.name.replace('.mp4', '.zip')) */
      await videoDownLoadRecord({
        originalVideoId: data.originalVideoId,
        videoGroupId: '',
        videoType: 2
      })
      this.downloadNowFlag = false
    },
    reForChuli(data) {
      this.itemLoadding = true
      const params = {
        desensitizedId: data.originalVideoId
      }
      reprocessVideo(params).then(res => {
        if (res.success) {
          this.itemLoadding = false
        }
      })
    },
    handleClickReload(data) {
      this.itemLoadding = true
      this.data.status = 1
      if (this.desensflag) {
        const params = {
          desensitizedId: data.originalVideoId
        }
        toDesensitizedRg(params).then(res => {
          if (res.success) {
            this.itemLoadding = false
          }
        })
      } else {
        const params = {
          originalVideoId: data.originalVideoId
        }
        toDesensitized(params).then(res => {
          if (res.success) {
            this.itemLoadding = false
          }
        })
      }
    },
    handleClickPlay() {
      // data.name 后缀名是不是mxf或者MXF
      if ((this.data.name.indexOf('mxf') > -1 || this.data.name.indexOf('MXF') > -1) && this.data.status === 1) {
        this.$message.error('视频自动脱敏完成之后可以预览')
        return
      }
      // 如果是mxf且没有自动脱敏完成
      const { videoUrl, name, originalVideoId } = this.data
      videoplayer.play({
        visible: true,
        url: videoUrl,
        videoName: name,
        videoId: originalVideoId,
        // autoplayMuted: true,
        autoplay: false,
        closeOnPressEscape: true
      })
    },
    handleClickDelete() {
      this.$confirm('确定要删除改视频吗', '提示', {
        type: 'warning'
      }).then(() => {
        this.$emit('delete', this.data)
      }).catch(() => {

      })
    },
    getDelivery() {
      if (this.deliveryList.length > 0) return
      getDeliveryCpOrgListApi({
        bizId: this.data.originalVideoId,
        type: 1 // 脱敏视频
      }).then(res => {
        if (res.data) {
          this.deliveryList = res.data
        }
      })
    },
    getShareUserList() {
      getDesensitizedVideoShareSpecificUser({
        desensitizedVideoId: this.data.originalVideoId
      }).then(res => {
        if (res.data) {
          this.shareUserList = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pointer{ cursor: pointer; }
.tipsContent{
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  z-index: 999;
  display: flex;
  .emptyScene{
    padding: 4px 10px;
    text-align: center;
    background: #00D2B2;
    /* border-radius: 4px 0px 4px 0px; */
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    /* margin-right: 5px; */
  }
  .tmshare {
      color:#00B42A;
      background: #E6F7EA;
      font-size: 12px;
      padding: 4px 10px;
      z-index: 33;
      &:last-child{
        border-bottom-right-radius: 6px;
      }
      &:first-child{
        border-top-left-radius: 6px;
      }
  }
}

.video-container{
  background: #FFFFFF;
  border-radius: 6px;
  border: 1px solid #EFF2F6;
  font-size:14px;
  padding:16px;
  line-height: 1;
  color:#333;
  ::v-deep .el-checkbox {
      margin-top: 0px;
  }
  ::v-deep .el-checkbox__label {
      display: none;
  }
  .download-ls {
      width: 16px;
      margin-top: -2px;
      cursor: pointer;
  }
  .top{
      padding-bottom:12px;
      i{
      font-size:16px;
      visibility: hidden;
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
      .untmshare {
          color:#FF7D00;
          background: #FFF2E6;
      }
      .icon{
          position:absolute;
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
          font-size:50px;
          z-index: 2;
          color:#fff;
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
      }
    }
  }
.title {
  height: 16px;
  padding-right: 10px;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap;
  display: flex;
  align-items: center;
}

}
.caremaName{
    padding: 0 4px;
    box-sizing: border-box;
    // width: 44px;
    height: 18px;
    line-height: 18px;
    border-radius: 4px;
    background: #fff2e6;
    color: #333333;
    font-size: 12px;
    font-weight: 400;
    margin-left: 8px;
  }
.sbxuanzhongle {
border: 1px solid #0C6FFF;
}
.block-down {
position: relative;
}
.download-a {
position:absolute;
width: 20px;
height: 20px;
right: 0;
top: -3px;
}

.title-update {
max-width: 92%;
height: 16px;
padding-bottom: 15px;
.title-update-detail {
  width: 100%;
  .dataName{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // min-width: 200px;
  }
  span {
    line-height: 16px;
    max-width: 85%;
    float: left;

  }
  em {
    color: #0C6FFF;
    font-style: normal;
    margin-left: 10px;
    line-height: 16px;
    font-size: 12px;
    cursor: pointer;
    float: right;
  }
}
.title-input-row {
  float: left;
  width: 330px;
  padding-bottom: 15px;
  margin-top: -10px;
  ::v-deep .el-input {
    width: 250px;
    height: 20px;
    float: left;
    margin-right: 15px;
  }
}

}
</style>


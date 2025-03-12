<template>
  <!-- 生成视频弹框 -->
  <AppDialog
    v-model="config.visible"
    title="一键生成视频"
    width="1063px"
    height="600px"
    top="10vh"
    :loading="config.loading"
  >
    <div v-loading="config.loading" class="ele-tabs-wrap">
      <div>请选择要生成的视频</div>
      <div class="overflowOuto" style="height: 554px">
        <div
          v-for="(item, index) in oneVideoData.multiCameraList"
          :key="item.multiCameraGroupId"
          style="margin-top: 16px"
        >
          <div>
            <span class="camera_name">{{ item.caremaName }}</span>
            <span><el-checkbox v-model="item.checkAll" :indeterminate="item.indeterminate" @change="handleCheckAll(index)">全选</el-checkbox></span>
          </div>
          <div class="flex my-video-list overflowOuto">
            <div v-for="(ele,ind) in item.videoDetailReqList" :key="ind" class="video-item">
              <div class="image">
                <el-image
                  fit="cover"
                  style="height: 130px; width: 100%; border-radius: 4px"
                  :src="
                    ele.posterUrl && ele.posterUrl.indexOf('http') >= 0
                      ? ele.posterUrl
                      : getHuoshanPosterUrl(ele.posterUrl)
                  "
                />
                <img
                  src="@/assets/image/icon_bofang.png"
                  class="icon cursor-pointer"
                  @click="handleClickPlay(ele)"
                />
                <div class="tips flex items-center flex-between">
                  <span class="text_hidden_1">{{ ele.name }}</span>
                  <el-checkbox v-model="ele.checked" @change="handleCheck" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div slot="footer" class="flex flex-between flex-middle my_footer">
      <div class="m-l-20">已选择【{{ totalNum }}】个视频</div>
      <div>
        <div slot="footer" class="ss-material-box-bottom">
          <el-button
            size="small"
            :loading="config.loading"
            @click="$emit('close')"
          >取消</el-button>
          <el-button
            size="small"
            :loading="config.loading"
            type="primary"
            @click="succese()"
          >确定</el-button>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getHuoshanPosterUrl } from '@/utils/index'
import AppVideo from '@/components/AppVideo'
// import videoplayer from '@/components/videoplayer/index.js'
export default {
  components: {
    AppDialog
  },

  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    },
    oneVideoData: {
      type: Object,
      default: () => {}
    },
    success: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      getHuoshanPosterUrl,
      totalNum: 0
    }
  },
  watch: {
  },
  mounted() {

  },
  methods: {
    // 全选
    handleCheckAll(index) {
      this.oneVideoData.multiCameraList[index].videoDetailReqList.forEach(item => {
        item.checked = this.oneVideoData.multiCameraList[index].checkAll
      })
      this.$forceUpdate()
      this.calculateNum()
    },
    // 播放
    handleClickPlay(data) {
      console.log(data.videoUrl, '打开的url')
      AppVideo.play({
        url: data.videoUrl,
        videoName: data.name
      })
    },
    handleCheck() {
      // 点击之后去判断是否全选 或者半选状态是不是true 同时也要计算总共选中的视频数量
      // 通过判断this.oneVideoData.multiCameraList里面的videoDetailReqList里面的checked是否全部为true来判断全选
      this.oneVideoData.multiCameraList.forEach(item => {
        item.indeterminate = item.videoDetailReqList.some(ele => ele.checked)
        item.checkAll = item.videoDetailReqList.every(ele => ele.checked)
        if (item.checkAll) item.indeterminate = false
      })
      this.calculateNum()
    },
    calculateNum() {
      let num = 0
      this.oneVideoData.multiCameraList.forEach(item => {
        item.videoDetailReqList.forEach(ele => {
          if (ele.checked) {
            num++
          }
        })
      })
      this.totalNum = num
    },
    // 一键生成
    async succese() {
      // 获取所有this.oneVideoData.multiCameraList里面videoDetailReqList里面checked为true的数据
      const videoList = []
      this.oneVideoData.multiCameraList.forEach(item => {
        item.videoDetailReqList.forEach(ele => {
          if (ele.checked) {
            videoList.push(ele)
          }
        })
      })
      if (videoList.length === 0) {
        this.$message.error('请选择要生成的视频')
        return
      }
      this.$emit('success', videoList, this.oneVideoData.desensitizedProjectId)
    }
  }
}
</script>

  <style lang='scss' scoped>
.my_footer {
  border-top: 1px solid #ebeef5;
}
.camera_name {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  margin-right: 16px;
}
.my-video-list{
  border-bottom: 1px solid #e7e7e7;

}
.video-item {
  margin-top: 16px;
  margin-right: 16px;
}
.image {
  width: 230px;
  position: relative;
  margin-bottom: 16px;
  border: 1px solid #eff2f6;
  padding: 8px;
  box-sizing: border-box;
  .untmshare {
    border-radius: 6px 0 6px 0;
    color: #ff7d00;
    background: #fff2e6;
  }
  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    z-index: 2;
    color: #fff;
  }
  .tips {
    width: 100%;
    color: #fff;
    span {
      color: #333333;
      font-size: 14px;
    }
  }
}
.ele-tabs-wrap {
  padding: 20px;
  .ele-tabs-wrap-title {
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 26px;
    margin-bottom: 30px;
  }
  .ele-tabs-wrap-form {
    display: flex;
    flex-wrap: wrap;
    .ele-tabs-wrap-form-flex {
      flex: 50% 0 0;
      display: flex;
      align-items: center;
      margin-bottom: 32px;
      > div:first-child {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
      }
      > div:last-child {
        margin-left: 8px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
      }
    }
    .flex-last {
      flex: 100% 0 0;
    }
  }
}
</style>

<template>
  <div class="train-video-wrapper">
    <div style="display: flex; align-items: center" @click="drawer = true">
      <img class="train-video-img" src="@/assets/image/trainVideo.png" alt="" />
      <span class="train-video-text">培训</span>
    </div>
    <el-drawer
      title="伏羲云培训视频"
      :visible.sync="drawer"
      append-to-body
      :before-close="beforeClose"
      custom-class="train-video"
    >
      <div style="padding: 0 20px">
        <el-row
          style="margin-bottom: 15px; padding-right: 14px"
          type="flex"
          justify="space-between"
        >
          <el-col :span="20">
            <el-input
              v-model="value"
              clearable
              placeholder="输入视频名称搜索"
              @clear="search"
            />
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="search">搜索</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="4">
          <el-col v-for="(item, index) in list" :key="index" :span="8">
            <div class="img-for-cls" @click="toShowVideo(item)">
              <img :src="item.posterUrl" />
              <i class="el-icon-video-play" />
            </div>
            <div class="video-name text_hidden_1">
              <textShowMore :text="item.videoName" :line-clamp="1" />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import textShowMore from '@/components/textShowMore/index2.vue'
import { getTrainingVideoMineList } from '@/api/trainingVideo'
export default {
  components: {
    textShowMore
  },
  data() {
    return {
      drawer: false,
      list: [],
      oldList: [],
      value: ''
    }
  },
  watch: {
    drawer(val) {
      if (val) {
        this.getList()
      }
    }
  },
  methods: {
    search() {
      this.list = this.oldList.filter(
        item => item.videoName.indexOf(this.value) > -1
      )
    },
    getList() {
      getTrainingVideoMineList().then(res => {
        if (res.code === 1) {
          this.list = res.data
          this.oldList = res.data
        }
      })
    },
    toShowVideo(record) {
      this.$Videoplayer({
        src: record.videoUrl,
        videoName: record.videoName
      })
    },
    beforeClose() {
      this.drawer = false
    }
  }
}
</script>
<style lang="scss" scoped>
.train-video-wrapper {
  display: inline-block;
  padding: 0 16px;
  height: 100%;
  vertical-align: text-bottom;
  &:hover {
    cursor: pointer;
  }
}
.train-video-text {
  margin-left: 8px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
.train-video-img {
  width: 20px;
  height: 20px;
  display: inline-block;
}
.img-for-cls {
  position: relative;
  text-align: center;
  cursor: pointer;
  width: 172px;
  height: 129px;
  background: rgb(0, 0, 0, 0.75);
  border-radius: 6px;
  img {
    position: absolute;
    max-width: 172px;
    max-height: 129px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  i {
    position: absolute;
    z-index: 11;
    top: 50%;
    left: 50%;
    font-size: 30px;
    margin: -10px 0 0 -10px;
    border-radius: 100%;
    color: #fff;
  }
}
.video-name {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin: 10px 0;
  width: 100%;
}
::v-deep .train-video {
  width: 596px !important;

  .el-drawer__body {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #d8d8d8;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
    }
  }
  .el-drawer__header {
    border: 1px solid #eff2f6;
    padding: 20px 20px 10px 20px;
    justify-content: space-between;
    span {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
  }
}
</style>

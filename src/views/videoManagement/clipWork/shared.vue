<template>
  <div v-loading="loadingData" class="pageWrap">
    <div class="projectDetail">
      <div v-if="videoObject === null || JSON.stringify(videoObject) == '{}'" class="pd-nodata">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
        <div class="m-t-10 noDataText">暂无共享工程内容</div>
      </div>
      <div v-else class="projectDetailForm overflowOuto">
        <div class="p-l-r-16 detailTitle">共享给我</div>
        <div class="detailForm">
          <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">工程名称：</div>
              <div class="form_item_value">{{ videoObject.projectName }}</div>
            </div>
            <div class="form_item">
              <div class="form_item_label">共享时间：</div>
              <div class="form_item_value">{{ DateFormat(new Date(videoObject.createTime),'yyyy-MM-dd hh:mm:ss') }}</div>
            </div>
            <div class="form_item">
              <div class="form_item_label">共享人：</div>
              <div class="form_item_value">{{ videoObject.shareUserName }}</div>
            </div>
          </div>

          <MTitle title="脱敏视频信息" class="m-t-32 m-b-12" />

          <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">视频类型：</div>
              <div class="form_item_value">{{ videoObject.videoTypeDesc }}</div>
            </div>
            <div class="form_item">
              <div class="form_item_label">IP：</div>
              <div class="form_item_value">{{ videoObject.teacherName }}</div>
            </div>
          </div>

          <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">交付场景：</div>
              <div class="form_item_value">{{ videoObject.sceneName }}</div>
            </div>
          </div>

          <!-- <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">关联选题计划：</div>
              <div class="form_item_value">{{ videoObject.planName }}</div>
            </div>
          </div> -->

          <div class="detailFormTilte">
            <MTitle title="脱敏视频列表" class="m-t-32" />
            <div>
              <el-button size="small" @click="checkSemiDetail">查看脱敏详情</el-button>
              <el-button type="primary" size="small" @click="scproject">生成自己的专属工程</el-button>
            </div>
          </div>

          <div class="detailVideoList m-t-20">
            <template v-for="(item, index) in videoList">
              <videoListView
                :key="index"
                class="videoListView"
                :name="item.name"
                :version="item.version"
                :video-create-time="item.videoCreateTime"
                :poster-url="item.posterUrl"
                :size="item.size"
                :duration="item.duration"
                :url="item.videoUrl"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videoListView from './components/videoListView.vue'
import { getSharedDetail, setShareGenrate } from '@/api/videoManagement/clipWork'
import { DateFormat } from '@/utils/index'
export default {
  components: {
    videoListView
  },
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loadingData: false,
      videoObject: {},
      form: {},
      // 脱敏视频列表
      videoList: [
      ]
    }
  },
  mounted() {
  },
  methods: {
    DateFormat,
    loadData(projectId) {
      this.loadingData = true
      if (projectId === '') {
        this.loadingData = false
        return false
      }
      getSharedDetail(projectId).then(res => {
        if (res.success) {
          this.loadingData = false
          this.videoObject = res.data
          this.videoObject.createTime = DateFormat(new Date(res.data.createTime), 'yyyy-MM-dd hh:mm:ss')
          this.videoList = res.data.videos
        }
      })
    },
    checkSemiDetail() {
      // this.$router.push(`/subtitleEditor/1584496538720145408?videoGroupName=范德萨发的`)
      // 1584496538720145408
      const toTaskLog = this.$router.resolve({ path: `/showSemiVideoDetail/${this.projectId}?videoType=1&videoGroupName=${this.videoObject.projectName}` })
      window.open(toTaskLog.href, '_blank')
    },
    scproject() {
      const params = {
        projectId: this.videoObject.projectId,
        teacherId: this.videoObject.teacherId
      }
      console.log('$$$$$$$$:', params)
      setShareGenrate(params).then(res => {
        console.log(res)
        if (res.success) {
          this.$confirm('专属工程已生成！', '成功提示', {
            distinguishCancelAndClose: true,
            closeOnClickModal: false,
            confirmButtonText: '在线剪辑',
            cancelButtonText: '确认',
            type: 'success',
            center: true
          }).then(() => {
            const toTaskLog = this.$router.resolve({ path: `/videoEditor?projectId=${res.data}` })
            window.open(toTaskLog.href, '_blank')
          }).catch(action => {
            if (action === 'cancel') {
              this.$emit('handerTab', 'ClipWorkMyProject')
            }

            /* this.$message({
              type: 'info',
              message: '已取消删除'
            }) */
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  .projectDetail {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    .projectDetailForm {
      flex: 1 0 0;
      overflow: auto;
      .detailTitle {
        margin-top: 20px;
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        line-height: 28px;
      }
      .detailForm {
        margin-top: 16px;
        padding-left: 16px;
        padding-right: 16px;
        .form_item {
          display: flex;
          align-items: center;
          .form_item_label {
            width: 128px;
            text-align: right;
            margin-right: 8px;
            font-size: 16px;
            font-family: MicrosoftYaHei;
            color: #777777;
            line-height: 24px;
          }
          .form_item_value {
            width: 240px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 22px;
          }
        }
        .detailFormRow {
          display: flex;
          margin-bottom: 16px;
        }
        .detailFormTilte {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .detailVideoList {
        display: flex;
        flex-wrap: wrap;
        .videoListView {
          flex: 33.33% 0 0;
        }
      }
    }
    .projectDetailFooter {
      height: 72px;
      background: #FFFFFF;
      box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      .btn_del {
        background: #FFFFFF;
        color: #F53F3F;
        border-radius: 4px;
        border: 1px solid #F98B8B;
      }
    }
  }
}
.p-l-r-16 {
  padding-left: 16px;
  padding-right: 16px;
}
.m-t-32 {
  margin-top: 32px;
}
.m-b-12 {
  margin-bottom: 12px;
}
.pd-nodata {
  width: 100%;
  margin: 230px auto 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > img {
    width: 405px;
  }
  > .noDataText {
    margin-top: 10px;
    font-size: 14px;
    color: #919293;
    line-height: 26px;
  }
}
</style>

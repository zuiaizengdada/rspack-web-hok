<template>
  <div v-loading="loadingData" class="pageWrap">
    <div class="projectDetail">
      <div v-if="videoObject && !videoObject.projectName" class="pd-nodata">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
        <div class="m-t-10 noDataText">暂无共享工程内容</div>
      </div>
      <div v-else class="projectDetailForm overflowOuto">
        <div class="p-l-r-16 detailTitle">共享给我</div>
        <div class="detailForm">
          <div class="detailFormRow m-r-16 m-l-16">
            <div class="form_item">
              <div class="form_item_label">工程名称：</div>
              <div class="form_item_value">{{ videoObject.projectName }}</div>
            </div>
            <div class="form_item">
              <div class="form_item_label">共享时间：</div>
              <div class="form_item_value">
                {{
                  DateFormat(
                    new Date(videoObject.createTime),
                    'yyyy-MM-dd hh:mm:ss'
                  )
                }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">共享人：</div>
              <div class="form_item_value">{{ videoObject.shareUserName }}</div>
            </div>
          </div>

          <MTitle title="脱敏视频信息" class="m-t-16 m-b-12 p-l-16 p-r-16" />

          <div class="detailFormRow m-r-16 m-l-16">
            <div class="form_item">
              <div class="form_item_label">视频类型：</div>
              <div class="form_item_value">{{ videoObject.videoTypeDesc }}</div>
            </div>
            <div class="form_item">
              <div class="form_item_label">IP：</div>
              <div class="form_item_value">
                {{ videoObject.teacherName || '--' }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">交付场景：</div>
              <div class="form_item_value">
                {{ videoObject.sceneName || '--' }}
              </div>
            </div>
          </div>

          <div class="detailFormRow m-r-16 m-l-16">
            <!-- <div class="form_item">
              <div class="form_item_label">关联选题计划：</div>
              <div class="form_item_value">{{ videoObject.planName }}</div>
            </div> -->
            <div class="form_item">
              <div class="form_item_label">视频组创建者：</div>
              <div class="form_item_value">
                {{ videoObject.createUserName }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">视频组名称：</div>
              <div class="form_item_value">
                {{ videoObject.videoGroupName }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">视频总时长：</div>
              <div class="form_item_value">
                {{
                  videoObject && secondIsLiveDuration(videoObject.totalDuration)
                }}
              </div>
            </div>
          </div>
          <div class="detailFormRow m-r-16 m-l-16">
            <div class="form_item">
              <div class="form_item_label">视频组类型：</div>
              <div class="form_item_value">
                {{
                  videoObject && videoObject.type === 2
                    ? '多机位视频组'
                    : '单机位视频组'
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="detailFormTilte p-l-16 p-r-16">
          <MTitle :title="tmsplb" />
          <div>
            <el-button size="small" @click="checkSemiDetail"
              >查看脱敏详情</el-button
            >
            <el-button type="primary" size="small" @click="scproject"
              >生成自己的专属工程</el-button
            >
            <el-button size="small" type="danger" plain @click="removeShare"
              >移除共享工程</el-button
            >
          </div>
        </div>
        <div class="detailVideoList m-t-20 p-l-16 p-r-16">
          <template v-for="(item, index) in videoList">
            <videoListView
              :key="index"
              class="videoListView"
              :name="item.name"
              :carema-type="videoObject.type"
              :version="item.version"
              :video-create-time="item.videoCreateTime"
              :poster-url="item.posterUrl"
              :data="item"
              :size="item.size"
              :duration="item.duration"
              :url="item.videoUrl"
              :video-type="2"
              :project-video-id="item.projectVideoId"
            />
          </template>
        </div>
      </div>
      <shadow v-if="videoObject.projectId" />
    </div>
    <el-dialog
      class="dialog-mask"
      width="500px"
      :visible.sync="updateQryGroupFlag"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <p class="title-p"><i class="icn_checked" /> 专属工程已生成！</p>
      <el-form :model="videoGroupForm">
        <el-form-item label="设置分组：" :label-width="formLabelWidth">
          <el-cascader
            v-model="videoGroupForm.groupId"
            class="cascader-s"
            :options="options"
            :props="{ checkStrictly: true }"
            clearable
            @change="handlerGroup"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sureTosc(1)">确定</el-button>
        <el-button
          v-permission="['web:clipWork:editing', permsList]"
          type="primary"
          @click="sureTosc(2)"
          >在线剪辑</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import videoListView from './components/videoListView.vue'
import {
  getSharedDetail,
  setShareGenrate,
  searchQryGroup,
  updateGroup,
  hideProject,
  checkGenerateProject
} from '@/api/videoManagement/clipWork'
import { DateFormat, secondIsLiveDuration } from '@/utils/index'
import { userCloudPc } from '@/api/videoManagement/cloudDesktop'
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
      videoGroupForm: {},
      formLabelWidth: '80px',
      updateQryGroupFlag: false,
      loadingData: false,
      videoObject: {},
      form: {},
      // 脱敏视频列表
      videoList: [],
      options: [],
      toOnlineCheck: '',
      tmsplb: '',
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {},
  methods: {
    secondIsLiveDuration,
    sureTosc(type) {
      const params = {
        projectId: this.toOnlineCheck,
        groupId:
          this.videoGroupForm.groupId && this.videoGroupForm.groupId.length > 0
            ? this.videoGroupForm.groupId[
                this.videoGroupForm.groupId.length - 1
              ]
            : 0,
        type: 2
      }
      updateGroup(params).then(async res => {
        if (res.success) {
          // this.$message.success('分组设置成功！')
          this.updateQryGroupFlag = false
          if (type === 1) {
            // this.$emit('handerTab', 'ClipWorkMyProject')
            this.$message.success('专属工程已生成！')
            this.updateQryGroupFlag = false
          } else if (type === 2) {
            this.$router.push({
              path: `/videoEditor?projectId=${this.toOnlineCheck}&type=3`
            }) 
            // const res = await userCloudPc()
            // const ecsStatus = res.data?.ecsStatus
            // if (ecsStatus) {
            //   // 检测是否是否需要同步数据且今天已经同步过了
            //   const syncRes = await this.$store.dispatch('videoManage/syncCheck', {
            //     btnText: '继续使用',
            //     projectId: this.toOnlineCheck,
            //     type: 3
            //   })
            //   if (syncRes) {
            //     this.$router.push({
            //       path: `/videoEditor?projectId=${this.toOnlineCheck}&type=3`
            //     })
            //   }
            // } else {
            //   this.$message.error('你还未创建云桌面，无法使用在线剪辑操作。请联系IT开通云桌面。')
            // }
          }
        }
      })
    },
    // 移除共享工程
    removeShare() {
      this.$confirm('是否确认移除共享工程？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          // this.$emit('removeProject')
          const params = {
            projectId: this.projectId
          }
          hideProject(params).then(res => {
            if (res.success) {
              this.$emit('removeProject')
              this.$message.success('移除成功！')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除'
          })
        })
    },
    handlerGroup(val) {},
    loadGroupData() {
      searchQryGroup().then(res => {
        this.options = res.data
        this.changeData(this.options)
      })
    },
    changeData(array) {
      array.some(item => {
        item.value = item.groupId
        item.label = item.groupName
        if (item.childrenList && item.childrenList.length > 0) {
          item.children = item.childrenList
        }

        if (item.children && item.children.length > 0) {
          this.changeData(item.children)
        }
      })
    },
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
          this.videoList = res.data.videos
          this.tmsplb = '脱敏视频列表(' + this.videoList.length + ')'
        }
      })
    },
    checkSemiDetail() {
      // this.$router.push(`/subtitleEditor/1584496538720145408?videoGroupName=范德萨发的`)
      // 1584496538720145408
      this.$uweb && this.$uweb.setAction('Event_clipWork_detail')
      const res = this.videoList.every(item => {
        return item.isEmptyMirror === 1
      })
      if (res) {
        this.$message.error('视频列表均为空镜素材，无脱敏内容')
      } else {
        const toTaskLog = this.$router.resolve({
          path: `/showSemiVideoDetail/${this.projectId}?videoType=1&videoGroupName=${this.videoObject.projectName}`
        })
        window.open(toTaskLog.href, '_blank')
      }
    },
    teacherNameFormatTips(row) {
      let txt = `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">工程重复生成提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">`
      if (row.teacherName) {
        txt += `【${row.teacherName}】的`
      }
      return `${txt}【${row.projectName}】已存在，是否继续生成？</div><div style="margin-top: 16px;color: #999;line-height: 22px;font-size: 12px;">如果继续，将会生成多份相同工程，请做好工程管理，避免混乱。</div>`
    },
    async scproject() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'operationOnlineClip'
      )
      if (!res) {
        this.$uweb && this.$uweb.setAction('Event_clipWork_create')
        this.loadGroupData()
        const searchParam = {
          projectId: this.videoObject.projectId,
          type: 2
        }
        checkGenerateProject(searchParam).then(res => {
          console.log('reeeessss:', res)
          if (res.code === 1 && !res.data) {
            this.$delModal({
              width: '505px',
              tips: this.teacherNameFormatTips(this.videoObject),
              success: () => {
                const params = {
                  projectId: this.videoObject.projectId,
                  teacherId: this.videoObject.teacherId
                }
                setShareGenrate(params).then(res => {
                  if (res.success) {
                    this.updateQryGroupFlag = true
                    this.toOnlineCheck = res.data
                  }
                })
              }
            })
          } else {
            const params = {
              projectId: this.videoObject.projectId,
              teacherId: this.videoObject.teacherId
            }
            setShareGenrate(params).then(res => {
              if (res.success) {
                this.updateQryGroupFlag = true
                this.toOnlineCheck = res.data
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  // width: 100%;
  width: calc(100% - 16px);
  height: 100%;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  .projectDetail {
    width: 100%;
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    position: relative;
    .projectDetailForm {
      position: relative;
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
        padding-top: 16px;
        // padding-left: 16px;
        // padding-right: 16px;
        position: relative;
        background: #fff;
        z-index: 2;
        .form_item {
          display: flex;
          flex: 1 0 0;
          // align-items: center;
          .form_item_label {
            width: 128px;
            text-align: right;
            margin-right: 8px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #777777;
            line-height: 24px;
          }
          .form_item_value {
            // width: 165px;
            flex: 1;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 24px;
          }
        }
        .detailFormRow {
          display: flex;
          padding-bottom: 16px;
        }
      }
      .detailFormTilte {
        position: sticky;
        top: 0;
        height: 63px;
        padding-top: 20px;
        padding-bottom: 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        z-index: 10;
        // box-shadow: 0px 3px 14px 2px rgba(0,0,0,0.05), 0px 8px 10px 1px rgba(0,0,0,0.06), 0px 5px 5px -3px rgba(0,0,0,0.1);
      }
      .detailVideoList {
        display: flex;
        flex-wrap: wrap;
        .videoListView {
          width: 283px;
          // flex: 246px 0 0;
        }
      }
    }
    .projectDetailFooter {
      height: 72px;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      .btn_del {
        background: #ffffff;
        color: #f53f3f;
        border-radius: 4px;
        border: 1px solid #f98b8b;
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
.m-r-16 {
  margin-right: 16px;
}
.m-l-16 {
  margin-left: 16px;
}
.p-l-16 {
  padding-left: 16px;
}
.p-r-16 {
  padding-right: 16px;
}
shadow {
  // box-shadow: 0px 3px 14px 2px rgb(0 0 0 / 5%), 0px 8px 10px 1px rgb(0 0 0 / 6%), 0px 5px 5px -3px rgb(0 0 0 / 10%);
  height: 10px;
  position: absolute;
  width: 100%;
  top: 53px;
  box-shadow: 0px 3px 14px 2px rgba(0, 0, 0, 0.05),
    0px 8px 10px 1px rgba(0, 0, 0, 0.06), 0px 5px 5px -3px rgba(0, 0, 0, 0.1);
  // background: red;
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
.title-p {
  width: 100%;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  font-weight: bold;
  color: #00b42a;
  margin-top: -25px;
  margin-bottom: 25px;
  .icn_checked {
    float: left;
    width: 18px;
    height: 18px;
    margin-top: 8px;
    margin-right: 8px;
    background-image: url(../../../assets/image/video/icn_checked.png);
    background-size: 100%;
  }
}

.dialog-mask {
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
}
::v-deep .el-dialog__wrapper {
  display: flex;
  padding: 24px;
  .el-dialog {
    margin: auto !important;
  }
}

.cascader-s {
  width: 370px;
}
</style>

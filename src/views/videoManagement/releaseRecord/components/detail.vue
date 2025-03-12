<template>
  <el-drawer :visible.sync="visibleDrawer" :show-close="false" @close="closeDetail">
    <div slot="title">
      <slot name="title">
        <div>
          <p class="title-p">发布详情<em class="el-icon-close" @click="closeDetail" /></p>
          <span class="title-span">{{ dataObj.title }}</span>
        </div>
      </slot>
    </div>
    <div v-loading="loading" class="drawer-content" element-loading-text="加载中">
      <div class="fb-list">
        <div v-for="item in detailList" :key="item.platformAccountId" class="fb-list-row relative">
          <div class="left-img">
            <img class="icm-tx" :src="item.avatar" />
            <img class="icm-pt" :src="item.platformIcon" />
          </div>
          <div class="right-data">
            <span class="right-data-title">
              <p>{{ item.name }}</p>
              <em v-if="item.openUrl" @click="toShowSuccess(item.openUrl)">查看</em>
            </span>
            <div class="right-success-type">
              <span v-if="item.showStatus === 5" class="jichu-data success-data">
                <img src="../../../../assets/image/account/icn_checked.png" />
                <p>平台发布成功</p>
              </span>
              <span v-if="item.showStatus === 3" class="jichu-data timing-data">
                <img src="../../../../assets/image/account/icn_time.png" />
                <p>平台审核中</p>
              </span>
              <span v-if="item.showStatus === 7" class="jichu-data error-data">
                <img src="../../../../assets/image/account/icn_error.png" />
                <p>平台发布失败</p>
              </span>
              <span v-if="item.showStatus === 8" class="jichu-data re-data">
                <img src="../../../../assets/image/account/icn_re.png" />
                <p>平台重新发布成功</p>
              </span>
              <span v-if="item.showStatus === 4" class="jichu-data chuli-data">
                <img src="../../../../assets/image/account/icn_card.png" />
                <p>平台处理中</p>
              </span>
              <span v-if="item.showStatus === 6" class="jichu-data dingshi-data">
                <img src="../../../../assets/image/account/icn_publish.png" />
                <p>平台定时发布</p>
              </span>
              <span v-if="item.showStatus === 1" class="jichu-data tongbu-data">
                <img src="../../../../assets/image/account/icn_refresh.png" />
                <p>同步至平台中</p>
              </span>
              <span v-if="item.showStatus === 2" class="jichu-data error-data">
                <img src="../../../../assets/image/account/icn_error.png" />
                <p>同步至平台失败</p>
              </span>
              <span v-if="item.showStatus === 1 || item.showStatus === 3 || item.showStatus === 6 || item.showStatus === 4">{{ item.createTime }}</span>
              <span v-if="item.showStatus === 2 || item.showStatus === 7">{{ item.failTime }}</span>
              <span v-if="item.showStatus === 5 || item.showStatus === 8">{{ item.publishTime }}</span>
            </div>
            <div v-if="item.showStatus === 6" class="right-data-ting">
              <span class="jichu-data">
                定时发布时间：
              </span>
              <span>{{ item.timingTime }}</span>
            </div>
            <div v-if="item.showStatus === 7" class="right-data-ting cls-red">
              <span>原因：{{ item. resultDesc }}</span>
            </div>
            <div v-if="item.showStatus === 2" class="right-data-ting">
              <span>原因：{{ item. resultDesc }}</span>
            </div>
            <div v-if="item.showStatus === 1" class="right-data-ting">
              <div style="width: 100%">
                <el-progress :percentage="item.progress" />
              </div>
              <span v-if="item.progressDesc">{{ item.progressDesc }}</span>
            </div>
          </div>
          <span v-show="visibleDeleteRecord(item)" class="delete-btn absolute" @click="handleClickDeleteItem(item)">删除记录</span>
        </div>
      </div>
      <div v-if="dataObj.showCf" class="drawer-con-data">
        <el-button type="primary" @click="rePublish(dataObj)">重新发布失败任务</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { getReleaseRecordDetail, delTaskRecord } from '@/api/videoManagement/accountManage'
import { mixinsSyncData } from './checkReloadData'
import moment from 'moment'
export default {
  components: { },
  mixins: [mixinsSyncData],
  props: {
  },
  data() {
    return {
      visibleDrawer: false,
      dataObj: {},
      detailList: [],
      timer: '',
      socket: '',
      taskId: '',
      loading: false
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
  },
  created() {

  },
  destroyed() {
    // clearTimeout(this.timer)
  },
  methods: {
    closeDetail() {
      this.visibleDrawer = false
      this.$emit('loadData')
      clearTimeout(this.timer)
      this.timer = null
    },
    loadData(row) {
      if (!row || !row.taskId) return
      const params = {
        taskId: row?.taskId
      }
      this.taskId = String(row.taskId)
      getReleaseRecordDetail(params).then(res => {
        if (res.success) {
          console.log(res.data, 'res.data')
          row.arr = res.data
          this.detailList = res.data
          this.dataObj = row
          this.dataObj.showCf = false
          // 如果有publishId 且stauts为-11的时候就去automaticSync
          this.dataObj.arr.forEach(item => {
            if (item.status === -11 && item.publishId) {
              this.automaticSync(item.taskId)
            }
          })
          // 如果所有的status都是0的时候刷新父级数据
          const isAllZero = this.dataObj.arr.every(item => {
            return item.status === 0
          })
          if (isAllZero) {
            this.$emit('loadData')
          }
          this.dataObj.arr?.some(item => {
            if (item.status === -12 || item.status === 2 || item.status === 8 || item.status === 12) {
              this.dataObj.showCf = true
              this.$forceUpdate()
            }
          })
        }
      })
    },
    rePublish(item) {
      this.$uweb && this.$uweb.setAction('Event_videoRelease_videoErrorClick')
      this.$router.push({
        path: '/videoManagement/videoPublish?type=record&finishVideoId=' + item.finishVideoId + '&taskId=' + item.taskId,
        query: {
          prevPath: this.$route.path
        }
      })
    },
    show(obj) {
      const that = this
      this.timer = setInterval(() => {
        if (that.dataObj.taskId) {
          that.loadData(that.dataObj)
        }
      }, 5000)
      this.detailList = []
      this.loading = true
      this.visibleDrawer = true
      const params = {
        taskId: obj.taskId
      }
      getReleaseRecordDetail(params).then(res => {
        if (res.success) {
          obj.arr = res.data
          this.detailList = res.data
          this.dataObj = obj
          console.log(this.dataObj, 'this.dataObj')
          this.dataObj.showCf = false
          this.dataObj.arr?.some(item => {
            if (item.status === 12 || item.status === 2 || item.status === 8 || item.status === -12) {
              this.dataObj.showCf = true
              this.$forceUpdate()
            }
          })
          this.loading = false
        }
      })
      this.automaticSync(obj.taskId)
    },
    toShowSuccess(url) {
      this.$uweb && this.$uweb.setAction('Event_videoRelease_videoSuccessClick')
      window.open(url, '_blank')
    },
    // 是否显示删除纪录按钮
    visibleDeleteRecord(data) {
      // 发布状态为1 发布中以及 发布时间大于当前时间2小时，显示删除按钮
      const time = moment(data.createTime).add(2, 'hour')
      const ss = moment(time).format('x')
      const currentSS = moment(new Date()).format('x')
      const isOver2Hour = currentSS > ss

      let visibleDeleteBtn = false
      if (data.showStatus === 1) {
        if (isOver2Hour) {
          visibleDeleteBtn = true
        }
      } else if (data.showStatus === 2) {
        visibleDeleteBtn = true
      } else if (data.showStatus === 7) {
        visibleDeleteBtn = true
      }
      return visibleDeleteBtn
    },
    // 删除发布纪录
    async handleClickDeleteItem(data) {
      this.$confirm('您确定要删除该记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delTaskRecord(String(data.taskRecordId))
        this.updatePublishTaskRecordList(data.taskId)
        this.$message.success('删除成功')
      })
    },
    // 更新发布记录
    async updatePublishTaskRecordList(taskId) {
      const res = await getReleaseRecordDetail({ taskId: String(taskId) })
      this.detailList = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer.rtl{
    width: 520px!important;
}
::v-deep .el-dialog__close{
    color:#000;
}
::v-deep .el-drawer__header{
    padding:22px 20px;
    margin-bottom:0;
    line-height: 1;
    border-bottom:1px solid #E7E7E7;
    span{
    color:#333;
    font-weight: bold;
    font-size:16px;
    }
}
::v-deep .el-drawer__body {
    padding-top: 0px!important;
    padding-bottom: 64px!important;
}
::v-deep .has-gutter .el-table__cell{
    background: rgb(245, 245, 245);
    line-height: 1;
    border-radius: 6px;;
    border-bottom:none!important;
    .cell{
    line-height: 1;
    padding:0 20px;
    }
}
::v-deep .el-drawer__body{
    padding-top:18px;
}

::v-deep .el-table__body,::v-deep .el-table__header{
    width:auto!important
}

::v-deep .el-table {
    height: calc(100% - 100px);
    overflow-y: auto;
}

::v-deep .has-gutter .el-table__cell .cell {
    padding: 0;
    padding-left: 3px;
}

.use-list {
    padding-left: 17px;
    margin-bottom: 15px;
}
.page-block {
    text-align: right;
    padding-top: 15px;
}

.title-p {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    height: 20px;
    line-height: 20px;
    em {
        font-size: 18px;
        font-weight: bold;
        float: right;
        cursor: pointer;
    }
}
.title-span {
    display: inline-block;
    font-size: 16px;
    color: #333;
    margin-top: 5px;
    line-height: 22px;
    font-weight: normal!important;
}
.drawer-content {
    width: 100%;
    height: 100%;
    position: relative;
    padding-bottom: 64px;
    overflow-y: auto;
    .fb-list {
        width: 100%;
        padding: 0 20px;
        padding-top: 10px;
        .fb-list-row {
            width: 100%;
            float: left;
            margin-bottom: 8px;
            .left-img {
                float: left;
                width: 52px;
                height: 52px;
                position: relative;
                .icm-tx {
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;
                }
                .icm-pt {
                    position:absolute;
                    width: 24px;
                    height: 24px;
                    bottom: 0px;
                    right: 0px;
                    border-radius: 100%;
                    box-shadow: 0px 1px 4px 0px rgba(237,93,134,0.4);
                    border: 1px solid #FFFFFF;
                }
            }
            .right-data {
                float: right;
                width: 395px;
                padding-bottom: 10px;
                border-bottom: 1px solid #E7E7E7;
                .right-data-title {
                    float: left;
                    width: 100%;
                    height: 26px;
                    position: relative;
                    p {
                        width: 100%;
                        padding-right: 40px;
                        font-size: 16px;
                        color: #333;
                        line-height: 26px;
                        height: 26px;
                        overflow: hidden;
                    }
                    em {
                        position: absolute;
                        font-size: 14px;
                        line-height: 26px;
                        color: #0C6FFF;
                        height: 26px;
                        width: 40px;
                        text-align: right;
                        right: 0px;
                        top: 0px;
                        font-style: normal;
                        cursor: pointer;
                    }
                }
                .right-success-type {
                    margin-top: 5px;
                    width: 100%;
                    height: 24px;
                    line-height: 24px;
                    span {
                        float: left;
                        font-size: 14px;
                        color: #777;
                        margin-right: 15px;
                    }
                    .jichu-data {
                      img {
                        float: left;
                        width: 14px;
                        height: 14px;
                        margin-top: 5px;
                        margin-right: 5px;
                      }
                      p {
                        float: left;
                      }
                    }
                    .success-data {
                        p {
                            float: left;
                        }
                        color: #00B42A;
                    }
                    .timing-data {
                      p {
                        color: #FF7D00;
                      }
                    }
                    .error-data {
                      p {
                        color: #F53F3F;
                      }
                    }
                    .re-data{
                      p{
                        color: #6C3BB1;
                      }
                    }
                    .chuli-data {
                      p {
                        color: #00BFBB;
                      }
                    }
                    .dingshi-data {
                      p {
                        color:#6E00FB;
                      }
                    }
                    .tongbu-data {
                      p {
                        color: #0C6FFF;
                      }
                    }
                }
                .right-data-ting {
                  float: left;
                  width: 100%;
                  font-size: 12px;
                  color: #333;
                }
                .cls-red {
                  color: #F53F3F;
                }
            }

        }
    }
    .drawer-con-data {
        position: fixed;
        width: 520px;
        height: 64px;
        border-top: 1px solid #E7E7E7;
        text-align: center;
        bottom: 0px;
        background: #fff;
        padding-top: 15px;
    }
}
</style>
<style lang="scss" scoped>
.delete-btn{
  cursor: pointer;
  top:26px;
  right:0;
  cursor: pointer;
  font-size:14px;
  color:#F53F3F;
}
</style>

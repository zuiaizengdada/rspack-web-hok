<template>
  <div class="desensitization-wrapper">
    <div class="bread-row">
      <span @click="backToList">脱敏管理</span>
      <i class="el-icon-arrow-right" @click="backToList" />
      <p>脱敏详情</p>
    </div>
    <div class="desensitization-row">
      <div class="title-row">
        <em />
        <span>基本信息</span>
      </div>
      <div class="desens-content">
        <el-form
          ref="form"
          :model="form"
          label-width="110px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="视频组标题：">
                <span class="tips">{{ form.title }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="ID：">
                <span class="tips">{{ form.code }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间：">
                <span class="tips">{{
                  DateFormat(new Date(form.createTime), 'yyyy-MM-dd hh:mm:ss')
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="创建者：">
                <span class="tips">{{ form.createUserName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="IP：">
                <span class="tips">{{ form.teacherName || '--' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交付场景：">
                <span class="tips">{{ form.sceneName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item label="关联计划：">
                <span class="tips">{{ form.planName }}</span>
              </el-form-item>
            </el-col> -->
            <el-col v-if="form.videoTabRuleReq" :span="8">
              <el-form-item label="静音标记规则：">
                <span
                  class="tips"
                >时长阈值{{
                  form.videoTabRuleReq ? form.videoTabRuleReq.duration : 0
                }}秒，预留间隙{{
                  form.videoTabRuleReq
                    ? form.videoTabRuleReq.reserveInterval
                    : 0
                }}秒</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="视频组类型：">
                <span class="tips">{{ form.type === 2? '多机位视频组':'单机位视频组' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div
      v-if="
        forTm &&
          form.desensitizedVideoList &&
          form.desensitizedVideoList.length > 0
      "
      class="desensitization-row video-line"
    >
      <div class="title-row">
        <em />
        <span>已完成人工脱敏处理视频（{{ form.desensitizedVideoShareTotal }}/{{
          form.desensitizedVideoTotal
        }}）</span>
      </div>
      <div class="desen-content">
        <videoListNormal
          ref="videoListShare"
          :desensflag="true"
          :formtitle="form.title"
          :list-for-data="forTm"
          :listtype="true"
          :groupid="form.videoGroupId"
          :type="form.type"
          :showstatus="true"
          :teacher-name="form.teacherName"
          :teacher-id="form.teacherId"
          :is-uploader-flag="isUploaderFlag"
          @loadingData="loadDetailData"
          @chooseDatas="chooseDataStatus"
        />
      </div>
    </div>
    <div
      v-if="
        forAllVideoArr &&
          form.originalVideoList &&
          form.originalVideoList.length > 0
      "
      class="desensitization-row video-line"
    >
      <div class="title-row">
        <em />
        <span>视频列表（{{ form.originalVideoTotal }}）</span>
      </div>
      <div class="desen-content">
        <videoListNormal
          :desensflag="false"
          :list-for-data="forAllVideoArr"
          :listtype="true"
          :showstatus="false"
          :is-uploader-flag="isUploaderFlag"
          :groupid="form.videoGroupId"
          :teacher-name="form.teacherName"
          :type="form.type"
          :teacher-id="form.teacherId"
          @loadingData="loadDetailData"
          @chooseDatas="chooseDataStatus"
        />
      </div>
    </div>
    <!-- <div v-if="form.videoDetailSuccessReqList && form.videoDetailSuccessReqList.length > 0" class="desensitization-row video-line">
      <div class="title-row">
        <em />
        <span>已完成自动脱敏视频</span>
      </div>
      <div class="desen-content">
        <videoListNormal :desensflag="false" :list-for-data="form.videoDetailSuccessReqList" :listtype="false" :showstatus="false" />
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { desensitizationListDetail } from '@/api/product/videoManager'
import videoListNormal from './components/videoListNormal.vue'
import { DateFormat } from '@/utils/index'
import { getItem } from '@/utils/localStorage'
export default {
  components: {
    videoListNormal
  },
  data() {
    return {
      form: {},
      forTm: [],
      isUploaderFlag: false,
      chooseVideoData: 0,
      cameraData: 0,
      chooseVideoData1: 0,
      cameraData1: 0,
      forAllVideoArr: [],
      /**
       * shoudongFlag 是否手动筛选了
       * zidongFlag 自动刷新页面
       */
      shoudongFlag: 0,
      zidongFlag: 0,
      timer: null,
      isDistribute: false
    }
  },
  watch: {},
  mounted() {
    this.loadDetailData()
  },
  activated() {
    this.loadDetailData()
  },
  created() {
    this.timer = setInterval(() => {
      const params = {
        videoGroupId: this.$route.query.videoGroupId
      }
      desensitizationListDetail(params).then(res => {
        this.form = res.data
        this.chooseDataStatus(this.chooseVideoData, true, this.cameraData)
        this.chooseDataStatus(this.chooseVideoData1, false, this.cameraData1)
        this.isUploaderFlag = this.form.createUserId === this.userInfo.userId
      })
    }, 5000)
    // this.loadDetailData()
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['userInfo'])
  },
  beforeDestroy() {
    // js提供的clearInterval方法用来清除定时器
    clearInterval(this.timer)
  },
  methods: {
    DateFormat,
    backToList() {
      this.$router.push(`/videoDesensitiManage`)
    },
    // 机位筛选
    filterVideoList(videoList, val) {
      if (!val) {
        return videoList
      } else {
        return videoList.filter(item => item.multiCameraGroupId === val)
      }
    },
    // 筛选人工脱敏列表数据
    filterDesensitizedVideoList(type) {
      const arr = []
      const videoList = type === 1 ? [...this.form.desensitizedVideoList] : [...this.form.originalVideoList]
      // 如果this.chooseVideoData是1 就筛选item.isShare的数据 如果是2就筛选!item.isShare的数据 同时this.cameraData有值要满足item.multiCameraGroupId === this.cameraData的数据
      if (type === 1) {
        videoList.forEach(item => {
          const isShareCheck = this.chooseVideoData === 1
          const isNotShareCheck = this.chooseVideoData === 2
          const isCameraDataPresent = Boolean(this.cameraData)
          const isShareConditionMet = isShareCheck && item.isShare
          const isNotShareConditionMet = isNotShareCheck && !item.isShare
          const isGeneralConditionMet = !isShareCheck && !isNotShareCheck
          const isCameraConditionMet = isCameraDataPresent ? item.multiCameraGroupId === this.cameraData : true

          if ((isShareConditionMet || isNotShareConditionMet || isGeneralConditionMet) && isCameraConditionMet) {
            arr.push(item)
          }
        })
      } else {
        videoList.forEach(item => {
          // 如果this.chooseVideoData1是4 就筛选item.isInvalid的数据 如果除开0以外的就匹配对应的item.stauts的数据 同时this.cameraData1有值要满足item.multiCameraGroupId === this.cameraData1的数据
          const isInvalidCheck = this.chooseVideoData1 === 4
          const isStatusCheck = this.chooseVideoData1 !== 0 && item.status === this.chooseVideoData1
          const isGeneralConditionMet = this.chooseVideoData1 === 0
          const isCameraConditionMet = this.cameraData1 ? item.multiCameraGroupId === this.cameraData1 : true
          if (((isInvalidCheck && item.isInvalid) || (isStatusCheck) || isGeneralConditionMet) && isCameraConditionMet) {
            arr.push(item)
          }
        })
      }

      return arr
    },
    /**
     * @param {*} chooseVideoData // val 判断视频筛选当前是否有筛选值 以及筛选的值是什么
     * @param {*} flag // flag 用上来标识是上面的脱敏列表还是下面的视频列表
     * @param {*} cameraData // cameraData 用来判断是否是机位筛选 以及当前筛选值是什么
     */
    chooseDataStatus(chooseVideoData, flag, cameraData) {
      if (flag) {
        // 视频筛选的值
        this.chooseVideoData = chooseVideoData
        // 机位筛选的值
        this.cameraData = cameraData
        this.forTm = []
        if (!this.chooseVideoData && !this.cameraData) {
          this.forTm = this.form.desensitizedVideoList
        } else {
          this.forTm = this.filterDesensitizedVideoList(1)
        }
      } else {
        console.log(chooseVideoData, cameraData, 'chooseVideoData, cameraData')
        // 视频筛选的值
        this.chooseVideoData1 = chooseVideoData
        // 机位筛选的值
        this.cameraData1 = cameraData
        if (!this.chooseVideoData1 && !this.cameraData1) {
          this.forAllVideoArr = this.form.originalVideoList
        } else {
          this.forAllVideoArr = this.filterDesensitizedVideoList(2)
        }
      }
    },
    async loadDetailData() {
      const params = {
        videoGroupId: this.$route.query.videoGroupId
      }
      desensitizationListDetail(params).then(res => {
        this.form = res.data
        this.forTm = this.form.desensitizedVideoList
        this.forAllVideoArr = this.form.originalVideoList
        this.cameraData = 0
        this.chooseVideoData = 0
        this.$refs.videoListShare && this.$refs.videoListShare.clearVideoStatus()
        console.log('sssssssssssssssssss: ', this.forAllVideoArr)
        /* this.form.originalVideoList.some(item => {
          item.status = 3
        }) */
        // eslint-disable-next-line no-undef, no-self-assign
        // this.form.videoGroupId = this.form.videoGroupId
        // eslint-disable-next-line no-undef
        console.log(this.form.createUserId === this.userInfo.userId, 'this.form.createUserId === this.userInfo.userId')
        this.isUploaderFlag = this.form.createUserId === this.userInfo.userId
        const orgInfo = getItem('orgInfo')
        this.isDistribute = orgInfo.organizationId === res.data.supplierOrgId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.desensitization-wrapper {
  width: 100%;
  min-width: 1640px;
  float: left;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  .bread-row {
    width: 100%;
    padding-bottom: 15px;
    border-bottom: 1px solid #eff2f6;
    span {
      color: #777;
      font-size: 16px;
      cursor: pointer;
    }
    i {
      color: #777;
      font-size: 14px;
      font-style: normal;
      padding: 0 2px;
      cursor: pointer;
    }
    p {
      font-size: 16px;
      font-weight: normal;
      color: #333;
      display: inline-block;
    }
  }
  .desensitization-row {
    margin-top: 18px;
    .title-row {
      width: 100%;
      height: 24px;
      em {
        width: 4px;
        height: 24px;
        border-radius: 6px;
        background: #0c6fff;
        float: left;
        margin-right: 8px;
      }
      span {
        float: left;
        color: #333;
        font-weight: bold;
        font-size: 16px;
      }
      p {
        float: left;
        font-size: 12px;
        color: #999;
        margin-left: 8px;
        line-height: 24px;
      }
    }
    .desens-content {
      margin-top: 10px;
      padding: 12px 16px;
      background: #f7fbff;
      border-radius: 8px;
      ::v-deep .el-form-item {
        margin-bottom: 0px;
      }
      ::v-deep .el-form-item__label {
        color: #777;
        margin-right: 8px;
        width: 90px;
        text-align: right;
        font-weight: normal;
      }
      ::v-deep .el-form-item__content {
        font-size: 14px;
        color: #333;
      }
    }
  }
  .video-line {
    margin-top: 30px;
    .video-content {
      width: calc(100% + 40px);
      margin-left: -20px;
      display: flex;
      flex-wrap: wrap;
      .video-row {
        flex: 25% 0 0;
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        .video-row-con {
          border: 1px solid #eff2f6;
          border-radius: 6px;
        }
      }
    }
    .desen-content {
      margin-top: 20px;
    }
  }
}
</style>

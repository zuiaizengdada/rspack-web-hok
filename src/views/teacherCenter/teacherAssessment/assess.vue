<template>
  <formPage
    v-loading="loading"
    title="师资评估"
    sub-title="IP评估"
    @click="$router.push('/teacherCenter/teacherAssessment/list')"
  >
    <div class="content">
      <div class="tearchName">
        <span class="name">{{ detail.teacherName }}</span>
        <span class="teacherId m-l-8">{{ $route.params.id }}</span>
      </div>
      <div class="form-content">
        <div class="label">主页链接:</div>
        <div class="home-page">
          <el-link v-if="detail.homepageLink" type="primary" @click="handleOpen">点击查看</el-link>
          <span v-else>暂无</span>
        </div>
      </div>
      <div class="tearchVideo formView">
        <div class="label">评估视频:</div>
        <div class="tearchVideoBox">
          <div v-for="(item, index) in detail.videoList" :key="index" class="tearchVideoView">
            <template v-if="(item.type === 3 && [5, 4].includes(item.platform)) || item.type === 1">
              <videoShow :url="item.url" />
            </template>
            <template v-else>
              <urlShow :url="item.url" />
            </template>
          </div>
          <div class="teacher-btn">
            <el-button
              size="small"
              type="primary"
              plain
              @click="findVideo"
            >补充视频</el-button>
          </div>
        </div>
      </div>

      <div class="tearchLink">
        <div v-for="(item, index) in linkUrls" :key="index" class="tearchLinkItem formView">
          <span class="label">网页地址：</span>
          <span class="tearchVideoValue a_link" @click="openNewWindow(item)">
            <template v-if="item.length < 30">
              {{ item }}
            </template>
            <template v-else>
              {{ item.substring(0, 30) + '...' }}
            </template>
          </span>
          <el-tooltip class="item" effect="dark" content="点此复制" placement="top-start">
            <span v-clipboard:copy="item" v-clipboard:success="clipboardSuccess">
              <svg-icon icon-class="fuzhi" class="a_link" />
            </span>
          </el-tooltip>
        </div>
      </div>

      <div class="assessmentContent">
        <div>
          <div class="label">师资档案:</div>
          <div class="tearchFileContent overflowOuto">
            <MTitle title="IP资质" />
            <div class="userInfo tearchFilePadding">
              <div class="userImage">
                <el-image :src="detail.photoUrl" style="width: 100%; height: 100%" fit="contain">
                  <img
                    slot="error"
                    src="@/assets/image/tupianjiazaishibai.png"
                    alt=""
                    style="width: 100%; height: 100%"
                  />
                </el-image>
              </div>
              <div class="userText" v-html="detail.experience" />
            </div>

            <MTitle title="所属领域" />
            <div class="tearchFileTitle tearchFilePadding" v-html="detail.domains" />

            <!-- <MTitle title="服务企业" />
            <div class="tearchFilePadding tearchFileTitle" v-html="detail.serviceEnterprise" />

            <MTitle title="相关课程" />
            <div class="tearchFilePadding tearchFileTitle" v-html="detail.courseware" /> -->
          </div>
        </div>
        <div style="margin-left: 32px">
          <div class="label">评估维度:
            <el-checkbox v-model="ifPercentage" :disabled="changeLoading" style="float: right" @change="onhandlePercentage">切换为百分比</el-checkbox>
          </div>
          <div class="assessmentBox">
            <template v-for="(item, index) in assessArr">
              <div :key="index">
                <div class="assessmentTitle">{{ item.title }}</div>
                <div class="assessmentValue">
                  <span class="sliderTitle">{{ ifPercentage ? '0%' : '0分' }}</span>
                  <div class="assessmentSlider">
                    <app-slider
                      v-model="item.value"
                      :min="0"
                      :max="item.totalSort"
                      :step="0.5"
                      @change="getOverallRating"
                    />
                  </div>
                  <span class="sliderTitle">{{ filterSort(item.totalSort) }}</span>
                </div>
              </div>
            </template>

            <div class="overallRating">综合评分：<span style="color:#0C6FFF"> {{ overallRating }}分</span></div>
            <div class="form-content">
              <div class="label">个人意见：</div>
              <el-button
                v-for="item in btnList"
                :key="item.key"
                plain
                :class="item.value == detail.opinion ? 'primary' : ''"
                @click="handleChangeBtnValue(item.value)"
              >{{ item.label }}</el-button>
            </div>
            <div class="form-sendFeiShu">
              <el-checkbox v-model="detail.sendFeiShu">需要补充视频，并通过飞书发送消息给师资开发人员</el-checkbox>
            </div>
            <div class="comments">
              <span class="label">个人评语：</span>
              <el-input
                v-model="comments"
                class="commentsInput"
                maxlength="100"
                :rows="5"
                type="textarea"
                show-word-limit
              />
            </div>
            <div class="commentsTips">注：请填写不少于5个字评语</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button :loading="loading" size="small" type="primary" @click="visible = true">提交评估</el-button>
      <el-button :loading="loading" size="small" @click="goBack">返回</el-button>
    </div>
    <el-dialog
      :visible.sync="visible"
      width="360px"
      top="30vh"
      class="dialog-class"
    >
      <div class="dialog-container">
        <div class="dialog-title">综合评分：
          <span>{{ overallRating }}</span> 分
        </div>
        <div class="dialog-content">
          <svg-icon icon-class="icon_warning" class="dialog-icon" />
          <span>您的每一项评分将影响老师最终评估结果提交后不可修改，请谨慎评估！</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="send">提交</el-button>
        <el-button v-if="hasNext" type="primary" plain @click="sendNext">提交并评估下一个</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </el-dialog>
  </formPage>
</template>

<script>
import formPage from '../components/formPage'
import clipboard from '@/directive/clipboard/index.js'
import { getTeacherDetail, assessUserSave, teacherAssessUserInfo, teacherUserUpdate, getUserDimension } from '@/api/tearchCenter'
import videoShow from '../components/videoShow'
import urlShow from '../components/urlShow'
import BigNumber from 'bignumber.js'
import { getItem, setItem } from '@/utils/localStorage'
import appSlider from './components/appSlider'
export default {
  directives: {
    clipboard
  },
  components: {
    formPage,
    videoShow,
    urlShow,
    appSlider
  },
  data() {
    return {
      loading: false,
      detail: {
        name: '',
        photoUrl: '',
        domains: '', // 所属领域
        experience: '', // 讲师资质
        courseware: '', // 过往课题
        serviceEnterprise: '', // 服务企业
        videoList: [],
        needAssessTeacherId: '',
        teacherName: '',
        opinion: undefined,
        sendFeiShu: false, // 是否发飞书
        homepageLink: ''
      },
      hasNext: false,
      visible: false,
      linkUrls: [],
      btnList: [{
        label: '做',
        value: 1
      }, {
        label: '不做',
        value: 2
      }],
      changeLoading: false,
      assessArr: [],
      overallRating: 5, // 综合评分
      comments: '',
      editAssess: false,
      ifPercentage: false // 是否开启百分比
    }
  },
  created() {
    const ifPercentage = getItem('tearch_ifPercentage')
    this.ifPercentage = Boolean(ifPercentage)
  },
  mounted() {
    this.init()
  },
  methods: {
    onhandlePercentage(res) {
      if (this.changeLoading) { return }
      this.changeLoading = true
      setItem('tearch_ifPercentage', res)
      this.assessArr.map(i => {
        i.totalSort = this.ifPercentage ? 100 : i.maxsort
        i.value = res ? Number(((i.value / i.maxsort) * 100).toFixed(2)) : Number(((i.value / 100) * i.maxsort).toFixed(2))
        // return {
        //   title: i.title,
        //   value: res ? ((i.value / i.maxsort) * 100).toFixed(2) : (i.value / 100) * i.maxsort.toFixed(2),
        //   totalSort: this.ifPercentage ? 100 : i.maxsort,
        //   id: i.id,
        //   sort: i.sort,
        //   maxsort: i.maxsort
        // }
      })
      this.changeLoading = false
      console.log(this.assessArr, 'this.assessArr')
    },
    init() {
      this.editAssess = this.$route.query?.editAssess ?? false
      this.getDetail()
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    handleChangeBtnValue(val) {
      this.detail.opinion = val
    },
    // 点击返回
    goBack() {
      // this.$router.back()
      if (window.history.length <= 1) {
        this.$router.push(`/teacherCenter/teacherAssessment/list`)
      } else {
        this.$router.go(-1)
      }
    },
    // 获取讲师详情
    async getDetail() {
      this.loading = true
      try {
        const teacherId = this.$route.params.id
        const params = {
          teacherId
        }
        const { data = [] } = await getUserDimension(teacherId)
        this.assessArr = data.map(i => {
          return {
            title: `${i.evaluationDimension}：${i.dimensionDescription}(总分${i.point}分)`,
            value: this.ifPercentage ? 50 : i.point / 2,
            totalSort: this.ifPercentage ? 100 : i.point,
            id: i.assessDimensionId,
            sort: i.point / 2,
            maxsort: i.point
          }
        })
        const res = await getTeacherDetail(params)
        this.loading = false
        let domains = ''
        if (res.data.domains?.length > 0) {
          res.data.domains.map((v) => {
            domains += v.domainName + ' '
          })
        }
        let assessUsers = ''
        if (res.data.assessUsers?.length > 0) {
          res.data.assessUsers.map((v, i) => {
            assessUsers += `${v.userName}${i === res.data.assessUsers.length - 1 ? '' : '、'}`
          })
        }
        this.detail = {
          teacherId,
          teacherName: res.data.teacherName,
          photoUrl: res.data.photoUrl,
          domains: domains, // 所属领域
          needAssessTeacherId: res.data.needAssessTeacherId,
          experience: res.data.experience?.replace(/\n/g, '<br />'), // 讲师资质
          courseware: res.data.courseware?.replace(/\n/g, '<br />'), // 过往课题
          serviceEnterprise: res.data.serviceEnterprise?.replace(/\n/g, '<br />'), // 服务企业
          videoList: res.data.urls,
          assessUsers: assessUsers, // 参与评估人员列表
          expiresDate: res.data.expiresDate, // 评估截止时间
          homepageLink: res.data.homepageLink,
          opinion: undefined,
          sendFeiShu: false
        }
        this.hasNext = this.detail.needAssessTeacherId && !this.editAssess

        if (this.editAssess) {
          const { data } = await teacherAssessUserInfo(teacherId)
          data.assessDimensionDatas.forEach(i => {
            this.assessArr.forEach(j => {
              if (i.assessDimensionId === j.id) {
                console.log(this.ifPercentage)
                j.value = this.ifPercentage ? Number(((i.point / 100 / j.maxsort) * 100).toFixed(2)) : Number((i.point / 100).toFixed(2))
                console.log(j.value, 'j.valuej.valuej.valuej.value', i.point)
              }
            })
          })
          this.comments = data.comments
          this.detail.opinion = data.opinion
        }
      } catch (e) {
        this.loading = false
      }
    },
    handleOpen() {
      window.open(this.detail.homepageLink)
    },
    // 点击提交评估
    send() {
      if (!this.detail.opinion) {
        return this.$message.error('请选择个人意见')
      }
      if (this.comments.length < 5) {
        return this.$message.error('请输入至少5个字的评语!')
      }
      this.addAssess()
    },
    sendNext() {
      if (!this.detail.opinion) {
        return this.$message.error('请选择个人意见')
      }
      if (this.comments.length < 5) {
        return this.$message.error('请输入至少5个字的评语!')
      }
      this.addAssess('next')
    },
    // 提交评估数据
    addAssess(type = '') {
      this.loading = true
      const dimensionsPoint = this.assessArr.map((v) => {
        return {
          dimensionId: v.id,
          point: this.ifPercentage ? Number((v.value) * v.maxsort.toFixed(2)) : Number(new BigNumber(v.value).times(100).toString())
        }
      })
      const data = {
        comments: this.comments,
        opinion: this.detail.opinion,
        sendFeiShu: this.detail.sendFeiShu,
        // overallRating: this.overallRating,
        teacherId: this.$route.params.id,
        dimensionsPoint
      }
      const apiFn = this.editAssess ? teacherUserUpdate : assessUserSave
      apiFn(data)
        .then((res) => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '提交成功' })
          if (type) {
            this.$router.replace(`/teacherCenter/teacherAssessment/assess/${this.detail.needAssessTeacherId}`)
          } else {
            this.goBack()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 计算综合分
    getOverallRating() {
      if (this.ifPercentage) {
        let overallRating = 0
        this.assessArr.map((v) => {
          overallRating += (v.value) / 100 * v.maxsort
        })
        this.overallRating = overallRating.toFixed(2)
      } else {
        let overallRating = 0
        this.assessArr.map((v) => {
          overallRating += v.value
        })
        this.overallRating = overallRating.toFixed(2)
      }
    },
    // 点击打开新页面
    openNewWindow(item) {
      if (item.substr(0, 7).toLowerCase() === 'http://' || item.substr(0, 8).toLowerCase() === 'https://') {
        return window.open(item, '_blank')
      } else {
        return window.open('http://' + item, '_blank')
      }
    },
    findVideo() {
      window.open(`${location.origin}/#/teacherCenter/findTeacher/list?teacherName=${this.detail.teacherName}`)
    },
    // 过滤处理分数
    filterSort(sort) {
      if (this.ifPercentage) {
        // 百分比显示
        return 100 + '%'
      } else {
        // 非百分比显示
        return sort + '分'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 20px;
  .tearchName {
    display: flex;
    align-items: flex-end;
    .name {
      font-size: 20px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(51, 51, 51, 0.9);
      line-height: 28px;
    }
    .teacherId {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 22px;
    }
  }
  .primary.el-button{
    background: #FFFFFF;
    border-color: #0C6FFF;
    color: #0C6FFF;
  }
  .form-content{
    margin-top: 25px;
    display: flex;
    align-items: center;
    height: 20px;
  }
  .form-sendFeiShu {
    margin-left: 88px;
    margin-top: 20px;
  }
  .formView {
    display: flex;
  }
  .label {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 24px;
    margin-right: 8px;
  }
  .tearchVideo {
    margin-top: 30px;
  }
  .tearchLink {
    margin-bottom: 32px;
    margin-top: 32px;
    .tearchVideoValue {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 22px;
      margin-right: 4px;
      text-decoration: underline;
    }
    .tearchLinkItem + .tearchLinkItem {
      margin-top: 17px;
    }
  }
  .assessmentContent {
    display: flex;
    .tearchFileContent {
      margin-top: 16px;
      width: 500px;
      height: 100%;
      flex: 1;
      padding: 20px;
      box-sizing: border-box;
      background: #f3f3f3;
      border-radius: 6px;
      .userInfo {
        display: flex;
        .userImage {
          flex: 118px 0 0;
          height: 135px;
          border-radius: 4px;
          background: #fafafa;
          margin-right: 16px;
        }
        .userText {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          line-height: 22px;
        }
      }
      .tearchFileTitle {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
      }
      .tearchFilePadding {
        padding-top: 24px;
        padding-bottom: 32px;
      }
    }
    .assessmentBox {
      margin-top: 16px;
      width: 587px;
      height: 100%;
      flex: 1;
      background: #f3f3f3;
      border-radius: 6px;
      padding: 20px;
      box-sizing: border-box;
      .assessmentTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 24px;
      }
      .assessmentValue {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-top: 16px;
        margin-bottom: 32px;
        .assessmentSlider {
          width: calc(100% - 64px);
        }
        .sliderTitle {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          line-height: 22px;
        }
      }
    }
  }
  .overallRating {
    text-align: left;
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
  }
  .comments {
    margin-top: 16px;
    display: flex;
    .commentsLabel {
      flex: 1 0 0;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
    }
    .commentsInput {
      width: 437px;
    }
  }
}
.footer {
  margin-top: 58px;
  text-align: center;
}
.teacher-btn{
  width: 195px;
  height: 110px;
  background: #FBFCFE;
  margin-right: 25px;
  margin-bottom: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px dashed #E1E6ED;
}
.tearchVideoBox {
  max-width: 1100px;
  display: flex;
  flex-wrap: wrap;
  .tearchVideoView {
    width: 195px;
    height: 110px;
    border-radius: 5px;
    background: #ccc;
    margin-right: 25px;
    margin-bottom: 17px;
  }
}
.commentsTips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #f53f3f;
  line-height: 20px;
  margin-left: 90px;
}

.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  line-height: 20px;
  color: #777777;
}
.dialog-class ::v-deep{
  .el-dialog__body{
    padding: 0px 20px 20px;
  }
  .el-dialog{
    border-radius: 6px;
  }
  .dialog-footer{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.dialog-container{
  font-size: 14px;
  color: #333333;
  .dialog-title{
    font-size: 18px;
    margin-bottom: 16px;
    text-align: center;
    span{
      font-weight: 600;
      font-size: 36px;
      color: red;
    }
  }
  .dialog-content{
    display: flex;
    align-items: center;

    .dialog-icon{
      height: 28px;
      width: 28px;
      margin-right: 16px;
    }
  }

}

</style>

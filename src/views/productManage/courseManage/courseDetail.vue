<template>
  <div class="live-content">
    <div class="brand-row">
      <span @click="$router.push({ path: '/productManage/courseManage/index' })">课件管理 > </span>
      <span class="title-row">课件详情</span>
    </div>
    <div class="detail-content">
      <span class="title-sp">{{ returnData.coursewareName }} <em>课件制作日期： {{ returnDateFormatter(returnData.produceDate) }}</em></span>
      <div class="center-con">
        <div class="con-row">
          <div class="con-row-title">
            <span>课件制作人：</span>
          </div>
          <div class="con-row-detail">
            <span>{{ returnData.producer }}</span>
          </div>
          <div class="con-row-title">
            <span>课件IP：</span>
          </div>
          <div class="con-row-detail">
            <span>{{ returnData.teacherName }}</span>
          </div>
        </div>
        <div class="con-row">
          <div class="con-row-title">
            <span>课件大纲：</span>
          </div>
          <div class="con-row-detail">
            <span v-for="(item,index) in returnData.coursewareOutline" :key="index">
              {{ item }}
            </span>
          </div>
          <div class="con-row-title">
            <span>选择选题：</span>
          </div>
          <div class="con-row-detail">
            <span v-for="(item,index) in returnData.caseInfo" :key="index" class="con-a" @click="linkToDetail(item)">
              {{ item.caseName }}
            </span>
          </div>
        </div>
        <div class="con-row">
          <div class="con-row-title">
            <span>所属计划：</span>
          </div>
          <div class="con-row-detail">
            <span>{{ returnData.planName }}</span>
          </div>
          <div class="con-row-title">
            <span>课件关键词：</span>
          </div>
          <div class="con-row-detail">
            <span>{{ returnData.coursewareKeyword }}</span>
          </div>
        </div>
        <div class="con-row">
          <div class="con-row-title">
            <span>课件适用场景：</span>
          </div>
          <div class="con-row-detail">
            <span>{{ returnData.applySceneName }}</span>
          </div>
          <div class="con-row-title">
            <span>课件版本：</span>
          </div>
          <div class="con-row-detail">
            <span>{{ brandArray[returnData.coursewareVersion] }}</span>
          </div>
        </div>
        <div class="con-row">
          <div class="con-row-title">
            <span>课件上传：</span>
          </div>
          <div class="con-row-detail">
            <div v-if="isImg !== 1" class="show-detail">
              <div v-if="isImg === 2" class="upload-file-cls" @click="showDetail">
                <img src="@/assets/image/product/icon_pdfwenjian@2x.png" />
                <p>{{ returnData.coursewareUrl.substring(returnData.coursewareUrl.lastIndexOf('/')+1,returnData.coursewareUrl.length) }}</p>
              </div>
              <div
                v-if="isImg === 3"
                class="upload-file-cls"
                @click="showDetail"
              >
                <img src="@/assets/image/product/ppt@2x.png" />
                <p>点击查看</p>
              </div>
            </div>
            <div v-if="isImg === 1" class="upload-img-orfile">
              <ImagePreviewer class="img-cls" :src="returnData.coursewareUrl" :scale-width="120" :scale-height="90" @click="showImg" />
            </div>
          </div>
        </div>
      </div>
      <div class="center-cons">
        <el-button style="margin-top: 290px; margin-bottom: 30px;" @click="$router.push({ path: '/productManage/courseManage/index' })">关闭</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="returnData.coursewareUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getCourseDetailById } from '@/api/product/courseManage'
import { DateFormat } from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      courseId: '',
      returnData: {},
      isImg: false,
      brandArray: ['原版', '修改版', '最终版']
    }
  },
  mounted() {
    this.courseId = this.$route.query.courseId
    this.loadData()
  },
  created() {},
  methods: {
    loadData() {
      getCourseDetailById(this.courseId).then(res => {
        console.log(res)
        if (res.success) {
          this.returnData = res.data
          if (this.returnData.coursewareUrl.indexOf('png') > 0 || this.returnData.coursewareUrl.indexOf('jpg') > 0 || this.returnData.coursewareUrl.indexOf('jpeg') > 0) {
            this.isImg = 1
          } else if (this.returnData.coursewareUrl.indexOf('pdf') > 0) {
            this.isImg = 2
          } else if (this.returnData.coursewareUrl.indexOf('pptx') > 0) {
            this.isImg = 3
          }
        }
      })
    },
    showImg() {
      this.dialogVisible = true
    },
    showDetail() {
      window.open(this.returnData.coursewareUrl, '_blank')
    },
    returnDateFormatter(date) {
      return DateFormat(new Date(date), 'yyyy-MM-dd hh:mm:ss')
    },
    linkToDetail(obj) {
      const routeData = this.$router.resolve({ path: `/caseManage/details/${obj.caseId}?isPlan=true&courseId=${this.$route.query.courseId}` })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.live-content {
  float: left;
  width: 100%;
  min-width: 1200px;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
}
.brand-row {
  width: 100%;
  height: 40px;
  color: #777;
  font-size: 16px;
  border-bottom: 1px solid #eff2f6;
  span {
    cursor: pointer;
  }
}

.title-row {
  color: #333;
  font-weight: bold;
}
.detail-content {
  width: 100%;
  margin-top: 20px;
}
.title-sp {
  color: #333;
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
  em {
    font-style: normal;
    font-size: 14px;
    color: #777;
    font-weight: lighter;
    margin-left: 15px;
  }
}
.center-con {
  width: 100%;
  .con-row {
    float: left;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 10px;
    .con-row-title {
      width: 105px;
      color: #777;
      font-size: 15px;
      text-align: right;
      float: left;
      font-family: MicrosoftYaHei;
      font-weight: 400;
    }
    .con-row-detail {
      width: 440px;
      color: #333;
      font-size: 14px;
      padding-left: 10px;
      float: left;
      span {
        width: 100%;
        float: left;
        padding-top: 1px;
        line-height: 20px;
        margin-bottom: 5px;
      }
      .con-a {
        color: #0C6FFF;
        cursor: pointer;
      }
      .con-a:hover {
        text-decoration: underline;
      }
    }
  }
}
.center-cons {
  float: left;
  width: 100%;
  margin-top: 30px;
  text-align: center;
}

.show-detail {
  width: 300px;
  height: 80px;
  .upload-file-cls {
    width: 100%;
    height: 100%;
    text-align: center;
    cursor: pointer;
    img {
      float: left;
      width: 32px;
      margin-top: 15px;
    }
    p {
      float: left;
      width: 200px;
      font-size: 14px;
      color: #333;
      text-align: left;
      margin-top: 20px;
      margin-left: 10px;
    }
  }
}

.upload-img-orfile {
  left: 130px;
  width: 120px;
  height: 90px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #e1e6ed;
  text-align: center;
  .img-cls {
    width: 100%;
    height: 100%;
  }
}
</style>


<template>
  <div class="details-container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="form-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/productManage/caseManage/index' }">选题管理</el-breadcrumb-item>
      <el-breadcrumb-item>选题详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="details-header">
      <span class="title">{{ current.caseName }}</span>
      <!-- <span class="desc">发布日期：{{ current.createTime || current.publishedDate }}</span> -->
    </div>
    <div class="center-content">
      <el-descriptions class="add-bg-block" :span="3">
        <el-descriptions-item v-if="!isPlan" label="所属IP">{{ current.suitableTeachers }}</el-descriptions-item>
        <el-descriptions-item label="所属领域">{{ current.fieldName }}</el-descriptions-item>
        <!-- <el-descriptions-item label="所属行业">{{ current.industryName }}</el-descriptions-item> -->
        <el-descriptions-item label="选题类别">{{ current.type }}</el-descriptions-item>
        <el-descriptions-item label="选题大小">{{ current.size }}</el-descriptions-item>
        <el-descriptions-item v-if="!isPlan" label="被引用老师">{{ current.quoteTeachers }}</el-descriptions-item>
        <el-descriptions-item label="选题关键词">{{ current.keywords }}</el-descriptions-item>
        <!-- <el-descriptions-item label="关联选题关键词">{{ current.demandKeyword }}</el-descriptions-item> -->
        <!-- <el-descriptions-item label="交付场景">{{ current.industryName }}</el-descriptions-item> -->
        <el-descriptions-item label="创建人">{{ current.createBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ current.createTime }}</el-descriptions-item>
        <el-descriptions-item label="修改人">{{ current.updateBy }}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{ current.updateTime }}</el-descriptions-item>

      </el-descriptions>
    </div>
    <div class="ppt-img-block">
      <el-descriptions :span="1">
        <el-descriptions-item label="选题内容">
          <div class="image-item">
            <ImagePreviewer
              v-for="item in current.contents"
              :key="item"
              style="width: 320px; height: 180px; float: left;"
              :src="item+'?x-oss-process=image/resize,w_320,h_180'"
              :preview-src-list="[item]"
              :scale-width="320"
              :scale-height="180"
            />
            <div v-if="current.wordString" class="word-content">
              <i class="word-icn" />
              <p class="word-p">{{ current.wordName }}</p>
              <span class="word-span" @click="toShowWord">点击查看</span>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="details-footer">
      <el-button @click="goback">返回</el-button>
    </div>

    <div v-if="viewWordFlag" class="word-vide-mask">
      <i class="el-icon-circle-close close-view-word" @click="viewWordFlag = false" />
      <div id="wordView" class="word-view" v-html="vHtml" />
    </div>
  </div>
</template>

<script>
import mammoth from 'mammoth'
const type = {
  1: '非带货',
  2: '带货'
}
const size = {
  1: '小选题',
  2: '大选题'
}
import { caseDetail } from '@/api/product/case'
import { planCaseDetails } from '@/api/product/plan'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      vHtml: '',
      current: {},
      viewWordFlag: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    toShowWord() {
      this.readExcelFromRemoteFile(this.current.wordString)
      this.viewWordFlag = true
    },
    readExcelFromRemoteFile: function (url) {
      var vm = this
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function () {
        if (xhr.status === 200) {
          mammoth
            .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
            .then(function (resultObject) {
              vm.$nextTick(() => {
                // document.querySelector("#wordView").innerHTML =
                //   resultObject.value;
                vm.vHtml = resultObject.value
              })
            })
        }
      }
      xhr.send()
    },
    async init() {
      const caseId = this.$route.params.id
      const query = this.$route.query
      this.isPlan = query.isPlan
      if (!query.isPlan) {
        const { data } = await caseDetail({ caseId })
        this.current = {
          ...data,
          createTime: parseTime(new Date(data.createTime).getTime(), '{y}-{m}-{d} {h}:{i}'),
          updateTime: parseTime(new Date(data.updateTime).getTime(), '{y}-{m}-{d} {h}:{i}'),
          keywords: data.keywords?.join('、'),
          type: type[data.type],
          size: size[data.size],
          suitableTeachers: data.suitableTeachers?.map((i) => i.teacherName)?.join('、'),
          quoteTeachers: data.quoteTeachers?.map((i) => i.teacherName)?.join('、')
        }
      } else {
        const { data } = await planCaseDetails({ planCaseId: caseId })
        this.current = {
          ...data,
          createTime: parseTime(new Date(data.createTime).getTime(), '{y}-{m}-{d} {h}:{i}'),
          updateTime: parseTime(new Date(data.updateTime).getTime(), '{y}-{m}-{d} {h}:{i}'),
          keywords: data.keywords?.join('、'),
          type: type[data.type],
          size: size[data.size],
          suitableTeachers: data.suitableTeachers?.map((i) => i.teacherName)?.join('、'),
          quoteTeachers: data.quoteTeachers?.map((i) => i.teacherName)?.join('、')
        }
      }
    },
    goback() {
      const courseId = this.$route.query && this.$route.query.courseId
      if (!courseId) {
        this.$router.back(-1)
      } else {
        this.$router.push(`/productManagement/courseDetail?courseId=${courseId}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.details-container ::v-deep {
  height: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  .el-descriptions-item__label {
    font-size: 16px;
    color: #777777;
  }
  .form-breadcrumb {
    padding-bottom: 20px;
    border-bottom: 1px solid #EFF2F6;
    .el-breadcrumb__inner,
    .el-breadcrumb__inner a {
      font-weight: 800 !important;
    }
    .el-breadcrumb__inner.is-link {
      color: #777777;
    }
    .el-breadcrumb__inner {
      color: #333;
    }
    margin-bottom: 20px;
    font-size: 16px;
  }
  .el-descriptions-item__content {
    font-size: 14px;
    color: #333333;
    line-height: 25px;
  }
  .details-header {
    margin-bottom: 20px;
    .title {
      font-weight: bold;
      color: #333333;
      font-size: 16px;
      margin-right: 14px;
    }
    .desc {
      font-size: 14px;
      color: #777777;
    }
  }
  .el-descriptions--medium:not(.is-bordered) .el-descriptions-item__cell {
    padding-bottom: 20px;
  }
  .details-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.add-bg-block {
  background: #F7FBFF;
  padding: 10px;
  padding-top: 20px;
  border-radius: 8px;
}
.center-content {
  margin-bottom: 20px;
  ::v-deep .el-descriptions__table {
    background-color: #F7FBFF;
  }
}

.ppt-img-block {
  .image-item {
    float: left;
    .el-image {
      border-radius: 8px;
      margin-right: 15px;
      margin-bottom: 10px;
    }
  }
  .word-content {
    width: 320px;
    height: 180px;
    display: inline-block;
    border-radius: 8px;
    background: #F7FBFF;
    .word-icn {
      float: left;
      margin-top: 30px;
      margin-left: 135px;
      width: 51px;
      height: 52px;
      background-image: url(../../../assets/image/video/icn_docment.png);
      background-size: 100%;
    }
    .word-p {
      float: left;
      width: 100%;
      margin-top: 16px;
      text-align: center;
      font-size: 14px;
      color: #333;
      padding: 0 15px;
      height: 20px;
      overflow: hidden;
    }
    .word-span {
      float: left;
      width: 100%;
      text-align: center;
      margin-top: 5px;
      color: #0C6FFF;
      font-size: 14px;
      cursor: pointer;
    }
  }
}

.word-vide-mask {
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background-color: rgba(0,0,0,0.3);
  .word-view{
    position: absolute;
    left: 30%;
    top: 2%;
    width: 40%;
    height: 96%;
    padding: 20px;
    background: #fff;
    overflow-y: auto;
  }
  .close-view-word {
    position: absolute;
    font-size: 24px;
    top: 3%;
    left: 68%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    z-index: 999999;
  }
}
</style>

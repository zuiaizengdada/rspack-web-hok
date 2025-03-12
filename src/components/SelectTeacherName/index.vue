<template>
  <el-autocomplete
    v-model.trim="dataValue"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入内容"
    style="width:400px"
    :maxlength="10"
    show-word-limit
    @select="handleSelect"
  >
    <template slot-scope="{ item }">
      <el-popover
        placement="right-start"
        width="700"
        :disabled="item.tips"
        :open-delay="500"
        trigger="hover"
      >
        <el-scrollbar ref="scrollContainer" class="scroll-container">
          <div class="content">
            <MTitle :title="title" />
            <div class="userFile">
              <div v-if="type !== 'A'" class="userImage">
                <el-image :src="detail.photoUrl" style="width: 100%; height: 100%" fit="contain">
                  <img slot="error" src="@/assets/image/tupianjiazaishibai.png" alt="" style="width: 100%; height: 100%" />
                </el-image>
              </div>
              <div class="userInfo">
                <div class="userName" :class="{'detail-margin':type === 'A'}">{{ detail.teacherName }}</div>
                <div v-if="type !== 'A'" class="userDetail">
                  <div class="userForm">
                    <span class="formLabel">所属领域：</span>
                    <span class="formValue">{{ detail.domains }}</span>
                  </div>
                  <div class="userForm">
                    <span class="formLabel">IP资质：</span>
                    <span class="formValue" v-html="detail.experience" />
                  </div>
                </div>
              </div>
            </div>
            <MTitle v-if="detail.videoList && detail.videoList.length" title="IP视频" />

            <div v-if="detail.videoList && detail.videoList.length" class="tearchVideo">
              <div class="tearchVideoBox">
                <div v-for="(video, index) in detail.videoList" :key="index" class="tearchVideoView">
                  <template v-if="(video.type === 3 && [5, 4].includes(video.platform)) || video.type === 1">
                    <videoShow :url="video.url" />
                  </template>
                  <template v-else>
                    <urlShow :url="video.url" />
                  </template>
                </div>
              </div>
            </div>

            <MTitle title="其他信息" />
            <div class="assess">
              <template v-if="type !== 'A'">
                <div class="assessForm">
                  <span class="formLabel">IP推荐人:</span>
                  <span class="formValue">{{ detail.recommendName }}</span>
                </div>
                <div class="assessForm">
                  <span class="formLabel">是否评估:</span>
                  <span class="formValue">
                    {{ {1:'是',0:'否'}[detail.assessFlag] }}
                  </span>
                </div>
                <div class="assessForm">
                  <span class="formLabel">评估状态:</span>
                  <span class="formValue">{{ detail.assessStatus | getOptionsValue(ASSESS_TYPES) }}</span>
                </div>
                <div v-if="detail.assessStatus === 4" class="assessForm">
                  <span class="formLabel">评估结果:</span>
                  <span class="formValue">{{ detail.mergeResult | getOptionsValue(ASSESS_RESULT_All) }}</span>
                </div>
                <div v-else class="assessForm">
                  <span class="formLabel">评估分数:</span>
                  <span v-if="detail.assessStatus === 3" class="formValue">{{ detail.overallRating }}分</span>
                  <span v-else class="formValue">——</span>
                </div>
              </template>
              <template v-else>
                <div class="assessForm">
                  <span class="formLabel">审核状态:</span>
                  <span class="formValue">
                    {{ {1:'已审核',0:'待审核'}[detail.auditStatus] }}
                  </span>
                </div>
                <div class="assessForm">
                  <span class="formLabel">审核结果:</span>
                  <span class="formValue">{{ detail.auditResultName }}</span>
                </div>

              </template>
              <div class="assessForm">
                <span class="formLabel">创建人:</span>
                <span class="formValue">
                  {{ detail.createUser }}
                </span>
              </div>
              <div class="assessForm">
                <span class="formLabel">创建时间:</span>
                <span class="formValue">{{ detail.createTime }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div
          slot="reference"
          :class="{tips:item.tips}"
          @mouseenter="handleMouseOver(item)"
          @mouseleave="handleMouseOut(item)"
        >{{ item.teacherName }}</div>

      </el-popover>
    </template>
  </el-autocomplete>
</template>

<script>
import { getTeacherDetail, teacherDraftDetail, getQueryAllByName, getAuditDetail } from '@/api/tearchCenter'
import videoShow from '@/views/teacherCenter/components/videoShow'
import urlShow from '@/views/teacherCenter/components/urlShow'
import { ASSESS_TYPES, ASSESS_RESULT_All } from '@/views/teacherCenter/enum'
import moment from 'moment'
export default {

  components: {
    videoShow,
    urlShow
  },
  model: {
    prop: 'teacherName',
    event: 'inputChange'
  },
  props: {
    teacherName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      timeout: null,
      ASSESS_RESULT_All,
      ASSESS_TYPES: [...ASSESS_TYPES, { label: '无需评估', value: 4 }],
      visible: false,
      detail: {},
      itemIdCopy: '',
      queryCopy: '',
      type: '',
      title: ''
    }
  },
  computed: {
    dataValue: {
      get() {
        return this.teacherName
      },
      set(val) {
        this.$emit('inputChange', val)
      }
    }
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      if (!queryString.trim()) {
        cb([])
        return
      }
      this.$emit('search', queryString)
      this.queryCopy = queryString
      try {
        const { data } = await getQueryAllByName({ name: queryString })
        const list = data && data.length ? [{ teacherName: '系统中已存在以下老师，请勿重复录入！', tips: true }, ...data] : []
        cb(list)
      } catch (e) {
        cb([])
      }
    },
    handleSelect() {
      this.dataValue = this.queryCopy
    },
    handleMouseOver(item) {
      this.itemIdCopy = item.teacherId
      setTimeout(() => {
        if (this.itemIdCopy === item.teacherId && !item.tips) {
          this.getDetail(item)
        }
      }, 200)
    },
    getDetail(item) {
      this.loading = true
      const params = {
        teacherId: item.teacherId
      }
      let apiFn = ''
      const apiList = {
        JS: {
          fn: getTeacherDetail,
          title: '正式档案'
        },
        D: {
          fn: teacherDraftDetail,
          title: '草稿档案'
        },
        A: {
          fn: getAuditDetail,
          title: '初审档案'
        }
      }
      for (const key in apiList) {
        if (item.teacherId.indexOf(key) !== -1) {
          this.type = key
          apiFn = apiList[key].fn
          this.title = apiList[key].title
        }
      }
      this.detail = {}
      apiFn(params)
        .then((res) => {
          let domains = ''
          if (res.data.domains && res.data.domains.length > 0) {
            domains = res.data.domains.map((v) => v.domainName).join(' ')
          }

          const overallRating = res.data.overallRating
          this.detail = {
            ...item,
            ...res.data,
            teacherName: res.data.teacherName,
            photoUrl: res.data.photoUrl,
            domains, // 所属领域
            experience: res.data.experience?.replace(/\n/g, '<br />'), // 讲师资质
            courseware: res.data.courseware?.replace(/\n/g, '<br />'), // 过往课题
            serviceEnterprise: res.data.serviceEnterprise?.replace(/\n/g, '<br />'), // 服务企业
            videoList: res.data.urls,
            assessFlag: res.data.assessFlag,
            expiresDate: res.data.expiresDate, // 评估截止时间
            assessDisable: res.data.assessDisable, // 是否禁用评估按钮
            assessStatus: res.data.assessStatus,
            overallRating: overallRating ? (overallRating / 100).toFixed(2) : '——',
            recommendName: res.data.recommendName,
            mergeResult: res.data.mergeResult,
            operateName: res.data.operateName,
            operateTime: res.data.operateTime,
            homepageLink: res.data.homepageLink,
            createUser: res.data.createUser || res.data.createUserName,
            createTime: res.data.createTime || moment(res.data.createTimeLong).format('YYYY-MM-DD HH:mm'),
            updateUser: res.data.updateUser,
            updateTime: res.data.updateTime
          }
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },
    handleMouseOut(item) {
      this.loading = false
    }
  }
}
</script>
<style lang="scss">
// .el-popover.el-popper{
//     z-index: 3000 !important;
// }
// .el-autocomplete-suggestion.el-popper{
//   z-index: 2002 !important;
// }
</style>
<style lang="scss" scoped>
.scroll-container{
  height: 750px;
  overflow-y: auto;
  overflow-x: hidden;
}
.content {
  padding-top: 10px;
  .userFile {
    margin-top: 8px;
    border-top: 1px solid #eff2f6;
    padding-top: 15px;
    padding-bottom: 15px;
    display: flex;
    .userImage {
      margin-right: 20px;
      width: 148px;
      height: 169px;
      border-radius: 4px;
      background: rgb(250, 250, 250);
    }
    .userInfo {

      .userName {
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 0.9);
        line-height: 28px;
      }
      .detail-margin{
        margin:0px 0 0 20px
      }
      .userDetail {
        margin-top: 8px;
        .userForm {
          display: flex;
          margin-bottom: 8px;
          .formLabel {
            font-size: 16px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 24px;
            margin-right: 8px;
            display: flex;
          }
          .formValue {
            width: 308px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333;
            line-height: 24px;
          }
        }
      }
    }
  }
  .org {
    margin-top: 8px;
    border-top: 1px solid #eff2f6;
    padding-top: 15px;
    padding-bottom: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 24px;
  }
  .pastSubject {
    margin-top: 8px;
    border-top: 1px solid #eff2f6;
    padding-top: 15px;
    padding-bottom: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
  .tearchVideo {
    margin-top: 8px;
    border-top: 1px solid #eff2f6;
    padding-top: 15px;
    padding-bottom: 32px;
    .tearchVideoLabel {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
    }
    .tearchVideoValue {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 22px;
      margin-right: 4px;
      text-decoration: underline;
      // max-width: 200px;
      // text-overflow: -o-ellipsis-lastline;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 1;
      // line-clamp: 1;
      // -webkit-box-orient: vertical;
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
  }
  .assess {
    margin-top: 8px;
    border-top: 1px solid #eff2f6;
    padding-top: 15px;
    padding-bottom: 10px;
    .assessForm {
      display: flex;
      .formLabel {
        margin-right: 8px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 24px;
      }
      .formValue {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
      }
    }
    .assessForm + .assessForm {
      margin-top: 15px;
    }
  }
}
.tips{
    color: #ff4949;
}
</style>

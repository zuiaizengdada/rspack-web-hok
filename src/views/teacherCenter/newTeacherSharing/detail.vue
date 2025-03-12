<template>
  <formPage
    v-loading="loading"
    title="师资共享"
    sub-title="师资详情"
    @click="handleHomePage"
  >
    <div class="content">
      <MTitle title="师资档案" />
      <div class="userFile">
        <div class="userImage">
          <ImagePreviewer
            :preview-src-list="[detail.photoUrl]"
            fit="contain"
            :src="detail.photoUrl"
            style="width: 100%; height: 100%"
            :scale-width="140"
            :scale-height="160"
          />
        </div>
        <div class="userInfo">
          <div class="userName">{{ detail.teacherName }}</div>
          <div class="userDetail">
            <div class="userForm">
              <span class="formLabel">主页链接：</span>
              <el-link v-if="detail.homepageLink" type="primary" @click="handleOpen">点击查看</el-link>
              <span v-else class="formValue">暂无</span>
            </div>
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
      <!-- <MTitle title="服务企业" />
      <div class="org">
        <div v-html="detail.serviceEnterprise" />
      </div>
      <MTitle title="过往课题" />
      <div class="pastSubject">
        <div v-html="detail.courseware" />
      </div> -->
      <MTitle title="IP视频" />
      <div class="tearchVideo">
        <div class="tearchVideoBox">
          <div v-for="(item, index) in detail.videoList" :key="index" class="tearchVideoView">
            <template v-if="(item.type === 3 && [5, 4].includes(item.platform)) || item.type === 1">
              <videoShow :url="item.url" />
            </template>
            <template v-else>
              <urlShow :url="item.url" />
            </template>
          </div>
        </div>
        <!-- <div v-for="(item, index) in linkUrls" :key="index">
          <span class="tearchVideoLabel">网页地址：</span>
          <span class="tearchVideoValue a_link" @click="openNewWindow(item)">
            <template v-if="item.length < 30">
              {{ item }}
            </template>
            <template v-else>
              {{ item.substring(0,30) + '...' }}
            </template>
          </span>
          <el-tooltip class="item" effect="dark" content="点此复制" placement="top-start">
            <span v-clipboard:copy="item" v-clipboard:success="clipboardSuccess">
              <svg-icon icon-class="fuzhi" class="a_link" />
            </span>
          </el-tooltip>
        </div> -->
      </div>
      <MTitle title="IP评估" />
      <div class="assess">
        <div class="assessForm">
          <span class="formLabel">是否需要评估:</span>
          <span class="formValue">
            {{ {1:'是',0:'否'}[detail.assessFlag] }}
          </span>
        </div>
        <template v-if="detail.assessFlag === 1">
          <div class="assessForm">
            <span class="formLabel">参与评估人员:</span>
            <span v-if="detail.assessUsers" class="formValue">
              {{ detail.assessUsers.join('，') }}
            </span>
          </div>
          <div class="assessForm">
            <span class="formLabel">截止评估时间:</span>
            <span class="formValue">{{
              parseTime(
                new Date(detail.expiresDate).getTime(),
                '{y}-{m}-{d} {h}:{i}:{s}'
              ) || '—'
            }}</span>
          </div>
        </template>
        <div v-if="detail.assessFlag === 0" class="assessForm">
          <span class="formLabel">无需评估结果:</span>
          <span class="formValue">{{ detail.mergeResult | getOptionsValue(ASSESS_RESULT_OTHER) }}</span>
        </div>
        <div class="assessForm">
          <span class="formLabel">IP推荐人:</span>
          <span class="formValue">{{ detail.recommendName }}</span>
        </div>
      </div>

      <MTitle v-show="tableData.length" title="跟进记录" />
      <div v-show="tableData.length" class="assess">
        <followTable ref="followTable" v-model="tableData" />
      </div>
      <MTitle v-show="transferTableList.length" title="转让记录" />
      <div v-show="transferTableList.length" class="assess">
        <transferTable ref="transferTable" v-model="transferTableList" />
      </div>
      <MTitle title="其他" />
      <div class="assess">
        <template>
          <div class="assessForm">
            <span class="formLabel">创建人:</span>
            <span class="formValue">
              {{ detail.createUserName }}
            </span>
          </div>
          <div class="assessForm">
            <span class="formLabel">创建时间:</span>
            <span class="formValue">{{
              parseTime(
                new Date(detail.createTime).getTime(),
                '{y}-{m}-{d} {h}:{i}:{s}'
              ) || '—'
            }}</span>
          </div>
          <div v-if="detail.updateUser" class="assessForm">
            <span class="formLabel">修改人:</span>
            <span class="formValue">{{ detail.updateUser }}</span>
          </div>
          <div v-if="detail.updateTime && detail.updateUser" class="assessForm">
            <span class="formLabel">修改时间:</span>
            <span class="formValue">{{
              parseTime(
                new Date(detail.updateTime).getTime(),
                '{y}-{m}-{d} {h}:{i}:{s}'
              ) || '—'
            }}</span>
          </div>
        </template>
      </div>
    </div>

    <div class="footer">
      <el-button size="small" @click="goBack">返回</el-button>
    </div>
  </formPage>
</template>

<script>
import { teacherTransferList } from '@/api/tearchCenter/index'
import formPage from '../components/formPage'
import clipboard from '@/directive/clipboard/index.js'
import { teacherSharingNewDetail } from '@/api/tearchCenter/tearchSharing'
import videoShow from '../components/videoShow.vue'
import urlShow from '../components/urlShow.vue'
import { ASSESS_RESULT_OTHER } from '../enum'
import followTable from './table'
import transferTable from './transferTable.vue'
import { parseTime } from '@/utils/index'
export default {
  directives: {
    clipboard
  },
  components: {
    formPage,
    videoShow,
    urlShow,
    followTable,
    transferTable
  },
  data() {
    return {
      ASSESS_RESULT_OTHER,
      loading: false,
      tableData: [],
      transferTableList: [],
      detail: {
        teacherId: '',
        teacherName: '',
        photoUrl: '',
        domains: '', // 所属领域
        experience: '', // IP资质
        courseware: '', // 过往课题
        serviceEnterprise: '', // 服务企业
        videoList: [],
        httpList: [],
        assessFlag: '',
        mergeResult: '',
        recommendName: '',
        assessUsers: [], // 参与评估人员列表
        expiresDate: '', // 评估截止时间
        assessDisable: false, // 是否禁用评估按钮true显示 false 不显示
        operateName: '',
        operateTime: '',
        homepageLink: '',
        createUser: '',
        createTime: '',
        updateUser: '',
        updateTime: ''
      },
      ASSESS_RESULT: [
        { label: '博商在做', value: 5 },
        { label: '对手在做', value: 6 },
        { label: '不考虑合作', value: 7 },
        { label: '不符合', value: 8 },
        { label: '黑名单', value: 9 },
        { label: '合作失败', value: 10 },
        { label: '其他', value: 11 }
      ],
      linkUrls: []
    }
  },
  created() {
    this.detail.teacherId = this.$route.params.id
    this.getDetail()
    this.getTransferTableList()
  },
  mounted() {},
  methods: {
    parseTime,
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    // 点击返回
    goBack() {
      this.$router.back()
    },
    handleHomePage() {
      this.$router.push('/teacherCenter/newTeacherSharing/list')
    },
    handleOpen() {
      window.open(this.detail.homepageLink)
    },
    // 获取师资档案详情
    getDetail() {
      this.loading = true
      const params = {
        teacherId: this.detail.teacherId
      }
      teacherSharingNewDetail(params)
        .then((res) => {
          if (res.data.domains && res.data.domains.length > 0) {
            this.detail.domains = res.data.domains.map((v) => v.domainName).join(' ')
          }
          this.tableData = res.data.followLogList
          this.detail = {
            teacherId: this.$route.params.id,
            teacherName: res.data.teacherName,
            photoUrl: res.data.photoUrl,
            domains: this.detail.domains, // 所属领域
            experience: res.data.experience?.replace(/\n/g, '<br />'), // IP资质
            courseware: res.data.courseware?.replace(/\n/g, '<br />'), // 过往课题
            serviceEnterprise: res.data.serviceEnterprise?.replace(/\n/g, '<br />'), // 服务企业
            videoList: res.data.teacherArchivesMediaDoList,
            assessFlag: res.data.assessFlag,
            assessUsers: res.data.assessUserNameList, // 参与评估人员列表
            expiresDate: res.data.expiresDate, // 评估截止时间
            assessDisable: res.data.assessDisable, // 是否禁用评估按钮
            recommendName: res.data.recommendName,
            mergeResult: res.data.archivesAssessResult,
            operateName: res.data.operateName,
            operateTime: res.data.operateTime,
            homepageLink: res.data.homepageLink,
            createUser: res.data.createUser,
            createTime: res.data.createTime,
            updateUser: res.data.updateUserName,
            updateTime: res.data.updateTime,
            createUserName: res.data.createUserName
          }
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },

    async getTransferTableList() {
      await teacherTransferList({
        teacherId: this.detail.teacherId
      }).then(res => {
        this.transferTableList = res.data
      })
    },
    // 点击打开新页面
    openNewWindow(item) {
      if (item.substr(0, 7).toLowerCase() === 'http://' || item.substr(0, 8).toLowerCase() === 'https://') {
        return window.open(item, '_blank')
      } else {
        return window.open('http://' + item, '_blank')
      }
    },
    // 点击跳转评估页面
    gotoAssess() {
      this.$router.push(`/teacherCenter/teacherAssessment/assess/${this.$route.params.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 20px;
  .userFile {
    margin-top: 8px;
    border-top: 1px solid #eff2f6;
    padding-top: 39px;
    padding-bottom: 32px;
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
      .userDetail {
        margin-top: 16px;
        .userForm {
          display: flex;
          margin-bottom: 16px;
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
    padding-bottom: 32px;
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
      margin-top: 32px;
    }
  }
}
.footer {
  margin-top: 4px;
  text-align: center;
}
</style>

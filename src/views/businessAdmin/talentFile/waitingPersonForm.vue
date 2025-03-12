<template>
  <div :style="{ height, overflow: 'auto' }">
    <div id="waitingPersonForm">
      <!--StartFragment-->
      <div class="waitingPersonForm-view">
        <waitingPersonFormCard title="个人资料" class="m_b_20">
          <div class="personalInfo-container">
            <div class="personalInfo-avatar">
              <AppAvatar
                class="header-avatar"
                width="100"
                :avatar="personalDataVo.avatar"
                :no-name="true"
                v-if="personalDataVo.avatar"
              />
              <div class="emptyAvatar" v-else>
                <img :src="emptyAvatarPng" />
              </div>
            </div>
            <div class="personalInfo-content">
              <div class="personalInfo-content-view1">
                <span style="width: 120px">
                  <span class="c_F1330D">*</span
                  ><span class="c_666">姓名</span>&nbsp;&nbsp;{{
                    personalDataVo.name
                  }}
                </span>
                <span style="width: 200px">
                  <span class="c_F1330D">*</span
                  ><span class="c_666">出生年月</span>&nbsp;&nbsp;{{
                    getTime(personalDataVo.birthday, '.', '.', '')
                  }}
                </span>
                <span style="width: 190px"
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">籍贯</span>&nbsp;&nbsp;{{
                    personalDataVo.provinceName + personalDataVo.cityName
                  }}
                </span>
                <span style="width: 250px"
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">身份证号码</span>&nbsp;&nbsp;{{
                    personalDataVo.idCard
                  }}
                </span>
                <span style="width: 220px"
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">专业</span>&nbsp;&nbsp;{{
                    personalDataVo.major
                  }}
                </span>
              </div>
              <div class="personalInfo-content-view2">
                <span style="width: 120px">
                  <span class="c_F1330D">*</span
                  ><span class="c_666">最高学历</span>&nbsp;&nbsp;{{
                    educationTypeMap.get(parseInt(personalDataVo.education))
                  }}
                </span>
                <span style="width: 200px"
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">联系电话</span>&nbsp;&nbsp;{{
                    personalDataVo.phone
                  }}
                </span>
                <span style="width: 190px"
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">婚姻状态</span>&nbsp;&nbsp;{{
                    maritalStatusType.get(personalDataVo.maritalStatus)
                  }}
                </span>
                <span style="width: 250px"
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">毕业院校</span>&nbsp;&nbsp;{{
                    personalDataVo.graduateSchool
                  }}
                </span>
                <span style="width: 220px"
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">邮箱</span>&nbsp;&nbsp;{{
                    personalDataVo.email
                  }}
                </span>
              </div>
              <div class="personalInfo-content-view3">
                <span
                  ><span class="c_F1330D">*</span
                  ><span class="c_666"
                    >家庭地址（用于定期寄送公司礼物，请详细填写）</span
                  >&nbsp;&nbsp;{{ personalDataVo.homeAddress }}</span
                >
              </div>
              <div class="personalInfo-content-view4">
                <span
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">现住联系地址</span>&nbsp;&nbsp;{{
                    personalDataVo.address
                  }}
                </span>
                <span v-if="personalDataVo.sex !== 0" style="width: 135px"
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">是否怀孕</span>&nbsp;&nbsp;{{
                    sureType.get(personalDataVo.pregnant)
                  }}
                </span>
              </div>
              <div class="personalInfo-content-view5">
                <span
                  ><span class="c_F1330D">*</span
                  ><span class="c_666">最紧急联系人姓名/联系方式</span
                  >&nbsp;&nbsp; {{ personalDataVo.emergencyContact }}/{{
                    personalDataVo.emergencyContactPhone
                  }}
                </span>
                <span style="width: 145px">
                  <span class="c_F1330D">*</span
                  ><span class="c_666">与本人关系</span>&nbsp;&nbsp;
                  {{
                    relationshipType.get(
                      personalDataVo.emergencyContactRelationship
                    )
                  }}
                </span>
              </div>
            </div>
          </div>
        </waitingPersonFormCard>
        <waitingPersonFormCard
          title="直系亲属"
          titleColor="#E2E2ED"
          class="m_b_20"
        >
          <baseTable
            key="personnelKinshipList"
            class="waitingPersonFormTable"
            :table-data="detailBaseInfo.personnelKinshipList"
            :table-columns="familyConfig.tableColumns"
          ></baseTable>
        </waitingPersonFormCard>
        <waitingPersonFormCard title="工作经历" class="m_b_20">
          <baseTable
            key="workExperienceList"
            class="waitingPersonFormTable"
            :table-data="detailBaseInfo.workExperienceList"
            :table-columns="workConfig.tableColumns"
          ></baseTable>
        </waitingPersonFormCard>
        <waitingPersonFormCard title="学历" class="m_b_20" titleColor="#E2E2ED">
          <baseTable
            class="waitingPersonFormTable"
            key="educationExperienceList"
            :table-data="detailBaseInfo.educationExperienceList"
            :table-columns="getEducationColumns.tableColumns"
          ></baseTable>
        </waitingPersonFormCard>
        <waitingPersonFormCard title="自我评价" class="m_b_20">
          <el-form class="evaluateInfo-form" label-width="110px">
            <el-form-item label="优点及不足" class="form-item">
              <div>{{ personnelSelfEvaluation.advantages }}</div>
            </el-form-item>
            <el-form-item label="兴趣爱好" class="form-item">
              <div>{{ personnelSelfEvaluation.interests }}</div>
            </el-form-item>
            <el-form-item label="工作目标" class="form-item">
              <div>{{ personnelSelfEvaluation.workTarget }}</div>
            </el-form-item>
            <el-form-item label="刑事记录" class="form-item">
              <div>
                {{ hasType.get(personnelSelfEvaluation.criminalRecord) }}
              </div>
            </el-form-item>
            <el-form-item label="健康状况" class="form-item">
              <div v-if="[1, 2].includes(personnelSelfEvaluation.healthStatus)">
                {{ healthStatusType.get(personnelSelfEvaluation.healthStatus) }}
              </div>
              <div v-else>
                {{ personnelSelfEvaluation.healthStatusRemark }}
              </div>
            </el-form-item>
          </el-form>
        </waitingPersonFormCard>
        <div class="promise-text m_b_40">
          承诺：兹同意受聘以后，若发现以上资料有虚构或捏造事实情由，本人接受即时解雇而无任何赔偿的处理。
        </div>
        <div class="promise-container promise-text">
          <div class="promise-signatureUrl">
            <span>承诺人签名</span
            ><img
              crossorigin="anonymous"
              style="width: 100px"
              :src="detailBaseInfo.personnelSelfEvaluation.signatureUrl"
              alt="无法显示"
            />
          </div>
          <div>
            入职日期：{{
              getTime(detailBaseInfo.personalDataVo.entryTime, '年', '月', '日')
            }}
          </div>
        </div>
        <div class="remarks promise-text">
          备注:1、＊项为必填项；2、现行联系地址即为有效联系地址，如有变更，本人应在三日内以书面形式通知人力资源部，否则视为未变更，即为有效送达。
        </div>
        <div class="t_a_r">
          保管期限：<span class="c_F1330D">员工离职后三年</span>
        </div>
        <!--EndFragment-->
      </div>
    </div>
    <div class="button-box" v-if="canDown">
      <el-button
        type="primary"
        size="default"
        @click="capture"
        :loading="loading"
        >下 载</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { onboardingRegistrationBaseInfoVoAjax } from '@/api/businessAdmin/talentFile'
import waitingPersonFormCard from './waitingPersonFormCard'
import html2canvas from 'html2canvas'
import './html2canvas'
import moment from 'moment'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import baseTable from './components/personDetails/baseTable.vue'
import emptyAvatarPng from '@/assets/image/oa/emptyAvatar.png'
import {
  getFamilyColumns,
  getWorkColumns,
  relationshipType,
  getEducationColumns,
  sureType,
  hasType,
  maritalStatusType,
  educationTypeMap,
  healthStatusType
} from './options'
export default {
  components: {
    waitingPersonFormCard,
    AppAvatar,
    baseTable
  },
  props: {
    personnelInfoId: {
      type: String,
      default: ''
    },
    canDown: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '700px'
    }
  },
  data() {
    return {
      detailBaseInfo: {
        personnelKinshipList: [],
        workExperienceList: [],
        educationExperienceList: [],
        personnelSelfEvaluation: {},
        personalDataVo: {}
      },
      familyConfig: {
        tableColumns: getFamilyColumns.call(this)
      },
      workConfig: {
        tableColumns: getWorkColumns.call(this)
      },
      getEducationColumns: {
        tableColumns: getEducationColumns.call(this)
      },
      maritalStatusType,
      educationTypeMap,
      sureType,
      relationshipType,
      emptyAvatarPng,
      healthStatusType,
      hasType,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    personnelSelfEvaluation() {
      return this.detailBaseInfo.personnelSelfEvaluation
    },
    personalDataVo() {
      return this.detailBaseInfo.personalDataVo
    }
  },
  mounted() {
    this.getRegistrationBaseInfo(this.personnelInfoId)
  },
  methods: {
    capture() {
      // 获取要转换的 HTML 元素
      this.loading = true

      const element = document.getElementById('waitingPersonForm')
      // 使用 html2canvas 将元素转换为 canvas
      setTimeout(() => {
        html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          scale: 2
        })
          .then(canvas => {
            // 创建一个图片对象并设置图片数据为 canvas 的数据
            const imgData = canvas.toDataURL('image/png')

            // 创建一个链接元素并设置下载属性，将图片数据链接赋值给 href
            const link = document.createElement('a')
            link.download = '入职登记表.png'
            link.href = imgData

            // 将链接元素插入到文档中并触发点击
            document.body.appendChild(link)
            link.click()

            // 删除链接元素
            document.body.removeChild(link)
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }, 100)
    },
    isArbitration(val) {
      return this.detailBaseInfo.arbitrationList
        ? this.detailBaseInfo.arbitrationList.includes(val)
        : false
    },
    getTime(time, x, y, z) {
      return time ? moment(time).format(`YYYY${x}MM${y}DD${z}`) : ''
    },
    async getRegistrationBaseInfo(personnelInfoId) {
      const params = {
        personnelInfoId: personnelInfoId || this.$route.query.personnelInfoId
      }

      const res = await onboardingRegistrationBaseInfoVoAjax(params)
      this.detailBaseInfo = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.button-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.personalInfo-container {
  display: flex;
  padding: 20px 0 18px 20px;
  height: 248px;
  background: #fff;
  position: relative;
  border-radius: 10px;
  justify-content: space-between;
  width: 100%;
  // margin-bottom: 16px;
  font-size: 14px;
  .form-item {
    margin: 0;
  }
}
.personalInfo-avatar {
}
.personalInfo-content {
  display: flex;
  width: calc(100% - 120px);
  flex-direction: column;
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
  }
  .personalInfo-content-view1,
  .personalInfo-content-view2,
  .personalInfo-content-view4,
  .personalInfo-content-view5 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .personalInfo-content-view4 {
    padding-right: 78px;
  }
  .personalInfo-content-view5 {
    padding-right: 68px;
  }
}

.m_b_20 {
  margin-bottom: 20px;
}
.m_b_10 {
  margin-bottom: 10px;
}
.m_b_40 {
  margin-bottom: 40px;
}
.promise-text {
  color: #666666;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}
.promise-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  .promise-signatureUrl {
    display: flex;
    align-items: center;
  }
}
.remarks {
  background: #e2e2ed;
  border-radius: 6px;
  height: 44px;
  line-height: 44px;
  margin-bottom: 10px;
}
.t_a_r {
  text-align: right;
  padding-bottom: 10px;
}
.emptyAvatar {
  width: 100px;
  height: 100px;
  background: #e8e8e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  img {
    width: 58px;
    height: 58px;
    opacity: 0.6;
  }
}
.c_F1330D {
  color: #f1330d;
}
.evaluateInfo-form {
  .form-item {
    margin-bottom: 10px;
  }
}
.c_666 {
  color: #666;
}
//固定高度防止截图时被遮
.waitingPersonFormTable {
  margin: 0;
  height: 204px;
}
.waitingPersonFormTable ::v-deep thead th {
  padding: 0;
}
.waitingPersonFormTable ::v-deep thead .cell {
  height: 40px;
  line-height: 40px;
}
.waitingPersonFormTable ::v-deep tbody td {
  padding: 0;
}
.waitingPersonFormTable ::v-deep tbody tr .base-table-item .text_hidden {
  height: 54px;
  line-height: 54px;
}
::v-deep .el-form-item__label {
  color: #666;
  font-weight: 400;
  font-family: '微软雅黑';
}
</style>

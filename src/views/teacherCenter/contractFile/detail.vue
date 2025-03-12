<template>
  <formPage title="合同档案" sub-title="合同详情" @click="$router.push('/teacherCenter/contractFile/list')">
    <div class="content">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同主体：" prop="name">
              <span class="tips">{{ form.contractSubject || '——' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型：" prop="name">
              <span class="tips">{{ form.contractType | getOptionsValue(CONTRACT_TYPE) }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="合作方式：" prop="name">
              <span class="tips">{{ form.contractCategory | getOptionsValue(CONTRACT_CATEGORY) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称：" prop="name">
              <span class="tips">{{ form.contractName || '——' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="甲方单位名称：" prop="name">
              <span class="tips">{{ form.companyPartOne || '——' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="甲方经办人：" prop="name">
              <span class="tips">{{ form.companyPartOneOperator || '——' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="乙方单位名称：" prop="name">
              <span class="tips">{{ form.companyPartTwo || '——' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乙方经办人：" prop="name">
              <span class="tips">{{ form.companyPartTwoOperator || '——' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="丙方单位名称：" prop="name">
              <span class="tips">{{ form.companyPartThree || '——' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="丙方经办人：" prop="name">
              <span class="tips">{{ form.companyPartThreeOperator || '——' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="单位合作模式：" prop="name">
            <div class="tips text-name" v-html="form.cooperativeSharingModel.replace(/\n/g, '<br />')" />
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="IP姓名：" prop="name">
              <span class="tips">{{ form.teacherName || '——' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP联系方式" prop="name">
              <span class="tips">{{ form.teacherPhoneNumber || '——' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="IP身份证号：" prop="name">
              <span class="tips">{{ form.teacherIdentityNumber || '——' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同状态：" prop="name">
              <span class="tips">{{ form.contractState | getOptionsValue(CONTRACT_STATE) }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="合同开始日期：" prop="name">
              <span class="tips">{{ form.contractStartTime | parseTime('{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同结束日期：" prop="name">
              <span class="tips">{{ form.contractEndTime | parseTime('{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="合同年限：" prop="name">
              <span class="tips">{{ form.contractExpirationTime || '——' }}月</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算周期：" prop="name">
              <span class="tips">{{ form.settlementInterval | getOptionsValue(SETTLEMENT_INTERVAL) }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="合同电子附件：" prop="teacherContractMediaList">
            <!-- 电子附件 -->
            <div class="teacherContractMediaList">
              <div v-for="(item, index) in form.teacherContractMediaList" :key="index">
                <imgShow :url="item.fileUrl" />
              </div>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建人：" prop="createName">
              <span class="tips">{{ form.createName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：" prop="createTime">
              <span class="tips">{{ form.createTime | parseTime('{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改人：" prop="updateName">
              <span class="tips">{{ form.updateName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改时间：" prop="updateTime">
              <span class="tips">{{ form.updateTime | parseTime('{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-button size="small" type="primary" @click="goBack()">返回</el-button>
      <el-button
        v-if="!form.contractTerminateTime && (form.contractState === 1 || form.contractState === 0)"
        v-permission="['web:contractDetailt:remove', permsList]"
        size="small"
        type="danger"
        plain
        @click="rescind()"
      >
        解除合同
      </el-button>
      <el-button v-if="form.contractTerminateTime" size="small" plain @click="openRescind()">解除合同详情</el-button>
    </div>

    <rescindModel :config="rescindDialog" />
  </formPage>
</template>

<script>
import formPage from '../components/formPage'
import { CONTRACT_TYPE, SETTLEMENT_INTERVAL, CONTRACT_CATEGORY, CONTRACT_STATE } from '../enum'
import rescindModel from './rescindModel.vue'
import { getTeacherContractDetail } from '@/api/tearchCenter'
import imgShow from '../components/imgShow.vue'
export default {
  components: {
    formPage,
    rescindModel,
    imgShow
  },
  data() {
    return {
      CONTRACT_TYPE,
      SETTLEMENT_INTERVAL,
      CONTRACT_CATEGORY,
      CONTRACT_STATE,
      form: {
        companyPartOne: '', // 甲方单位名称
        companyPartOneOperator: '', // 甲方经办人
        companyPartThree: '', // 丙方单位名称
        companyPartThreeOperator: '', // 丙方经办人
        companyPartTwo: '', // 乙方单位名称
        companyPartTwoOperator: '', // 乙方经办人
        contractCategory: 0, // 合同类别 0[IP流量+课程类] 1[IP流量类] 2[课程合作类]
        contractCode: '', // 合同编码
        contractEndTime: '', // 合同到期日期
        contractExpirationTime: '', // 合同年限 单位月
        contractName: '', // 合同名称
        contractStartTime: '', // 合同开始日期
        contractState: 0, // 合同状态 0[无效合同] 1[有效合同] 2[合同到期] 4[合同解除]
        contractSubject: '', // 合同主体
        CONTRACT_TYPE: 0, // 0新签 1续签
        cooperativeSharingModel: '', // 单位合作模式
        settlementInterval: 0, // 结算同期 0月结 1季结 2年结
        teacherIdentityNumber: '', // 老师身份证号
        teacherId: '', // 老师ID
        teacherName: '', // 老师姓名
        teacherPhoneNumber: '', // 老师联系方式
        contractTerminateTime: '', // 判断解除合同
        teacherContractMediaList: [],
        createName: '',
        createTime: '',
        updateName: '',
        updateTime: ''
      },
      rules: {},
      // 解除合同弹框对象
      rescindDialog: {
        visible: false,
        contractCode: ''
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  activated() {
    this.getDetail()
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    // 点击返回
    goBack() {
      // this.$router.back()
      if (window.history.length <= 1) {
        this.$router.push(`/teacherCenter/contractFile/list`)
      } else {
        this.$router.go(-1)
      }
    },
    // 点击解除合同
    rescind() {
      this.$router.push(
        `/teacherCenter/contractFile/rescind/123456?tearchName=${this.form.teacherName}&teacherId=${this.form.teacherId}&contractCode=${this.$route.params.id}&contractEndTime=${this.form.contractEndTime}`
      )
    },
    // 点击打开解除合同详情
    openRescind() {
      this.rescindDialog = {
        visible: true,
        contractCode: this.$route.params.id
      }
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      const params = {
        contractCode: this.$route.params.id
      }
      getTeacherContractDetail(params)
        .then((res) => {
          this.loading = false
          this.form = res.data
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 19px;
}
.footer {
  margin-top: 56px;
  text-align: center;
}
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.teacherContractMediaVos {
  display: flex;
  flex-wrap: wrap;
}
.teacherContractMediaList {
  display: flex;
  flex-wrap: wrap;
  width: 800px;
}
.text-name{
  word-break: break-all;
}
</style>

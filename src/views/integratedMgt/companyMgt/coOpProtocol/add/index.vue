<template>
  <div class="audit-cnt" :loading="loading">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="gray">
        <span @click="goBack">合作协议</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{ htId ? '编辑' : '新增' }}合作协议
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="audit-main">
      <el-form
        ref="coOpProtocolAddRef"
        class="hok-form"
        :model="reqform"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="协议名称" prop="agreementName">
          <el-input
            v-model="reqform.agreementName"
            maxlength="50"
            show-word-limit
            clearable
            type="text"
            placeholder="请输入协议名称"
          />
        </el-form-item>
        <el-form-item label="合作机构" prop="cpOrgId">
          <el-select
            v-model="reqform.cpOrgId"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="请搜索合作机构"
            :remote-method="orgRemoteMethod"
            :loading="orgLoading"
          >
            <el-option
              v-for="item in cpOrgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId"
            />
          </el-select>
          <!-- <el-select
            v-model="reqform.cpOrgId"
            filterable
            placeholder="请选择合作机构"
          >
            <el-option
              v-for="item in cpOrgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="合作范围" prop="coopScopeList">
          <ProtocolRange ref="rangRef" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="reqform.startDate"
            style="width: 224px"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerStartTimeOptions"
          />
        </el-form-item>
        <el-form-item label="到期日期" prop="endDate">
          <el-date-picker
            v-model="reqform.endDate"
            style="width: 224px"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerEndTimeOptions"
          />
        </el-form-item>
        <el-form-item
          v-if="!htId || (htId && isShow)"
          label="上传附件"
          prop="attachment"
        >
          <!-- 电子附件 -->
          <upload
            ref="upload"
            :files="reqform.attachment"
            style="width: 717px"
            :max-show-length="20"
            @change="fileChange"
          />
          <div class="tips">
            注：图片文件jpg,png格式 大小限10M以内，PDF文件50M以内
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-box flex flex-center flex-middle">
      <el-button
        v-if="htId"
        type="danger"
        size="small"
        :loading="btnloading"
        @click="del"
      >
        删除
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="btnloading"
        @click="onSubmit"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  agreementAcceptAddApi,
  agreementDetailApi,
  getOrgListApi,
  agreementDeleteApi,
  agreementEditApi
} from '@/api/coOpProtocol'

import { cloneDeep } from 'lodash'

import ProtocolRange from './cpns/range.vue'
import Upload from './cpns/upload.vue'
export default {
  name: 'CoOpProtocolAdd',
  components: {
    ProtocolRange,
    Upload
  },
  data() {
    const validateEndTime = (rule, value, callback) => {
      if (value && this.reqform.startDate) {
        if (
          new Date(value).getTime() <=
          new Date(this.reqform.startDate).getTime()
        ) {
          callback(new Error('协议到期日期不能小于协议开始日期!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateStartTime = (rule, value, callback) => {
      if (value && this.reqform.endDate) {
        if (
          new Date(value).getTime() >= new Date(this.reqform.endDate).getTime()
        ) {
          callback(new Error('协议开始日期不能大于协议到期日期!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      loading: false,
      btnloading: false,
      htId: null,
      isShow: false, // 编辑需要控制上传附件 加载时机
      reqform: {
        agreementName: '', // 协议名称
        cpOrgId: '', // 合作机构
        startDate: '', // 协议开始日期
        endDate: '', // 结束日期
        coopScopeList: [], // 合作范围
        attachment: [] // 附件
      },

      // 合作机构相关
      orgLoading: false,
      cpOrgList: [],

      pickerStartTimeOptions: {
        disabledDate: time => {
          return this.pickerStartTime(time)
        }
      },
      pickerEndTimeOptions: {
        disabledDate: time => {
          return this.pickerEndTime(time)
        }
      },
      rules: {
        agreementName: [
          { required: true, message: '请输入协议名称', trigger: 'blur' }
        ],
        cpOrgId: [
          { required: true, message: '请选择合作机构', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择协议开始日期', trigger: 'blur' },
          {
            validator: validateStartTime,
            trigger: 'blur',
            message: '协议开始日期不能大于到期日期'
          }
        ],
        endDate: [
          { required: true, message: '请选择协议到期日期', trigger: 'blur' },
          {
            validator: validateEndTime,
            trigger: 'blur',
            message: '协议到期日期不能小于开始日期'
          }
        ],
        coopScopeList: [
          {
            type: 'array',
            required: true,
            message: '请选择合作范围',
            trigger: 'blur'
          }
        ],
        attachment: [{ required: true, message: '请上传附件', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      document.title = ' 编辑合作协议'
    } else {
      document.title = ' 新增合作协议'
    }
  },
  async mounted() {
    if (this.$route.query && this.$route.query.id) {
      this.htId = this.$route.query.id
      await this.agreementDetail(this.htId)
    }
  },
  methods: {
    async orgRemoteMethod(orgName) {
      if (orgName !== '') {
        this.orgLoading = true
        try {
          const { data } = await getOrgListApi({ orgName })
          this.cpOrgList = data || []
        } catch (error) {
          console.log('error-------getOrgListApi', error)
        }
        this.orgLoading = false
      } else {
        this.options = []
      }
    },

    // 合同日期处理
    pickerStartTime(time) {
      // 将日期减去1天
      if (!this.reqform.endDate) {
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - 1)
        return time.getTime() <= currentDate.getTime()
      } else {
        return time.getTime() <= new Date(this.reqform.endDate).getTime()
      }
    },
    pickerEndTime(time) {
      if (!this.reqform.startDate) {
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - 1)
        return time.getTime() <= currentDate.getTime()
      } else {
        return time.getTime() <= new Date(this.reqform.startDate).getTime()
      }
    },
    fileChange(fileList) {
      const teacherContractMediaList = []
      fileList.map(v => {
        if (v.photoUrl) {
          teacherContractMediaList.push({
            fileType: 1,
            fileUrl: v.photoUrl
          })
        }
      })
      this.reqform.attachment = teacherContractMediaList
      this.$refs.coOpProtocolAddRef.clearValidate('attachment')
    },
    // 查询详情内容
    async agreementDetail(id) {
      this.loading = true
      try {
        const { data } = await agreementDetailApi({ id })
        if (data.cpOrgName) {
          await this.orgRemoteMethod(data.cpOrgName)
        }
        this.$refs.rangRef.setRange(data.agreementCoopScopeList) // 设置范围的值
        this.reqform = {
          agreementName: data.agreementName || '',
          cpOrgId: data.cpOrgId || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          coopScopeList: data.agreementCoopScopeList || [],
          attachment: data.attachment?.filter(f => f.fileUrl) || []
        }
        if (data.cpOrgName) {
          await this.orgRemoteMethod(data.cpOrgName)
        }
        this.$nextTick(() => (this.isShow = true))
      } catch (error) {
        console.log('error-------agreementDetailApi', error)
      }
      this.loading = true
    },
    onSubmit() {
      // 获取范围值
      this.reqform.coopScopeList = this.$refs.rangRef.getRange()
      this.$refs.coOpProtocolAddRef.validate(async flag => {
        if (!flag) return
        this.loading = true
        this.btnloading = true
        try {
          const req = cloneDeep(this.reqform)
          let result = {}
          if (this.htId) {
            // 编辑
            req.id = this.htId
            result = await agreementEditApi(req)
          } else {
            // 新增
            result = await agreementAcceptAddApi(req)
          }

          if (result && result.success) {
            this.$message.success({
              message: '已保存',
              customClass: 'amap-sug-result'
            })
            this.btnloading = false
            this.goBack()
          } else {
            this.btnloading = false
          }
        } catch (error) {
          this.btnloading = false
          console.log('error----agreementAcceptAddApi', error)
        }
        this.loading = false
      })
    },
    // 删除协议
    del() {
      this.$delModal({
        tips: `确认删除该协议吗？`,
        success: async () => {
          this.loading = true
          try {
            const res = await agreementDeleteApi({ id: this.htId })
            if (res.success) {
              this.$message.success({
                message: '已删除',
                customClass: 'amap-sug-result'
              })
              setTimeout(() => {
                this.goBack()
              }, 1000)
            }
          } catch (error) {
            this.$message.error('删除协议失败')
          }
          this.loading = true
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: #ff2020;
}
@import '~@/styles/variables.scss';
.audit-cnt {
  @include responsive-height(20px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  .header-left {
    div {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
      padding-right: 32px;
    }
  }
  .breadcrumb {
    height: 48px;
    border-bottom: 1px solid #dfe4ed;
    padding: 0 20px;
    ::v-deep .el-breadcrumb__inner {
      font-size: 15px;
      font-weight: 500;
      line-height: 48px;
      color: #000;
    }
    .gray {
      ::v-deep .el-breadcrumb__inner {
        color: #777777;
        cursor: pointer;
      }
    }
  }
  .audit-main {
  @include responsive-height(132px);
    overflow-y: auto;
    ::v-deep .el-form-item__content {
      width: 660px;
      .el-select {
        width: 100%;
      }
    }
    padding: 20px;
  }
  .btn-box {
    height: 64px;
    box-shadow: 0 -2px 10px 0 #0000000d;
  }
  .tips {
    color: #777777;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
  }
}
::v-deep .hok-form {
  .el-form-item__label {
    color: #333333;
  }
  .el-form-item {
    margin-bottom: 26px;
  }
}
</style>

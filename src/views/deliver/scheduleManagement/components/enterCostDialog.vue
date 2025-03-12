<template>
  <!-- 录入成本弹框 -->
  <AppDialog
    v-model="config.visible"
    title="录入成本"
    width="916px"
    height="355px"
  >
    <div class="enterCost overflowOuto">
      <div v-if="form.undeliveredUserNameList && form.undeliveredUserNameList.length > 0" class="tips">提示：班期中尚有学员({{ form.undeliveredUserNameList | filterUserName }})尚未正常交付，请根据学员实际情况正常交付或延期交付或关闭交付</div>
      <el-form ref="ruleForm" :inline="true" :model="form" :rules="rules" label-width="115px" class="m-t-20" size="small">
        <el-form-item label="差旅费" prop="travelCost">
          <el-input v-model="form.travelCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('travelCost')" />
          元
        </el-form-item>
        <el-form-item label="场地费" prop="siteCost" class="m-l-80">
          <el-input v-model="form.siteCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('siteCost')" />
          元
        </el-form-item>
        <el-form-item label="会务服务费" prop="conferenceServiceCost">
          <el-input v-model="form.conferenceServiceCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('conferenceServiceCost')" />
          元
        </el-form-item>
        <el-form-item label="项目物料费" prop="projectMaterialCost" class="m-l-80">
          <el-input v-model="form.projectMaterialCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('projectMaterialCost')" />
          元
        </el-form-item>
        <el-form-item label="手续费" prop="commissionCost">
          <el-input v-model="form.commissionCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('commissionCost')" />
          元
        </el-form-item>
        <el-form-item label="固定人工费" prop="fixedLaborCost" class="m-l-80">
          <el-input v-model="form.fixedLaborCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('fixedLaborCost')" />
          元
        </el-form-item>
        <el-form-item label="渠道费" prop="channelCost">
          <el-input v-model="form.channelCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('channelCost')" />
          元
        </el-form-item>
        <el-form-item label="老师课酬费" prop="teacherSalaryCost" class="m-l-80">
          <el-input v-model="form.teacherSalaryCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('teacherSalaryCost')" />
          元
        </el-form-item>
        <el-form-item label="业务奖金/提成" prop="performanceCommissionCost">
          <el-input v-model="form.performanceCommissionCost" type="number" class="w-200" :min="0" :max="999999999999998" placeholder="请输入" @input="filterNumberAndDot('performanceCommissionCost')" />
          元
        </el-form-item>
        <el-form-item label="上传文件明细">
          <uploadView ref="uploadView" style="margin-top: 12px" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <div class="statistics">
        <span>总成本：</span>
        <span class="money">{{ total | filtersMoneyByZero }}元</span>
      </div>
      <el-button :disabled="form.undeliveredUserNameList && form.undeliveredUserNameList.length > 0" size="small" :loading="loading" type="primary" @click="sure">确定</el-button>
      <el-button size="small" :loading="loading" @click="onhandleCancel">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import BigNumber from 'bignumber.js'
import {
  // getDeliveryScheduleCost,
  getDeliveryScheduleRecordCost,
  getUndeliveredUserNameList
} from '@/api/deliver/scheduleManagement'
import uploadView from './upload.vue'
export default {
  components: {
    AppDialog,
    uploadView
  },
  filters: {
    filterUserName(val) {
      if (!val) {
        return ''
      } else {
        return val.join('/')
      }
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      console.log(value)
      if (value === '' || value === null) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        travelCost: '',
        siteCost: '',
        conferenceServiceCost: '',
        projectMaterialCost: '',
        commissionCost: '',
        fixedLaborCost: '',
        channelCost: '',
        teacherSalaryCost: '',
        performanceCommissionCost: '',
        undeliveredUserNameList: [],
        url: ''
      },
      rules: {
        travelCost: [{ validator: validatePass, required: true, message: '请输入的差旅费', trigger: 'blur' }],
        siteCost: [{ validator: validatePass, required: true, message: '请输入的场地费', trigger: 'blur' }],
        conferenceServiceCost: [{ validator: validatePass, required: true, message: '请输入的会务服务费', trigger: 'blur' }],
        projectMaterialCost: [{ validator: validatePass, required: true, message: '请输入的项目物料费', trigger: 'blur' }],
        commissionCost: [{ validator: validatePass, required: true, message: '请输入的手续费', trigger: 'blur' }],
        fixedLaborCost: [{ validator: validatePass, required: true, message: '请输入的固定人工费', trigger: 'blur' }],
        channelCost: [{ validator: validatePass, required: true, message: '请输入的渠道费', trigger: 'blur' }],
        teacherSalaryCost: [{ validator: validatePass, required: true, message: '请输入的老师课酬费', trigger: 'blur' }],
        performanceCommissionCost: [{ validator: validatePass, required: true, message: '请输入的业务奖金/提成', trigger: 'blur' }]
      }
    }
  },
  computed: {
    total() {
      let sum = 0
      for (const key in this.form) {
        key !== 'undeliveredUserNameList' && (sum = BigNumber(Number(this.form[key])).plus(sum))
      }
      return BigNumber(sum).times(100)
    }
  },
  watch: {
    'config.visible'(val) {
      this.$refs.uploadView && this.$refs.uploadView.setFileList([])
      if (val) {
        this.getDetail()
        // this.getUndeliveredUserNameList()
      } else {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.form = {
          travelCost: '',
          siteCost: '',
          conferenceServiceCost: '',
          projectMaterialCost: '',
          commissionCost: '',
          fixedLaborCost: '',
          channelCost: '',
          teacherSalaryCost: '',
          performanceCommissionCost: '',
          undeliveredUserNameList: [],
          url: ''
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 点击取消按钮
    onhandleCancel() {
      // this.$emit('close')
      this.config.visible = false
    },
    // 获取成本详情
    getDetail() {
      this.loading = true
      getUndeliveredUserNameList(this.config.scheduleId).then(res => {
        this.loading = false
        this.form = {
          travelCost: BigNumber(res.data.travelCost).div(100).toString(),
          siteCost: BigNumber(res.data.siteCost).div(100).toString(),
          conferenceServiceCost: BigNumber(res.data.conferenceServiceCost).div(100).toString(),
          projectMaterialCost: BigNumber(res.data.projectMaterialCost).div(100).toString(),
          commissionCost: BigNumber(res.data.commissionCost).div(100).toString(),
          fixedLaborCost: BigNumber(res.data.fixedLaborCost).div(100).toString(),
          channelCost: BigNumber(res.data.channelCost).div(100).toString(),
          teacherSalaryCost: BigNumber(res.data.teacherSalaryCost).div(100).toString(),
          performanceCommissionCost: BigNumber(res.data.performanceCommissionCost).div(100).toString(),
          undeliveredUserNameList: res.data.undeliveredUserNameList || [],
          url: res.data.url
        }
        if (this.form.url) {
          const arr = this.form.url.split(',')
          const fileList = []
          arr.map(v => {
            const arr = v.split('/')
            fileList.push({
              file: null,
              name: arr[arr.length - 1],
              status: 3,
              authProgress: 100,
              url: v
            })
          })
          console.log('fileList', fileList)
          this.$refs.uploadView.setFileList(fileList)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 录入成本确定
    sure() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.loading = true
          const fileList = this.$refs.uploadView.fileList || []
          let url = ''
          if (fileList.length > 0) {
            const arr = []
            fileList.map(v => {
              v.status === 3 && arr.push(v.url)
            })
            url = arr.join(',')
          }
          const data = {
            travelCost: BigNumber(this.form.travelCost).times(100).toNumber(),
            siteCost: BigNumber(this.form.siteCost).times(100).toNumber(),
            conferenceServiceCost: BigNumber(this.form.conferenceServiceCost).times(100).toNumber(),
            projectMaterialCost: BigNumber(this.form.projectMaterialCost).times(100).toNumber(),
            commissionCost: BigNumber(this.form.commissionCost).times(100).toNumber(),
            fixedLaborCost: BigNumber(this.form.fixedLaborCost).times(100).toNumber(),
            channelCost: BigNumber(this.form.channelCost).times(100).toNumber(),
            teacherSalaryCost: BigNumber(this.form.teacherSalaryCost).times(100).toNumber(),
            performanceCommissionCost: BigNumber(this.form.performanceCommissionCost).times(100).toNumber(),
            scheduleId: this.config.scheduleId,
            url
          }
          getDeliveryScheduleRecordCost(data).then(res => {
            this.loading = false
            this.$notify.success({ titile: '提示', message: '操作成功' })
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 限制输入两位小数
    filterNumberAndDot(key) {
      let value = this.form[key]
      value = value
        .replace(/[^\d.]/g, '') // 将非数字和点以外的字符替换成空
        .replace(/^\./g, '') // 验证第一个字符是数字而不是点
        .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
        .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
        .replace(/\./g, '') // 2、将字符串的点直接清掉
        .replace('$#$', '.') // 3、将复杂字符再转换回点
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      if (value.indexOf('.') < 0 && value !== '') {
        value = parseFloat(value)
      } else if (value.indexOf('.') > 1 && value[0] === '0') {
        value = parseFloat(value)
      }
      if (value > 999999999999998) {
        value = 999999999999998
      }
      // this.$set向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新
      // 调用方法：this.$set( target, key, value )
      // target：要更改的数据源(可以是对象或者数组)
      // key：要更改的具体数据
      // value ：重新赋的值
      this.$set(this.form, key, value.toString())
    }
  }
}
</script>

<style lang='scss' scoped>
.enterCost {
  height: 355px;
  padding: 20px;
  box-sizing: border-box;
  .tips {
    width: 100%;
    padding: 10px 16px;
    background: #FFF2E6;
    border-radius: 4px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF7D00;
    line-height: 22px;
  }
}
.statistics {
  width: 327px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 32px;
  .money {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
  }
}
.m-l-80 {
  margin-left: 80px;
}
.ss-material-box-bottom {
  display: flex;
  padding-right: 20px;
  padding-left: 20px;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  border-radius: 2px 2px 0 0;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>

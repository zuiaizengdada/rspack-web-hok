<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="config.type === 1? '新增规则' : '编辑规则'"
    width="694px"
    :loading="loading"
    height="290px"
    @success="sure"
  >
    <div v-loading="loading" class="addDialog overflowOuto">
      <div class="tips">
        <i class="el-icon-warning tipsIcon" />
        <div class="tipsContent">
          <div class="tipsTitle">注意</div>
          <div class="tipsMsg">请正确填写【业绩分成规则】，对规则的修改将影响各岗位人员业绩核算，请慎重填写。</div>
        </div>
      </div>
      <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="auto" size="small" class="m-t-20">
        <el-form-item label="职位" prop="position">
          <el-select v-model="form.position" placeholder="请选择" class="w-200" clearable>
            <el-option v-for="(value, key) in positionOption" :key="key" :label="value" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="商品价格" prop="goodsPrices">-->
        <!--          <el-select v-model="form.goodsPrices" multiple placeholder="请选择" class="w-200" clearable>-->
        <!--            <el-option v-for="(item) in priceOption" :key="item" :label="item" :value="item" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="出单场景" prop="source">
          <el-select v-model="form.source" placeholder="请选择" class="w-200" clearable @change="form.liveType = ''">
            <el-option v-for="(value, key) in issueScenarioType" :key="key" :label="value" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.source === 2" label="直播类型" prop="liveType">
          <el-select v-model="form.liveType" placeholder="请选择" class="w-200" clearable>
            <el-option v-for="(value, key) in liveTypeOption" :key="key" :label="value" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item label="分成比例" prop="proportion">
          <el-input v-model.trim="form.proportion" placeholder="请选择" class="w-200" clearable @input="delNoNumber">
            <el-button slot="append">%</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="流量类型" prop="classification">
          <el-select v-model="form.classification" placeholder="请选择" class="w-200" clearable>
            <el-option v-for="(value, key) in flowOption" :key="key" :label="value" :value="Number(key)" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { issueScenarioType, flowOption, positionOption, liveTypeOption } from '../columns'
import { performanceShareAdd, performanceShareEdit, getGoodsPrices } from '@/api/order/performanceShare'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 1, // 1新增 2编辑
          row: {},
          visible: false
        }
      }
    }
  },
  data() {
    var validateProportion = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入分成比例'))
      } else if (value > 100 || value < 1) {
        return callback(new Error('请输入1-100的正整数'))
      } else {
        return callback()
      }
    }
    return {
      priceOption: [],
      liveTypeOption,
      issueScenarioType,
      flowOption,
      positionOption,
      loading: false,
      form: {
        position: '', // 职位
        goodsPrices: [], // 商品价格,
        source: '', // 出单场景
        classification: '', // 流量类型
        liveType: '', // 直播类型
        proportion: '' // 业绩分成比例
      },
      rules: {
        position: [
          { required: true, message: '请选择职位', trigger: 'change' }
        ],
        goodsPrices: [
          { type: 'array', required: true, message: '请至少选择一个商品价格', trigger: 'change' }
        ],
        source: [
          { required: true, message: '请选择出单场景', trigger: 'change' }
        ],
        classification: [
          { required: true, message: '请选择流量类型', trigger: 'change' }
        ],
        liveType: [
          { required: true, message: '请选择直播类型', trigger: 'change' }
        ],
        proportion: [
          { required: true, trigger: 'blur', validator: validateProportion }
        ]
      }
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        val && this.getPriceOption()
        this.$refs.form && this.$refs.form.resetFields()
        if (this.config.type === 1) {
          this.form = {
            position: '', // 职位
            goodsPrices: [], // 商品价格,
            source: '', // 出单场景
            classification: '', // 流量类型
            liveType: '', // 直播类型
            proportion: '' // 业绩分成比例
          }
        } else {
          const { position, goodsPrices, source, classification, liveType, proportion, id } = this.config.row
          this.form = { position, goodsPrices, source, classification, liveType, proportion, id }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    delNoNumber(e) {
      const num = Number(e.replace(/[^\d]/g, ''))
      if (num > 100) {
        this.form.proportion = 100
      } else {
        this.form.proportion = num
      }
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const api = this.config.type === 1 ? performanceShareAdd : performanceShareEdit
          const params = {
            ...this.form
          }
          api(params).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.loading = false
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getPriceOption() {
      getGoodsPrices().then(res => {
        this.priceOption = res.data
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.addDialog {
    height: 290px;
    padding: 20px;
    .tips {
        width: 100%;
        padding: 10px;
        background: #FFF2E6;
        border-radius: 8px;
        display: flex;
        .tipsIcon {
            width: 24px;
            color: #FF7D00;
            font-size: 24px;
        }
        .tipsContent {
            flex: 1;
            padding-left: 8px;
            .tipsTitle {
                font-size: 16px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #FF7D00;
                line-height: 24px;
            }
            .tipsMsg {
                margin-top: 8px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #FF7D00;
                line-height: 22px;
            }
        }
    }
}
.m-l-32 {
    margin-left: 32px;
}
</style>

<template>
  <div class="content">
    <div class="videoDeliverySettings font-bold mt-4 text-sm" style="color: #606266;">学员已完成交付的规则</div>
    <div class="form mt-6">
      <el-form ref="form" :model="form" label-width="0px" :rules="rules">
        <el-form-item label="累计观看时长" prop="playDuration" label-width="120px" class="custom-group-item">
          <el-input
            v-model="form.playDuration"
            placeholder="请输入"
            style="width: 200px;"
            @change="value => parseInputValue2Number(value, 'playDuration')"
            size="small"
          >
            <template v-slot:append>
              <el-select v-model="form.playDurationType" placeholder="请选择" value="1" class="w-24">
                <el-option key="001" label="分钟" :value="1" />
                <el-option key="002" label="小时" :value="2" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label=" " prop="sessionNumType" label-width="120px">
          <el-select v-model="form.sessionNumType" placeholder="请选择" value="1" class="w-24">
            <el-option key="001" label="或者" :value="1" />
            <el-option key="002" label="且" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="交付线下课场次" prop="sessionNum" label-width="120px" class="custom-group-item">
          <el-input
            v-model="form.sessionNum"
            placeholder="请输入"
            style="width: 200px;"
            @change="value => parseInputValue2Number(value, 'sessionNum')"
            size="small"
          >
            <template v-slot:append>
              <span>场</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label=" " prop="liveType" label-width="120px">
          <el-select v-model="form.liveType" placeholder="请选择" value="1" class="w-24">
            <el-option key="001" label="或者" :value="1" />
            <el-option key="002" label="且" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="custom-form-item">
          <el-form-item label="累计参加" prop="liveNum" label-width="120px" class="custom-group-item">
            <el-input
              v-model="form.liveNum"
              placeholder="请输入"
              style="width: 200px;"
              @change="value => parseInputValue2Number(value, 'liveNum')"
              size="small"
            />
            <span class="mx-2 text-sm font-bold" style="color: #606266; line-height: 30px">场直播，</span>
          </el-form-item>
          <el-form-item label="且累计直播观看时长" prop="liveDuration" label-width="160px" class="custom-group-item">
            <el-input
              v-model="form.liveDuration"
              placeholder="请输入"
              @change="value => parseInputValue2Number(value, 'liveDuration')"
              size="small"
            >
              <template v-slot:append>
                <el-select v-model="form.liveDurationType" placeholder="请选择" value="1" class="w-24">
                  <el-option key="001" label="分钟" :value="1" />
                  <el-option key="002" label="小时" :value="2" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item
          v-if="form.liveType&&form.sessionNumType&&form.sessionNumType!==form.liveType"
          label="模式"
          prop="time"
          label-width="120px"
          class="formItem"
        >
          <div>
            <el-radio v-model="form.modelType" class="radioBox" :label="1">模式1 <div class="radioText">(<span>累计观看时长30分钟 且 交付线下课场次1场</span>) 或者 累计参加1场直播且累计直播观看时长1分钟</div></el-radio>
          </div>
          <div>
            <el-radio v-model="form.modelType" class="radioBox" :label="2">模式2 <div class="radioText">累计观看时长30分钟 且 (<span>交付线下课场次1场 或者 累计参加1场直播且累计直播观看时长1分钟</span>)</div></el-radio>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="small"
            @click="saveform"
          >保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// columPage,
// columnBatch,
// disassociateBatch,
// materialColumnSort,
// editGoods,
// getMaterialGoodsList,
// columnBatchSort,
// updateContentName
import { getPackageDeliveryConfig, savePackageDeliveryConfig } from '@/api/course'

export default {
  components: {},
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      id: '',
      form: {
        playDuration: '',
        playDurationType: 1,
        sessionNumType: 0,
        sessionNum: '',
        liveType: 0,
        liveNum: 0,
        liveDuration: '',
        liveDurationType: '',
        modelType: 0
      },
      rules: {
        playDuration: [
          { required: true, message: '请输入累计观看时长', trigger: 'blur' },
          { type: 'number', min: 0, message: '请输入大于0的数字', trigger: 'blur' }
        ],
        sessionNumType: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        sessionNum: [
          { required: true, message: '请输入场次', trigger: 'blur' },
          { type: 'number', min: 0, message: '请输入大于0的数字', trigger: 'blur' }
        ],
        liveType: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        liveDurationType: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        liveNum: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'number', min: 0, message: '请输入大于0的数字', trigger: 'blur' }
        ],
        liveDuration: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'number', min: 0, message: '请输入大于0的数字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.id = this.$route.params.id
      this.getInfo()
    },
    async getInfo() {
      const res = await getPackageDeliveryConfig({ goodsId: this.id })
      this.form = res.data || { modelType: 0,
        playDurationType: 1,
        liveDurationType: 1 }
    },
    saveform() {
      this.$refs.form.validate(valid => {
        console.log('====================')
        console.log(valid)
        console.log('====================')
        if (valid) {
          this.save()
        } else {
          console.log('error submit!!')
          this.$notify({
            title: '警告',
            message: '请完成必填项!',
            type: 'warning'
          })
          return false
        }
      })
    },
    async save() {
      this.loading = true
      try {
        const data = {
          ...this.form,
          modelType: this.form.liveType && this.form.sessionNumType && this.form.sessionNumType !== this.form.liveType ? this.form.modelType : 0
        }
        await savePackageDeliveryConfig({ ...data, goodsId: this.id })
        this.$message.success('保存成功')
      } catch (e) {
        this.$message.error('保存失败')
      }
      this.loading = false
    },
    parseInputValue2Number(value, key) {
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        this.form[key] = parseInt(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.radioBox::v-deep{
  display: flex;
  margin-top: 10px;
  .el-radio__label{
    display: flex;
  }
  .radioText{
    margin-left: 10px;
    color:#000;
    >span{
      color:red;
    }
  }
}
.custom-form-item::v-deep {
  .el-form-item__content {
    display: flex;
  }
}
</style>

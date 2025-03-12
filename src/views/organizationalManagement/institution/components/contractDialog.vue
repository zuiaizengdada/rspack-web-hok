<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="683px"
    :loading="loading"
    height="auto"
    @success="sure"
    @close="closeDialog"
  >
    <div class="dialog">
      <el-form
        ref="dialogRef"
        class="dialogForm"
        label-position="right"
        label-width="120px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="合同开始日期" prop="time">
          <el-date-picker
            v-model="form.time"
            style="width: 324px"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="timeChange"
          />
        </el-form-item>
        <el-form-item label="合同有效期" prop="time">
          <el-input
            v-model="form.mtime"
            style="width: 324px"
            disabled
            placeholder="根据起止日期，自动计算"
          >
            <template slot="append">月</template>
          </el-input>
        </el-form-item>

        <el-row>
          <el-form-item label="合同电子附件" prop="attachmentUrl">
            <!-- 电子附件 -->
            <upload
              ref="upload"
              style="width: 517px"
              :max-show-length="4"
              @change="fileChange"
            />
            <div class="tips">
              注：图片文件jpg,png格式 大小限10M以内，PDF文件50M以内
            </div>
          </el-form-item>
        </el-row>
        <el-form-item label="结算周期" prop="settlePeriod">
          <el-radio-group
            v-model="form.settlePeriod"
            @change="settlePeriodChange"
          >
            <el-radio
              v-for="(item, index) in options.settlePeriod"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button size="small" type="primary" @click="sure"> 确认 </el-button>
      <el-button size="small" @click="closeDialog"> 取消 </el-button>
    </div>
  </AppDialog>
</template>

<script>
import { cloneDeep } from 'lodash'
import moment from 'moment'
import AppDialog from '@/components/AppDialog'
import { orgContractAddApi } from '@/api/organization/settings.js'
import upload from '@/views/teacherCenter/components/upload.vue'

export default {
  components: {
    AppDialog,
    upload
  },
  data() {
    return {
      visible: false,
      title: '',
      loading: false,
      form: {
        // contractEndTime: '', // 	合同结束时间
        // contractStartTime: '', // 	合同开始时间
        time: '',
        mtime: '',
        organizationId: '', // 	机构ID
        attachmentUrl: '', // 	附件链接，多个用逗号分隔
        settlePeriod: 1 // 结算周期：1-按月结算、2-按季度结算、3-按年结算
      },
      rules: {
        time: [{ required: true, message: '请选择合同日期', trigger: 'blur' }],
        mtime: [{ required: true, message: '请选择合同日期', trigger: 'blur' }],
        attachmentUrl: [
          { required: true, message: '请上传合同附件', trigger: 'blur' }
        ],
        settlePeriod: [
          { required: true, message: '请选择结算周期', trigger: 'blur' }
        ]
      },
      options: {
        settlePeriod: [
          { label: '按月结算', value: 1 },
          { label: '按季度结算', value: 2 },
          { label: '按年结算', value: 3 }
        ]
      },
      chargesInfo: {
        rules: {},
        fileList: [],
        name: ''
      },
      fileList: [],
      billCycleList: []
    }
  },
  methods: {
    timeChange(val) {
      if (val && val.length === 2) {
        const startDate = moment(val[0])
        const endDate = moment(val[1])
        // this.$set(this.form, 'mtime', endDate.diff(startDate, 'months') + '')
        this.$set(
          this.form,
          'mtime',
          Math.ceil(endDate.diff(startDate, 'months', true)) + ''
        )
      } else {
        this.$set(this.form, 'mtime', '')
      }
      this.$refs.dialogRef.validateField(['time', 'mtine'])
    },
    fileChange(val) {
      this.$set(this.form, 'attachmentUrl', val)
      this.$refs.dialogRef.validateField(['attachmentUrl'])
    },
    settlePeriodChange() {
      this.$refs.dialogRef.validateField(['settlePeriod'])
    },
    sure() {
      if (this.loading) return
      this.$refs.dialogRef.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const req = this.dataTransfor()
            const { success } = await orgContractAddApi(req)
            if (success) {
              this.$message.success('新增成功')
              this.closeDialog()
              this.$emit('search')
            }
          } catch (error) {
            console.log('error', error)
            this.$message.success('新增失败')
          }
          this.loading = false
        }
      })
    },
    dataTransfor() {
      console.log('this.(this.form', this.form)
      const data = cloneDeep(this.form)
      if (data.time && data.time.length === 2) {
        data.contractStartTime = moment(data.time[0]).format('YYYY-MM-DD')
        data.contractEndTime = moment(data.time[1]).format('YYYY-MM-DD')
      }
      if (data.attachmentUrl) {
        data.attachmentUrl = data.attachmentUrl
          .map(item => {
            return item.photoUrl
          })
          .join(',')
      }
      delete data.time
      delete data.mtime
      return data
    },

    // 关闭弹窗
    closeDialog() {
      this.$refs.dialogRef.resetFields()
      this.form = {
        time: '',
        mtime: '',
        organizationId: '', // 	机构ID
        attachmentUrl: '', // 	附件链接，多个用逗号分隔
        settlePeriod: 1
      }
      this.$refs.upload.setFileList([])
      this.title = ''
      this.visible = false
      this.loading = false
    },
    // 打开弹窗
    openDialog(val) {
      this.title = '新增合同'
      this.form = {
        ...this.form,
        ...val
      }
      console.log('this.form---', this.form)
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  max-height: 600px;
  height: auto;
  padding: 20px;
  overflow-y: auto;
  .dialogForm {
    width: 100%;
    .mb25 {
      margin-bottom: 25px;
    }
    .w515 {
      width: 515px;
    }
    .w250 {
      width: 250px;
    }
    .w265 {
      width: 265px;
    }
    .w100 {
      width: 100%;
      &.flex {
        display: inline-flex !important;
        ::v-deep .el-form-item__content {
          flex: 1;
        }
      }
    }
    .title {
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      padding-left: 11px;
      text-align: left;
      position: relative;

      &::before {
        content: '';
        height: 100%;
        width: 2px;
        background: #0c6fff;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .desc {
      color: #c2c6ce;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
      padding: 10px 0 2px 0;
      /* position: absolute;
      bottom: 0;
      left: 0; */
    }
    ::v-deep .el-form-item__label {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
  .tips {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }
  .type-cnt {
    height: auto;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid #dcdee1;
    background: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    padding: 20px 20px 0 20px;
    height: auto;
    .type-title {
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      padding: 0 20px 15px 0;
      text-align: left;
      position: relative;
    }
    .pt15 {
      padding-top: 15px;
    }
    .bt1 {
      border-top: 1px solid #dcdee1;
    }
    .settlement-txt {
      color: rgb(0, 0, 0);
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
      margin-right: 16px;
    }
    .desc {
      color: rgb(119, 119, 119);
      font-size: 14px;
      line-height: 32px;
      margin-left: 20px;
    }
    .unit {
      color: #000000;
      font-size: 14px;
      margin-left: 4px;
    }
  }
}
::v-deep {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  .fy-price {
    margin-right: 5px;
    .el-input {
      width: calc(100% - 15px);
    }
  }
}
</style>

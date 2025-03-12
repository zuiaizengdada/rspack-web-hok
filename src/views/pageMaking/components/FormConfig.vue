
<template>
  <div class="form-config-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="专题名称" prop="title">
        <el-input
          v-model="form.title"
          size="small"
          clearable
          maxlength="60"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="开始时间"
        prop="startTime"
        class="flex form-content form-start"
      >
        <el-date-picker
          v-model="form.startTime"
          format="yyyy-MM-dd HH:mm"
          popper-class="form-picker"
          value-format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions"
          style="width:200px;"
          size="small"
          clearable
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item
        label="结束时间"
        prop="isFixed"
        class="flex form-content bor-btm"
      >
        <el-radio-group v-model="form.isFixed" class="form-radio" @change="changeFixed">
          <el-radio :label="0" style="margin-right:20px">长期有效</el-radio>
          <el-radio :label="1">
            固定时间
          </el-radio>
          <el-form-item
            v-if="form.isFixed === 1"
            prop="endTime"
            class="hide-border form-end"
            style="padding-bottom:0px;margin-bottom:0px;"
          >
            <el-date-picker
              v-model="form.endTime"
              popper-class="form-picker"
              :picker-options="pickerEndOptions"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              size="small"
              style="width:200px;margin-left:10px;"
              clearable
              type="datetime"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="页面标题" class="form-page" prop="pageName">
        <el-input
          v-model="form.pageName"
          clearable
          maxlength="60"
          show-word-limit
        />
        <el-checkbox
          v-model="isSameTitle"
          class="form-checkbox"
          @change="handleSameTitle"
        >同专题名称</el-checkbox>
      </el-form-item>
      <el-form-item label="页面描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <backgroundFormItem
        :form.sync="form"
      />
      <div class="flex flex-middle flex-between">
        <div>
          <span class="label">状态</span>
          <span class="tips">开启之后才显示在前端，关闭或中间将无法显示当前页面</span>
        </div>
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import backgroundFormItem from './backgroundFormItem'
export default {
  components: {
    backgroundFormItem
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var validateData = (rule, value, callback) => {
      if (!value && this.form.isFixed === 0) {
        callback(new Error('请选择结束日期时间'))
        return
      }
      const startTime = this.form.startTime && new Date(this.form.startTime).getTime()
      const endTime = value && new Date(value).getTime()
      if (startTime >= endTime) {
        callback(new Error('结束日期时间必须大于开始日期'))
        return
      }
      callback()
    }
    return {
      rules: {
        title: [
          { required: true, message: '请输入专题名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请输入开始时间', trigger: 'change' }
        ],
        isFixed: [
          { required: true, message: '请选择结束类型', trigger: 'change' }
        ],
        pageName: [
          { required: true, message: '请输入页面名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入页面描述', trigger: 'blur' }
        ],
        endTime: [
          { validator: validateData, trigger: 'change' }
        ]
      },
      isSameTitle: false,
      fileList: [],
      pickerOptions: {
        disabledDate(time) {
          return !moment().subtract(1, 'days').isBefore(moment(time), 'days')
        }
      },
      pickerEndOptions: {
        disabledDate: (time) => {
          const startTime = this.form.startTime
          return !moment(startTime).subtract(1, 'days').isBefore(moment(time), 'second')
        }
      }
    }
  },
  computed: {
    form: {
      set(val) {
        this.$emit('update:data', val)
      },
      get() {
        return this.data
      }
    }
  },
  methods: {
    handleUploadChange(fileList) {
      this.fileList = fileList
    },
    handleDel() {
      this.fileList = []
    },
    handleSameTitle() {
      if (this.isSameTitle) {
        this.form.pageName = this.form.title
      }
    },
    changeFixed() {
      if (this.form.isFixed === 0) {
        this.form.endTime = ''
      }
    }
  }
}
</script>
<style>
.form-picker{
  left: calc(100% - 357px) !important;
}
</style>
<style lang="scss" scoped>
.form-config-container ::v-deep{
  .form-page{
    position: relative;
  }
  .form-start{
    .el-form-item__error{
      left:-66px;
    }
  }
  .form-end{
    .el-form-item__error{
      left:10px;
    }
  }
  .form-checkbox{
    position: absolute;
    top: -34px;
    right: 15px
  }
  .form-content {
    border-bottom: 0px !important;
    padding-bottom: 0px !important;
    margin-bottom: 0px;
    .el-form-item__content{
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
    .el-radio{
      margin-right: 0px;
      .el-radio__label{
        padding-left: 8px
      }
    }
  }
  .form-radio{
    width: 390px;
    display: flex;
    align-items: center;
  }
  .form-content.bor-btm{
    border-bottom: solid 1px #f5f5f5 !important;
    margin-bottom: 20px;
    padding-bottom: 20px !important;
  }
  .label{
    font-size: 14px;
    color: #606266;
    margin-right: 10px;
  }
  .tips{
    color: #999999;
    font-size: 12px;
  }
}

</style>

<template>
  <el-form ref="form" :model="form" label-width="80px" size="mini">
    <el-form-item label="选择分类" prop="">
      <div class="flex">
        <el-select v-model="form.type" style="width:160px;margin-right:10px;" :disabled="isEditForm" @change="handleChangeType">
          <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
        <el-input v-model="form.typeContent" :disabled="isEditForm" />
      </div>

    </el-form-item>
    <el-form-item label="敏感词">
      <p>输入回车即代表一个敏感词</p>
      <el-input v-model="form.sensitiveContent" :rows="6" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleClickOk">确定</el-button>
      <el-button @click="handleClickCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [{ label: 'IP老师', value: 0 }, { label: '视频名称', value: 1 }, { label: '分组名称', value: 2 }],
      form: {
        type: 1,
        typeContent: '',
        sensitiveContent: '',
        sensitiveList: []
      },
      rules: [

      ],
      isEditForm: false
    }
  },
  mounted() {
    if (this.data && Object.keys(this.data).length) {
      this.form = this.data
      // this.form.sensitiveContent = this.data.sensitiveList.join('\n')
      this.isEditForm = true
    }
  },
  methods: {
    handleChangeType() {},
    handleClickOk() {
      this.$emit('submit', this.form)

      this.form.sensitiveList = this.form.sensitiveContent.split(/[\n]/g)
      console.log(this.form, 999)
      // this.handleClickCancel()
    },
    handleClickCancel() {
      this.$emit('close')
      this.$refs.form.resetFields()
    }

  }
}
</script>

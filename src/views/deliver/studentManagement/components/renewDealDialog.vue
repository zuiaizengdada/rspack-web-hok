<template>
  <AppDialog
    v-model="config.visible"
    :footer-text="['保存', '取消']"
    title="恢复交付"
    width="750px"
    height="500px"
    :loading="loading"
    @success="sure"
  >
    <el-form ref="ruleForm" class="formBox" :model="ruleForm" :rules="rules">
      <el-form-item label="还原为待交付原因" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
        <div class="selectBox">
          <div>快捷输入:</div>
          <m-select
            v-model="reason"
            size="small"
            class="select"
            dict-key="DELIVERY_REASON"
            @change="handleReason"
          />
        </div>
      </el-form-item>
      <el-form-item
        label="上传图片（与助教沟通记录或学员沟通记录截图）"
        prop="imageList"
      >
        <upload
          ref="upload"
          v-model="ruleForm.imageList"
          class="imagebOX"
          :limit="6"
          :max-m="2"
          tips="仅支持小于2M的jpg、png、jpeg格式图片"
          @change="handleChange"
        />
        <div>最多上传6张，单张小于2M的jpg,jpeg,png图片！</div>
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import upload from '@/components/AppTemplate/Upload2OSS'
export default {
  components: {
    AppDialog,
    upload
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          row: {},
          deliveryInfoId: '',
          visible: false
        }
      }
    }
  },
  data: () => ({
    loading: false,
    ruleForm: { desc: '', imageList: [] },
    reason: '',
    rules: {
      desc: [
        {
          required: true,
          message: '请填写还原为待交付原因',
          trigger: ['blur', 'change']
        }
      ],
      imageList: [
        {
          required: true,
          message: '请上传图片',
          trigger: ['blur', 'change']
        }
      ]
    }
  }),
  created() {},
  methods: {
    handleChange(value) {
      if (value.length) {
        this.ruleForm.imageList = value.map(item => item.url)
      } else {
        this.ruleForm.imageList = []
      }
    },
    handleReason(value) {
      this.reason = value
      if (!value) return
      this.ruleForm.desc = value
    },
    async sure() {
      console.log(this.ruleForm)
      await this.$refs['ruleForm'].validate()
      this.$delModal({
        tips: '确认保存后，学员将被移出当前班期，确认将学员交付状态由“已交付”变更成“待交付”吗？',
        success: () => {
          console.log('删除')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.formBox {
  padding: 20px;
}
.selectBox {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  > div:nth-of-type(1) {
    width: 75px;
  }
  > .select {
    width: 200px !important;
  }
}
.imagebOX {
  width: 100%;
}
</style>

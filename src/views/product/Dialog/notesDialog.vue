<template>
  <!-- 新增产品 -->
  <AppDialog
    v-model="visible"
    :title="title"
    width="640px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="addProduct overflowOuto">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
        @submit.native.prevent
      >
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model.trim="form.remark"
            style="width: 450px"
            clearable
            placeholder="请输入备注内容"
            type="textarea"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  researchProgressOption,
  sortLabelOption
} from '@/views/live/columns.js'
import { productBeizhu } from '@/api/product/productManage.js'
// import { filtersMoneyByZero } from '@/filters/index'

export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: '新增备注',
      ifEdit: false,
      ifReview: false,
      row: {},
      form: {
        remark: '',
        id: ''
      },
      rules: {
        remark: [{ required: true, message: '请输入备注内容', trigger: 'blur' }]
        // materialAddress: [
        //   { required: true, message: '请输入素材图地址', trigger: 'blur' }
        // ],
      },
      top: '114px',
      sortable: null,
      researchProgressOption,
      sortLabelOption,
      success: () => {}
    }
  },
  watch: {},
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    loadData(row) {
      this.row = row
      this.form.id = this.row.id
      this.form.remark = this.row.remark ? this.row.remark : undefined
      // this.$refs.form.resetFields()
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    edit() {
      const data = {
        remark: this.form.remark,
        productId: this.form.id
      }
      this.loading = true
      productBeizhu(data)
        .then(res => {
          if (res.code === 1) {
            this.visible = false
            this.$emit('successAdd')
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.addProduct {
  max-height: 604px;
  padding: 20px 34px;
}
.tips {
  margin-top: 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 17px;
}
.myLotteryTable {
  width: 100%;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #cbcfd3;
  font-size: 12px;
  overflow: hidden;
}
.assessBox {
  margin-top: 16px;
  width: 450px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .remindPersonListView {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}
.hide {
  ::v-deep .fileBtnIcon {
    display: none;
  }
}
::v-deep .el-textarea textarea {
  height: 160px;
}
</style>

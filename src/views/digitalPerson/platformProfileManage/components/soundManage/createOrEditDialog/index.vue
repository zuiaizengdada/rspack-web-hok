<template>
  <div>
    <el-dialog
      :title="getTitle"
      :visible.sync="visible"
      width="666px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        size="small"
      >
        <el-form-item label="渠道" prop="thirdType">
          <el-radio-group v-model="form.thirdType">
            <el-radio :label="1">华为</el-radio>
            <el-radio :label="2">火山</el-radio>
            <el-radio :label="3">硅基</el-radio>
            <el-radio :label="5">火山大模型</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="声音名称" prop="name">
          <el-input
            v-model="form.name"
            maxlength="50"
            placeholder="请输入声音名称"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="声音参数" prop="voiceType">
          <el-input
            v-model="form.voiceType"
            resize="none"
            maxlength="50"
            placeholder="请输入声音参数"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          v-if="form.thirdType === 1"
          label="声音克隆训练id"
          prop="trainingJobId"
          label-width="120px"
        >
          <el-input
            v-model="form.trainingJobId"
            resize="none"
            maxlength="50"
            placeholder="声音克隆训练id"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="所属机构" prop="orgInfo">
          <el-cascader
            ref="cascader1"
            v-model="form.orgInfo"
            clearable
            :options="deptList"
            :props="{
              checkStrictly: true,
              multiple: true,
              emitPath: false,
              value: 'obj'
            }"
            :show-all-levels="false"
            @change="deptChange"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="submit"
        >
          确定
        </el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { voicesAdd, voicesUpdate, getAllOrgList } from '@/api/aiVideoManage'

export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        thirdType: 1,
        name: undefined,
        characterId: undefined,
        orgInfo: [],
        voiceType: undefined,
        trainingJobId: undefined
      },
      rules: {
        thirdType: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入声音名称', trigger: 'change' }
        ],
        orgInfo: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        voiceType: [
          { required: true, message: '请输入声音参数', trigger: 'change' }
        ],
        trainingJobId: [
          { required: true, message: '请输入声音克隆训练id', trigger: 'change' }
        ]
      },
      deptList: [],
      loading: false,
      visibleUploadImg: false,
      configInfo: {},
      selectImg: {}
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    },
    getTitle() {
      return this.row.id ? '编辑声音' : '新增声音'
    }
  },
  created() {
    if (this.row.id) {
      this.form = { ...this.row }
    }
    this.getDept()
  },
  methods: {
    deptChange(val) {
      // this.$nextTick(() => {
      //   this.$refs.cascader1.dropDownVisible = false
      // })
    },
    async getDept() {
      const res = await getAllOrgList()
      this.deptList = res.data.map(item => {
        return {
          value: item.orgId,
          label: item.orgName,
          obj: item
        }
      })
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$emit('submit', this.form)
          this.loading = true
          if (this.row.id) {
            this.submitEdit()
          } else {
            this.submitAdd()
          }
        }
      })
    },
    async submitAdd() {
      try {
        const params = {
          ...this.form
        }
        const res = await voicesAdd(params)
        this.loading = false
        if (res.code === 1) {
          this.$message.success({ title: '提示', message: '新增成功' })
          this.$emit('close')
          this.$emit('success')
        }
      } catch {
        this.loading = false
      }
    },
    async submitEdit() {
      try {
        const params = {
          ...this.form
        }
        const res = await voicesUpdate(params)
        this.loading = false
        if (res.code === 1) {
          this.$message.success({ title: '提示', message: '编辑成功' })
          this.$emit('close')
          this.$emit('success')
        }
      } catch {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  padding: 12px 20px;
  border-bottom: 1px solid #e7e7e7;

  .el-dialog__title {
    font-size: 16px;
  }
  .el-dialog__headerbtn {
    top: 15px;
    i {
      font-size: 20px;
      color: #000;
    }
  }
}
::v-deep {
  .el-dialog__body {
    padding-top: 17px !important;
  }
}
.textarea-s {
  position: relative;
  .btn-s {
    position: absolute;
    bottom: -6px;
    left: 16px;
    &:hover {
      cursor: pointer;
    }
  }
}
::v-deep .textarea-s {
  .el-form-item__content {
    position: relative;
    .el-textarea {
      .el-textarea__inner {
        padding-bottom: 20px;
      }
    }
  }
}
.vh-row {
  display: flex;
  align-items: flex-end;
  margin: 20px 0 45px 0;
  .lable-upload {
    font-size: 14px;
    font-family: normal;
    font-weight: 400;
    color: #000;
    position: absolute;
    bottom: -45px;
  }
}
.vertical-item {
  position: relative;
  width: 160px;
  height: 90px;
  background: #fbfcfe;
  border-radius: 4px;
  border: 1px dashed #e1e6ed;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  i {
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }
  img {
    width: auto;
    height: 90px;
  }
  &:hover {
    .mask-img {
      display: flex;
    }
  }
}
.horizontal-item {
  position: relative;
  width: 160px;
  height: 90px;
  background: #fbfcfe;
  border-radius: 4px;
  border: 1px dashed #e1e6ed;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  i {
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }
  img {
    width: 100%;
    height: auto;
  }
  &:hover {
    .mask-img {
      display: flex;
    }
  }
}
.mask-img {
  display: none;
  width: 100%;
  height: 20px;
  background: #333333;
  position: absolute;
  bottom: 0;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  user-select: none;
  .mask-img-item {
    color: #ffffff6c;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    img {
      width: 10px;
      height: 10px;
      margin-right: 2px;
    }
  }
}
::v-deep .el-radio__label {
  font-size: 14px;
  font-family: normal;
  color: #000;
}
</style>

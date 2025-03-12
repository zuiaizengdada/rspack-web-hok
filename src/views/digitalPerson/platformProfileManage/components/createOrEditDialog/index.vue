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
            <el-radio :label="4">媲美</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="形象名称" prop="name">
          <el-input
            v-model="form.name"
            maxlength="50"
            placeholder="请输入形象名称"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="形象参数" prop="characterId">
          <el-input
            v-model="form.characterId"
            type="textarea"
            :rows="{ minRows: 2 }"
            resize="none"
            maxlength="225"
            placeholder="请输入形象参数"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="姿态" prop="attitudeType">
          <el-radio-group v-model="form.attitudeType">
            <el-radio :label="1">坐姿</el-radio>
            <el-radio :label="2">站姿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="resolutionType">
          <el-radio-group v-model="form.resolutionType">
            <el-radio :label="1">竖屏</el-radio>
            <el-radio :label="0">横屏</el-radio>
            <el-radio :label="2">竖屏+横屏</el-radio>
          </el-radio-group>
          <div class="vh-row">
            <div
              v-if="form.resolutionType == 1 || form.resolutionType == 2"
              class="vertical-item"
              :style="{
                'background-color': form.photoUrl ? '#CBCFD3' : '#fbfcfe'
              }"
              @click="uploadDialog('vertical')"
            >
              <i v-if="!form.photoUrl" class="el-icon-plus" />
              <img v-else :src="form.photoUrl" alt="" />
              <span class="lable-upload">竖版形象图</span>
              <div v-if="form.photoUrl" class="mask-img">
                <div
                  style="margin-right: 10px"
                  class="mask-img-item"
                  @click.stop="openBigImg('vertical')"
                >
                  <img
                    src="@/assets/image/aigc/digitalVideoManage/amplify2.png"
                    alt=""
                  />
                  大图
                </div>
                <div class="mask-img-item" @click.stop="delImg('vertical')">
                  <img
                    src="@/assets/image/aigc/digitalVideoManage/del2.png"
                    alt=""
                  />
                  删除
                </div>
              </div>
            </div>
            <div
              v-if="form.resolutionType == 0 || form.resolutionType == 2"
              class="horizontal-item"
              @click="uploadDialog('horizontal')"
            >
              <i v-if="!form.transversePhotoUrl" class="el-icon-plus" />
              <img v-else :src="form.transversePhotoUrl" alt="" />
              <span class="lable-upload">横版形象图</span>
              <div v-if="form.transversePhotoUrl" class="mask-img">
                <div
                  class="mask-img-item"
                  style="margin-right: 10px"
                  @click.stop="openBigImg('horizontal')"
                >
                  <img
                    src="@/assets/image/aigc/digitalVideoManage/amplify2.png"
                    alt=""
                  />
                  大图
                </div>
                <div class="mask-img-item" @click.stop="delImg('horizontal')">
                  <img
                    src="@/assets/image/aigc/digitalVideoManage/del2.png"
                    alt=""
                  />
                  删除
                </div>
              </div>
            </div>
          </div>
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
        <!-- <el-form-item label="音色参数" prop="voiceType">
          <el-input
            v-model="form.voiceType"
            resize="none"
            maxlength="50"
            placeholder="请输入音色参数"
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
        </el-form-item> -->
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
    <uploadImg
      v-if="visibleUploadImg"
      v-model="visibleUploadImg"
      :config-info="configInfo"
      @submit="submitUpload"
      @close="visibleUploadImg = false"
    />
    <reviewImgDialog
      v-model="bigImgVisible"
      :row="selectImg"
      @close="bigImgVisible = false"
    />
  </div>
</template>
<script>
import uploadImg from '../uploadImg'
import reviewImgDialog from '../reviewImgDialog'
import {
  addCharacter,
  modifyCharacter,
  getAllOrgList
} from '@/api/aiVideoManage'

export default {
  components: { uploadImg, reviewImgDialog },
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
    const validateE = (rule, value, callback) => {
      if (value === 1 && !this.form.photoUrl) {
        callback(new Error('请上传竖版形象图'))
      } else if (value === 0 && !this.form.transversePhotoUrl) {
        callback(new Error('请上传横版形象图'))
      } else if (
        value === 2 &&
        (!this.form.transversePhotoUrl || !this.form.photoUrl)
      ) {
        callback(new Error('请上传【竖版/横版】形象图'))
      }
      callback()
    }
    return {
      form: {
        thirdType: 1,
        name: undefined,
        characterId: undefined,
        attitudeType: 1,
        resolutionType: 1,
        orgInfo: [],
        // voiceType: undefined,
        photoUrl: undefined,
        transversePhotoUrl: undefined
        // trainingJobId: undefined
      },
      rules: {
        thirdType: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入形象名称', trigger: 'change' }
        ],
        characterId: [
          { required: true, message: '请输入形象参数', trigger: 'change' }
        ],
        attitudeType: [
          { required: true, message: '请选择姿态', trigger: 'change' }
        ],
        resolutionType: [{ validator: validateE, trigger: 'change' }],
        orgInfo: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ]
        // voiceType: [
        //   { required: true, message: '请输入音色参数', trigger: 'change' }
        // ],
        // trainingJobId: [
        //   { required: true, message: '请输入声音克隆训练id', trigger: 'change' }
        // ]
      },
      deptList: [],
      loading: false,
      visibleUploadImg: false,
      configInfo: {},
      bigImgVisible: false,
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
      return this.row.id ? '编辑形象' : '新增形象'
    }
  },
  created() {
    if (this.row.id) {
      this.form = { ...this.row }
    }
    this.getDept()
  },
  methods: {
    delImg(type) {
      const key = type === 'horizontal' ? 'transversePhotoUrl' : 'photoUrl'
      this.form[key] = undefined
    },
    openBigImg(type) {
      const key = type === 'horizontal' ? 'transversePhotoUrl' : 'photoUrl'
      this.selectImg = { type: type, url: this.form[key] }
      this.bigImgVisible = true
    },
    submitUpload(record) {
      console.log(record)
      const key =
        record.type === 'horizontal' ? 'transversePhotoUrl' : 'photoUrl'
      this.form[key] = record.file
      this.visibleUploadImg = false
    },
    uploadDialog(type) {
      this.configInfo = {
        type,
        cropperConfig: { fixedNumber: type === 'vertical' ? [9, 16] : [16, 9] }
      }
      this.visibleUploadImg = true
    },
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
        if (params.resolutionType === 0) {
          delete params.photoUrl
        }
        if (params.resolutionType === 1) {
          delete params.transversePhotoUrl
        }
        const res = await addCharacter(params)
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
        if (params.resolutionType === 0) {
          delete params.photoUrl
        }
        if (params.resolutionType === 1) {
          delete params.transversePhotoUrl
        }
        const res = await modifyCharacter(params)
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

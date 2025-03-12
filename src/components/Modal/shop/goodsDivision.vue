<!-- 分组页面弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      size="small"
      class="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="分类名称" prop="catalogueName">
        <el-input v-model.trim="form.catalogueName" />
      </el-form-item>
      <el-form-item label="分类排序" prop="catalogueSort">
        <el-input v-model.trim="form.catalogueSort" />
      </el-form-item>
      <el-form-item label="分类图标" prop="catalogueUrl">
        <div>
          <div
            v-if="!form.catalogueUrl"
            class="image_poster"
            style="width: 128px; height: 128px"
            @click="getImgUrl()"
          >
            <i class="el-icon-plus" />
            <span>点击上传图片</span>
          </div>
          <div v-else>
            <AppMyImage
              :src="form.catalogueUrl"
              style="width: 128px; height: 128px"
              @close="delImage()"
              @success="changeImage"
            />
          </div>
          <div class="tips m-t-20">
            <div>分组图标是指在商品列表展示的图片。</div>
            <div>建议尺寸48*48，小于50kb的JPG、PNG格式图片</div>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
      <el-button
        v-if="type !== 2"
        type="primary"
        size="small"
        @click="send()"
      >提交</el-button>
    </div>
  </div>
</template>

<script>
import AppMyImage from '@/components/AppMyImage'
export default {
  components: {
    AppMyImage
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          catalogueName: '', // 分组名称
          catalogueSort: '', // 显示顺序
          catalogueUrl: '' // 目录图标路径
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        catalogueName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        catalogueUrl: [
          { required: true, message: '请选择分组图标', trigger: 'blur' }
        ]
      },
      form: {
        catalogueName: '', // 分组名称
        catalogueSort: '', // 显示顺序
        catalogueUrl: '' // 目录图标路径
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue && this.type === 1) {
          this.form = {
            catalogueName: '', // 分组名称
            catalogueSort: '', // 显示顺序
            catalogueUrl: '' // 目录图标路径
          }
        } else if (newValue && this.type === 3) {
          this.form = this.data
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    send() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.data,
            ...this.form
          }
          this.$emit('success', params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getImgUrl() {
      this.$SelectMaterial({
        visible: true,
        types: [0],
        success: res => {
          if (res.materialSize / 1024 > 50) {
            return this.$message('图标大小建议小于50kb')
          }
          console.log(res, 'res')
          this.form.catalogueUrl = res.materialUrl
        }
      })
    },
    // 删除选中图片
    delImage() {
      this.form.catalogueUrl = ''
    },
    // 改变选中图片
    changeImage(res) {
      this.form.catalogueUrl = res
    }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%),
      0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}
.image_poster {
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > span {
    margin-top: 13px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #1472ff;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>

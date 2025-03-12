<template>
  <!-- 添加类目弹框 -->
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form ref="form" :model="form" label-width="100px" size="small" class="form" :rules="rules" label-position="left">
      <el-form-item label="类目名称">
        <el-input v-model.trim="form.name" />
      </el-form-item>

      <el-form-item label="类目类型">
        <div class="form_type">
          <div v-for="(item) in option.appTypeOption" :key="item.value" class="form_type_redio" :class="{'active': item.value === form.type}" @click="form.type = item.value">
            <div class="form_type_redio_image" />
            <div>{{ item.label }}</div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="轮播图">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="类目序号">
        <el-input v-model.trim="form.value" />
      </el-form-item>

      <el-form-item label="类目下课程">
        <!-- <el-input v-model.trim="form.course" /> -->
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
import { mapState } from 'vuex'
export default {
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        type: 0,
        bannar: [],
        course: [],
        value: 0
      },
      rules: {},
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    ...mapState(['option'])
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onSubmit() {
      console.log('submit!')
    },
    send() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log(store.form)
          this.$emit('success', this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
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

  .form_type {
    display: flex;
    justify-content: space-between;
    .form_type_redio {
      width: 310px;
      flex-basis: 1;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      overflow: hidden;
      .form_type_redio_image {
        width: 230px;
        height: 90px;
        background-color: #ccc;
        margin-right: 10px;
      }
    }
    .active {
      border-color: #409eff;
    }
  }
}
</style>

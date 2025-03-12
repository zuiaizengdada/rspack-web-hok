<!-- 直播管理页面弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form ref="form" :model="form" label-width="100px" size="small" class="form" :rules="rules" label-position="left">
      <el-form-item label="直播间名称">
        <el-input v-model.trim="form.name" />
      </el-form-item>

      <el-form-item label="IP">
        <div class="addTenantName" @click="addTeacher">
          <i class="el-icon-plus" />
        </div>
      </el-form-item>

      <el-form-item label="开始时间">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>

      <el-form-item label="结束时间">
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>

      <el-form-item label="直播间封面">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <img v-if="form.poster" :src="form.poster" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="直播间助手">
        <div class="flex">
          <div v-for="(item, index) in form.assistant" :key="index" class="m-r-10">
            <AppAvatar :name="item.name" width="35" />
          </div>
          <div v-if="form.assistant.length < 5" class="addTenantName" @click="addTeacher">
            <i class="el-icon-plus" />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="是否开启评论">
        <el-switch
          v-model="form.canComment"
        />
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
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  components: {
    AppAvatar
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      rules: {
      }
    }
  },
  computed: {
    ...mapState({
      form: state => state.live.form
    })
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        // this.delImage()
      }
    }
  },
  methods: {
    send() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log(store.form)
          this.$emit('success')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addTeacher() {
      this.$Select({
        type: 'teacher',
        visible: true,
        multiple: false,
        params: { chatType: '' },
        success: (res) => {
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
}

::v-deep {
 .el-avatar>img {
    display: block;
    height: 100%;
    width: 100%;
    vertical-align: middle;
  }
  .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 128px;
      height: 128px;
      line-height: 128px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
}

.addTenantName {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px dashed #ccc;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
}

.addTenantName:hover {
  border-color: #409EFF;
}

.flex {
  display: flex;
}
</style>

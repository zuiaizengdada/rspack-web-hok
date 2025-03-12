<!-- 分组页面弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form ref="form" :model="form" label-width="100px" size="small" class="form" :rules="rules" label-position="left">
      <el-form-item label="关键词" prop="searchValue">
        <el-input v-model.trim="form.searchValue" />
      </el-form-item>
      <el-form-item label="推荐" prop="recommendFlag">
        <el-switch
          v-model="form.recommendFlag"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        />
        <span class="m-l-10">{{ {0: '否', 1: '是'}[form.recommendFlag] }}</span>
      </el-form-item>
      <el-form-item label="前端展示" prop="displayFlag">
        <el-switch
          v-model="form.displayFlag"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        />
        <span class="m-l-10">{{ {0: '否', 1: '是'}[form.displayFlag] }}</span>
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
export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          searchValue: '',
          recommendFlag: 1,
          displayFlag: 1
        }
      }
    }
  },
  data() {
    return {
      rules: {
      },
      form: {
        searchValue: '',
        recommendFlag: 1,
        displayFlag: 1
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue && this.type === 1) {
          this.form = {
            searchValue: '',
            recommendFlag: 1,
            displayFlag: 1
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
      this.$refs.form.validate((valid) => {
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
    pageValueChange() {
      console.log(this.form.pageValue)
      const obj = this.groupingType.find(v => v.dictValue === this.form.pageValue)
      this.form.pageName = obj.dictLabel
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
.image_poster {
  background: #F5F7FA;
  border-radius: 4px;
  border: 1px solid #DCDCDC;
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
    border: 1px dashed #1472ff;;
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

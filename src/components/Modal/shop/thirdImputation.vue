<!-- 第三方店铺归集弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form ref="form" :model="form" label-width="160px" size="small" class="form" :rules="rules" label-position="left">
      <el-form-item label="第三方平台" prop="platformType">
        <el-select v-model="form.platformType" placeholder="请选择" clearable>
          <!-- <el-option label="抖音" :value="1" />
          <el-option label="快手" :value="2" /> -->
          <el-option
            v-for="(item) in thirdShopType"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="开放平台应用名称" prop="platformAccount">
        <el-input v-model="form.platformAccount" clearable />
      </el-form-item>

      <el-form-item label="归集接受地址" prop="platformUrl">
        <el-input v-model="form.platformUrl" clearable />
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
import { mapGetters } from 'vuex'
import {
  addThird,
  editThird
} from '@/api/shop/thirdImputation'
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
    data: {
      type: Object,
      default: () => {
        return {
          platformType: '',
          platformAccount: '',
          platformUrl: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        platformAccount: [
          { required: true, message: '开放平台应用名称', trigger: 'blur' }
        ],
        platformType: [
          { required: true, message: '请选择第三方平台', trigger: 'change' }
        ],
        platformUrl: [
          { required: true, message: '请输入归集接收地址url', trigger: 'blur' }
        ]
      },
      form: {
        platformAccount: '',
        platformType: '',
        platformUrl: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'thirdShopType'
    ])
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue && this.type === 1) {
          this.form = {
            pageName: '', // 页面名称
            pageValue: '', // 页面value
            groupingName: '', // 分组名称
            displayNum: '', // 显示数量
            maxNum: '', // 最大数量
            sort: '', // 排序
            shelveFlag: 0
          }
        } else if (newValue && this.type === 3) {
          this.form = {
            ...this.data,
            platformType: this.data.platformType ? this.data.platformType : ''
          }
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
          if (this.type === 1) {
            // 新增
            this.add(params)
          } else {
            // 编辑
            this.edit(params)
          }
          // this.$emit('success', params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add(params) {
      this.loading = true
      addThird(params).then(res => {
        this.loading = false
        this.$emit('success')
      }).catch(() => {
        this.loading = false
      })
    },
    edit(params) {
      this.loading = true
      editThird(params).then(res => {
        this.loading = false
        this.$emit('success')
      }).catch(() => {
        this.loading = false
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

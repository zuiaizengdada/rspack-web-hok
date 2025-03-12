<template>
  <el-dialog
    :visible.sync="visible"
    width="500px"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <template slot="title">
      <span class="title">
        <i class="el-icon-warning-outline" />
        <p>移除人员确认</p>
      </span>
    </template>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="请选择岗位" label-width="100px" prop="postId">
        <el-select
          v-model="form.postId"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in postList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="item">
      <p>移除岗位：{{ info.postName }}</p>
      <p>移除人员：{{ info.postName }}</p>
      <p>转移岗位：{{ info.newPostName }}</p>
      <p style="margin-top: 15px; font-weight: bold">确认操作吗？</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="danger" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    info: {
      type: Object,
      default: () => {
        return {
          postId: undefined, // 原岗位id
          postName: undefined, // 原岗位名称
          staffNames: undefined, // 原岗位人员名称或多个人员名称
          staffIds: undefined // 原岗位人员id集合
        }
      }
    }
  },
  data() {
    return {
      form: { postId: undefined },
      rules: {
        postId: [
          {
            required: true,
            message: '请输入岗位名称',
            trigger: 'blur'
          }
        ]
      },
      postList: []
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
        }
      })
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  i {
    font-size: 20px;
    color: #f56c6c;
    margin-right: 10px;
  }
  p {
    font-size: 16px;
    font-weight: 600;
  }
}
.item {
  padding-left: 12px;
  p {
    margin: 4px 0;
    font-size: 14px;
    color: #606266;
  }
}
</style>

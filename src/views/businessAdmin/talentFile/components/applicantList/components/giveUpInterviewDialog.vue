<!-- 新增面试 -->
<template>
  <el-dialog
    title="放弃面试"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="post" :model="post" :rules="rules" label-width="120px">
      <el-form-item label="放弃人员" class="form-item" prop="name">
        <span>{{ post.name }}</span>
      </el-form-item>
      <el-form-item
        label="人员信息移入"
        class="form-item"
        prop="personnelInfoMoveIn"
      >
        <el-select
          v-model="post.personnelInfoMoveIn"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="简历库" :value="1" />
          <el-option label="黑名单" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" class="form-item" prop="type">
        <el-select v-model="post.type" placeholder="请选择" style="width: 100%">
          <el-option label="薪资" :value="1" />
          <el-option label="距离" :value="2" />
          <el-option label="工作内容" :value="3" />
          <el-option label="个人规划" :value="4" />
          <el-option label="未来发展" :value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" class="form-item">
        <el-input
          v-model="post.giveUpReason"
          type="textarea"
          :row="5"
          :maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      userList: [],
      post: {},
      rules: {
        personnelInfoMoveIn: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ]
      }
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
  created() {
    if (this.row.id) {
      this.post = { ...this.row }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.post.validate(valid => {
        if (valid) {
          this.$emit('submit', {
            ...this.post
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right !important;
}

.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>

<!-- 新增面试 -->
<template>
  <el-dialog
    title="移入黑名单"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="post" :model="post" :rules="rules" label-width="80px">
      <el-form-item label="类型" class="form-item" prop="moveType">
        <!-- 类型 -->
        <el-select
          v-model="post.moveType"
          clearable
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="移入原因" class="form-item" prop="moveReason">
        <!-- 文本域 -->
        <el-input
          v-model="post.moveReason"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="
            请输入原因
          "
          show-word-limit
          maxlength="50"
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
      post: {},
      options: [
        {
          label: '薪资',
          value: 1
        },
        {
          label: '距离',
          value: 2
        },
        {
          label: '工作内容',
          value: 3
        },
        {
          label: '个人规划',
          value: 4
        },
        {
          label: '未来发展',
          value: 5
        }
      ],
      rules: {
        moveType: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        moveReason: [
          {
            required: true,
            message: '请输入移入原因',
            trigger: 'blur'
          },
          { min: 1, max: 50, message: '限制最多输入50个字符', trigger: 'blur' }
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
  text-align: right;
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

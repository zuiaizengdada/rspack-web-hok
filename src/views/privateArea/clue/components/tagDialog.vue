<template>
  <el-dialog title="新增个人标签" :modal="false" :visible.sync="visible" width="490px" :close-on-click-modal="false" :destroy-on-close="true" @close="handleClose">
    <div>
      <div class="inputBox">
        <el-input
          v-model="state"
          placeholder="请输入标签，按enter键生成标签"
          size="small"
          :maxlength="10"
          :style="{ width: '450px' }"
          show-word-limit
          @keyup.enter.native="handleEnter"
        />
        <el-button
          type="primary"
          size="small"
          @click="handleEnter"
        >添加</el-button>
      </div>
      <div v-show="tag.length" class="tagsBox" :style="{ width: '450px' }">
        <el-tag
          v-for="(item, index) in tag"
          :key="item.tagId"
          :closable="item.isCanDelete"
          size="small"
          :disable-transitions="false"
          @close="handleClose(index)"
        >{{ item.tagName }}</el-tag>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { userTagSave } from '@/api/privateArea/CRM.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tagList: {
      type: Array,
      default: () => []
    },
    platformUserId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    tag: [],
    state: ''
  }),
  watch: {
    visible: {
      handler: function() {
        if (this.visible) {
          this.tag = this?.tagList || []
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.tag = []
      this.$emit('update:visible', false)
    },
    handleOk() {
      this.$emit('handleOk', this.tag)
      this.$emit('update:visible', false)
    },
    async handleEnter() {
      if (!this.state) return this.$message.warning('请输入需要添加的标签！')
      this.handleSelect({ value: this.state })
    },
    async handleSelect(item) {
      const { code } = await userTagSave({
        tagName: item.value,
        platformUserId: this.platformUserId
      })

      if (code === 1) {
        this.tag.push({ tagName: item.value })
        this.list = []
        this.state = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  font-weight: 400;
  font-size: 12px;
  color: #999999;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-top: 3px;
}
.inputBox {
  display: flex;
  align-items: center;
  > button {
    margin-left: 5px;
    height: 31px;
  }
}
.tagsBox {
  width: 450px;
  padding: 0 15px;
  padding-bottom: 4px;
  padding-top: 5px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  margin-top: 10px;
  > span {
    margin-right: 16px;
    margin-bottom: 3px;
  }
}
</style>

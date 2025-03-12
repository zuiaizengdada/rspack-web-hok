<template>
  <div :class="{ assessBox: data.length > 0 }">
    <el-tag
      v-for="(tag, index) in data"
      :key="tag.userId"
      v-loading="loading"
      class="remindPersonListView"
      closable
      @close="delAssessUsers(tag, index)"
    >
      {{ tag.nickName }}
    </el-tag>
    <el-button
      :loading="loading"
      size="mini"
      class="remindPersonListView"
      :disabled="disabled"
      @click="selectUser"
    >
      <i class="el-icon-plus el-icon--left" />
      {{ btnText }}
    </el-button>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    btnText: {
      type: String,
      default: '添加'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    // 点击删除通知人员
    delAssessUsers(tag, index) {
      this.$delModal({
        tips: '确定删除该提醒人员?',
        success: () => {
          this.$emit('del', index)
        }
      })
    },
    // 点击添加通知人员
    selectUser() {
      const _this = this
      this.$AddressBook({
        visible: true,
        multiple: true,
        minlength: 1,
        type: [1],
        checkUser: this.data,
        success: res => {
          _this.$emit('add', res.user)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.assessBox {
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .remindPersonListView {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}
</style>

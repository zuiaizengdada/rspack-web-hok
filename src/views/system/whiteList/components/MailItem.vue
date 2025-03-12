<template>
  <div class="phone-item-container flex flex-wrap">

    <el-tag v-for="(item,index) in tagList" :key="item.userId" closable style="margin-bottom:10px;" @close="closeTagItem(index)">{{ item.mail }}</el-tag>

    <div class="add" style="margin-bottom:10px;">
      <el-input v-if="visiblePhoneInput" v-model="phone" style="width:200px" placeholder="请输入邮箱号码" @keyup.native.enter="enterInputPhone" @blur="blueInputPhone" />
      <el-button v-else size="mini" icon="el-icon-plus" @click="handleClickAdd">添加邮箱</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tagList: [],
      phone: '',
      visiblePhoneInput: false
    }
  },
  watch: {
    list(val) {
      this.tagList = val
    }
  },
  methods: {
    closeTagItem(index) {
      this.$emit('delete', index)
    },
    handleClickAdd() {
      this.visiblePhoneInput = true
    },
    enterInputPhone() {
      const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (mailRegex.test(this.phone)) {
        this.$emit('success', this.phone)
        this.phone = ''
        this.visiblePhoneInput = false
      } else {
        this.$message.error('请输入正确的邮箱')
      }
    },
    blueInputPhone() {
      if (!this.visiblePhoneInput) return
      const phoneRegex = /^1[3456789]\d{9}$/
      if (phoneRegex.test(this.phone)) {
        this.$emit('success', this.phone)
        this.phone = ''
        this.visiblePhoneInput = false
      } else {
        this.$message.error('请输入正确的邮箱')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tag{
    margin-right:12px;
}

</style>

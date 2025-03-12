<template>
  <div class="phone-item-container flex flex-wrap">

    <el-tag v-for="(item,index) in tagList" :key="item.userId" closable style="margin-bottom:10px;" @close="closeTagItem(index)">{{ item.phone }}</el-tag>

    <div class="add" style="margin-bottom:10px;">
      <el-input v-if="visiblePhoneInput" v-model="phone" style="width:200px" placeholder="请输入手机号码" @keyup.native.enter="enterInputPhone" @blur="blueInputPhone" />
      <el-button v-else size="mini" icon="el-icon-plus" @click="handleClickAdd">添加手机号码</el-button>
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
      // const phoneRegex = /^1[3456789]\d{9}$/
      let strFlag = false
      if (this.phone.length >= 6 && this.phone.length <= 15) {
        strFlag = true
      }
      if (strFlag) {
        // this.tagList.push({ phone: this.phone })
        this.$emit('success', this.phone)
        this.phone = ''
        this.visiblePhoneInput = false
      } else {
        this.$message.error('请输入正确的手机号码')
      }
    },
    blueInputPhone() {
      if (!this.visiblePhoneInput) return
      const phoneRegex = /^1[3456789]\d{9}$/
      if (phoneRegex.test(this.phone)) {
        // this.tagList.push({ phone: this.phone })
        this.$emit('success', this.phone)
        this.phone = ''
        this.visiblePhoneInput = false
      } else {
        this.$message.error('请输入正确的手机号码')
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

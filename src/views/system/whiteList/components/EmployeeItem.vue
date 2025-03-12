<template>
  <div class="flex items-center flex-wrap">
    <el-tag v-for="(item,index) in tagList" :key="item.userId" closable style="margin-bottom:10px;" @close="closeTagItem(index)">{{ item.nickName }}</el-tag>
    <el-button icon="el-icon-plus" style="margin-bottom:10px;" @click="handleClickAdd">添加提醒人员</el-button>
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
      tagList: []
    }
  },
  watch: {
    list(val) {
      console.log('watch: ', val)
      this.tagList = val
    }
  },
  methods: {
    closeTagItem(index) {
      // this.tagList.splice(index, 1)
      this.$emit('delete', index)
    },
    handleClickAdd() {
      console.log('this.tagList: ', this.tagList)
      this.$AddressBook({
        visible: true,
        multiple: true,
        minlength: 1,
        type: [1],
        checkUser: this.tagList,
        success: (res) => {
          // res.user.forEach(item => {
          //   list.push({
          //     userId: item.userId
          //   })
          // })
          // this.tagList = res.user
          this.$emit('success', res.user)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tag{
    margin-right:12px;
}

</style>

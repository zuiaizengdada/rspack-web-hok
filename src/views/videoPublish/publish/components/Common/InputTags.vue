<template>
  <div class="input-tags-container flex flex-wrap w-full relative">
    <div class="tag-list flex items-center flex-wrap">
      <el-tag v-for="(item,index) in tagList" :key="item.index" class="tag-item" closable @close="deleteTag(index)">  # {{ removeSymbol(item.value) }}</el-tag>
      <el-input ref="tagInput" v-model="tagValue" style="width:200px" maxlength="10" placeholder="按回车键Enter创建话题" @keyup.enter.native="keyupEnterTag" @keydown.delete.native="deleteInput" />
    </div>
    <p v-if="isOverMaxTagList" class="tips-error absolute">最多添加{{ max }}个话题</p>
  </div>
</template>
<script>
export default {
  props: {
    max: {
      type: Number,
      default: 20
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tagList: [],
      tagValue: '',
      isOverMaxTagList: false,
      deleteFlag: false,
      isChineseInput: false
    }
  },
  watch: {
    list(val) {
      this.tagList = val
    },
    tagValue(val) {
      if (val !== '') {
        this.deleteFlag = false
      }
    }
  },
  methods: {
    keyupEnterTag() {
      if (this.tagValue) {
        this.addTagItem(this.removeSymbol(this.tagValue))
      }
      this.tagValue = ''
    },
    keyupDeleteTag() {
      // console.log('this.tagValue:::', this.tagValue)
      // if (this.tagValue === '' && !this.deleteFlag) {
      //   this.deleteFlag = true
      //   return
      // }
      if (this.tagValue === '' && !this.isChineseInput) {
        const index = this.tagList.length - 1
        this.deleteTag(index)
      }
    },
    deleteInput() {
      if (this.tagValue === '' && !this.isChineseInput) {
        const index = this.tagList.length - 1
        this.deleteTag(index)
      }
    },
    deleteTag(index) {
      if (this.tagValue.length === 0) {
        this.tagList.splice(index, 1)
        this.$emit('update', this.tagList)
        this.$refs.tagInput.focus()
        this.isOverMaxTagList = false
      }
    },
    addTagValue(name) {
      if (this.tagValue.length < 1) {
        this.tagValue = name
      }
    },
    addTagItem(value) {
      if (this.tagList.length < 20) {
        this.tagList.push({
          value,
          index: Date.now()
        })
        this.$emit('update', this.tagList)
      } else {
        this.isOverMaxTagList = true
      }
    },

    // 删除 #
    removeSymbol(val) {
      return val.replace('#', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.input-tags-container{
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding:0px 8px;
    .tag-list{
        // padding-top:6px;
        .tag-item{
              margin:6px 3px;
        }
    }
}

.tips-error{
  bottom:-20px;
  left:0;
  font-size:14px;
  color:#F53F3F;
}
::v-deep .el-input__inner{
    border:none;
    padding:0;
}
</style>

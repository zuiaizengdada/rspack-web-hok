<template>
  <div>
    <slot name="kuaishouTit" class="mb-20" />
    <div class="inputTag" :style="tagList==''?'':'padding-top:8px'">
      <div class="tagList">
        <el-tag
          v-for="(tag,index) in tagList"
          :key="index"
          class="tagDetails"
          closable
          @close="handleClose(index)"
        >
          {{ tag.name }}
        </el-tag>
        <el-input ref="taginput" v-model="value1" :style="tagList==''?'':'margin-bottom:8px'" placeholder="按回车键Enter创建标签" class="tag-input" size="mini" @keyup.native="changeInput" @input="changeValue" />
      </div>
    </div>
    <div class="m-t-16">
      <span class="addTags">
        添加标签 {{ tagList.length }}/10
      </span>
    </div>
    <div class="m-t-16">
      <el-tag
        v-for="(tag,index) in tagList"
        :key="index"
        type="info"
        size="mini"
        class="minitags"
      >
        {{ tag.name }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'

export default {
  name: 'BilibiliLabel',
  mixins: [mixinsAllOperations],
  data() {
    return {
      value1: '',
      isDeleteFlag: false, // 计数器 第一次value为0时不删除标签
      tagList: []
    }
  },
  methods: {
    // 初始化数据
    initData() {
      console.log(this.publishChannelData, '标签')
      this.tagList = this.publishChannelData.activeData.tags || []
    },
    changeValue() {
      this.isDeleteFlag = false
    },
    changeInput(e) {
      console.log(e, 'keycode')
      if (e.keyCode === 8 && this.tagList && this.value1 === '') {
        if (!this.isDeleteFlag) {
          this.isDeleteFlag = true
          return
        }
        this.tagList.splice(this.tagList.length - 1, 1)
        this.$refs.taginput.onfocus()
      }
      if (e.keyCode === 13) {
        if (this.value1 === '' || this.tagList.length >= 10) {
          return
        }
        if (this.value1.length > 10) {
          this.value1 = ''
          this.isDeleteFlag = true
        } else {
          this.tagList.push({ name: this.value1 })
          this.value1 = ''
          this.isDeleteFlag = true
        }
      }
      this.updateTagList()
    },
    handleClose(index) {
      this.tagList.splice(index, 1)
      // this.$refs.taginput.focus()
      this.updateTagList()
    },
    updateTagList() {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'tags', this.tagList)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  border: none;
  padding: 0;
}
.minitags{
  margin-right: 8px;
}
.addTags{
  padding: 3px 10px;
  background: #F1F5FC;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
}
.tagDetails{
  margin-right: 8px;
  margin-bottom: 8px;
}
.inputTag {
  width: 100%;
  min-height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding:0 12px;
  box-sizing: border-box;
  .tagList{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  .tag-input{
    min-width: 50px;
    flex: 1;
    height: 28px;
  }
}
</style>

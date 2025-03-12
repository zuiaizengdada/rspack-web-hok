<template>
  <div>
    <div class="inputBox">
      <el-autocomplete
        v-model="state"
        type="text"
        :placeholder="placeholder"
        :fetch-suggestions="querySearch"
        size="small"
        :trigger-on-focus="true"
        :maxlength="10"
        :style="{ width: width }"
        show-word-limit
        @keyup.enter.native="handleEnter"
        @select="handleSelect"
      />
      <el-button
        v-if="isAdd"
        type="primary"
        size="small"
        @click="handleEnter"
      >添加</el-button>
    </div>
    <div class="tips">最多可新增7个标签</div>
    <div v-show="value.length" class="tagsBox" :style="{ width: width }">
      <el-tag
        v-for="(item, index) in value"
        :key="item.tagId"
        closable
        size="small"
        :disable-transitions="false"
        @close="handleClose(index)"
      >{{ item.tagName }}</el-tag>
    </div>
  </div>
</template>
<script>
import { getSaleTaskList, addSaleTaskTag } from '@/api/privateArea/CRM.js'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    tagType: {
      type: String,
      default: '1'
    },
    params: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '请输入标签，按enter键生成标签'
    },
    width: {
      type: String,
      default: '450px'
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    getTagQuery: {
      type: [Function, undefined],
      default: undefined
    }
  },
  data: () => ({
    state: '',
    list: []
  }),
  methods: {
    async querySearch(queryString, cb) {
      if (this.getTagQuery) {
        const data = await this.getTagQuery({ tagName: queryString })
        if (data?.length) {
          this.list =
          data?.map(item => ({
            value: item.tagName,
            ...item
          })) || []
          return cb(this.list)
        }
        return cb([])
      }
      const params = {
        pageIndex: 1,
        pageSize: 100,
        tagName: queryString,
        tagType: this.tagType,
        ...this.params
      }
      const { code, data } = await getSaleTaskList(params)
      if (code === 1 && data?.items?.length) {
        this.list =
          data?.items?.map(item => ({
            value: item.tagName,
            ...item
          })) || []
        return cb(this.list)
      }
      cb([])
    },
    async handleSelect(item) {
      if (this.value?.length >= 7) { return this.$message.warning('最多可新增7个标签！') }
      const { code, data } = await addSaleTaskTag({
        tagName: item.value,
        tagType: this.tagType
      })
      let list = [...this.value]
      if (code === 1 && data) {
        const newList = list?.find(item => item.tagId === data)
        if (!newList) { list = [{ tagId: data, tagName: item?.value }, ...this.value] }
        this.$emit('input', list)
        this.list = []
        this.state = ''
      }
    },
    async handleEnter() {
      if (!this.isAdd) return
      if (!this.state) return this.$message.warning('请输入需要添加的标签！')
      this.handleSelect({ value: this.state })
    },
    handleClose(index) {
      const array = [...this.value]
      array.splice(index, 1)
      this.$emit('input', array)
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

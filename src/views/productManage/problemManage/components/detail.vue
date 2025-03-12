
<template>
  <el-drawer title="用户问题" :visible.sync="drawer" class="drawer-container" :size="400" @close="handleClose">
    <div>{{ current.questionContent }}</div>
    <div class="drawer__footer">
      <el-button :disabled="pageIndex === 1" @click="previous">上一个</el-button>
      <el-button :disabled="pageIndex === total" type="primary" @click="next">下一个</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { questionPage, questionRead } from '@/api/product/question'
export default {
  data() {
    return {
      drawer: false,
      current: {
        id: '',
        questionContent: ''
      },
      pageIndex: 1,
      total: 0,
      params: {},
      idList: []
    }
  },
  methods: {
    open(data) {
      this.drawer = true
      this.current = data
      this.pageIndex = data.index
      this.total = data.total
      this.params = data.params
      this.idList.push(this.current.id)
    },
    async handleRead() {
      await questionRead([...new Set(this.idList)])
    },
    async getDetail() {
      const { code, data } = await questionPage({
        ...this.params,
        pageIndex: this.pageIndex,
        pageSize: 1
      })
      if (code === 1) {
        this.current = data.items[0]
        this.total = data.total
        this.idList.push(this.current.id)
      }
    },
    next() {
      this.pageIndex += 1
      console.log(this.pageIndex, this.total)
      if (this.pageIndex >= this.total) {
        this.pageIndex = this.total
      }
      this.getDetail()
    },
    async handleClose() {
      await this.handleRead()
      this.$emit('close')
    },
    previous() {
      this.pageIndex -= 1
      if (this.pageIndex <= 1) {
        this.pageIndex = 1
      }
      this.getDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container ::v-deep {
  .el-drawer__header {
    font-size: 16px;
    color: #777;
  }
  .el-drawer__body {
    margin: 20px;
    font-size: 14px;
    color: #333;
  }
  .drawer__footer {
    position: fixed;
    bottom: 20px;
    .el-button {
      width: 180px;
    }
  }
}
</style>

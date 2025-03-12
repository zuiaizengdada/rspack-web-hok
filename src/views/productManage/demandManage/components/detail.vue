
<template>
  <el-dialog
    v-if="visible"

    :close-on-click-modal="false"
    class="dialog-container"
    title="详情"
    width="916px"
    :visible.sync="visible"
    @close="handleClose"
  >
    <el-descriptions>
      <el-descriptions-item label="话题ID">{{ form.topicId }}</el-descriptions-item>
      <el-descriptions-item label="所属IP">{{ form.teacherName }}</el-descriptions-item>
      <el-descriptions-item label="操作人">{{ form.operateBy }}</el-descriptions-item>
      <el-descriptions-item label="操作时间">{{ form.operateTime | parseTime }}</el-descriptions-item>
    </el-descriptions>
    <div ref="dialog" class="box-container" tabindex="0" hidefocus="true">
      <div class="sign">话题内容</div>
      <div class="title">{{ form.keyword }}</div>
      <div class="description">
        {{ form.description }}
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" size="small" @click="previous">上一个</el-button>
      <el-button type="primary" :loading="loading" size="small" @click="next">下一个</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { demandList } from '@/api/product/demand'
export default {
  data() {
    return {
      visible: false,
      form: {
        topicId: '',
        description: '',
        keyword: '',
        operateBy: '',
        teacherName: '',
        operateTime: ''
      },
      loading: false,
      params: {},
      pageIndex: 1,
      domainList: [],
      total: 0
    }
  },
  methods: {
    async open({ row, params, total }) {
      this.form = JSON.parse(JSON.stringify(row))
      this.params = params
      this.pageIndex = row.index
      this.visible = true
      this.total = total
      this.$nextTick(() => {
        this.$refs.dialog.focus()
      })
      window.addEventListener('keydown', this.handleKeyup)
    },
    handleClose() {
      this.visible = false
      window.removeEventListener('keydown', this.handleKeyup)
      this.$emit('close')
    },
    previous() {
      this.pageIndex -= 1
      this.loading = true
      if (this.pageIndex < 1) {
        this.$alert('已翻到第一页', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        this.pageIndex = 1
        this.loading = false
        return
      }
      this.detail()
    },
    handleKeyup(e) {
      const code = e.keyCode
      if (code === 38) {
        this.previous()
        return
      }
      if (code === 40) {
        this.next()
      }
    },
    next() {
      this.pageIndex += 1
      this.loading = true
      if (this.pageIndex > this.total) {
        this.$alert('已翻到最后一页', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        this.pageIndex = this.total
        this.loading = false
        return
      }
      this.detail()
    },
    async detail() {
      try {
        const { code, data } = await demandList({
          ...this.params,
          pageSize: 1,
          pageIndex: this.pageIndex
        })
        if (code === 1) {
          this.form = data.items[0]
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table_wrap {
  height: 100%;
}
.tips {
  margin-right: 10px;
}
.dialog-container ::v-deep{
    .el-dialog{
        border-radius: 10px;
    }
    .el-dialog__body{
        padding: 10px 20px
    }
    .el-dialog__header{
        border-bottom: 1px solid #E7E7E7;
        .el-dialog__title{
            font-weight: bold;
        }
    }
}
.box-container{
    height: 324px;
    padding: 20px;
    background: #F7FBFF;
    border-radius: 8px;
    position: relative;
    .sign{
        position: absolute;
        left: 0px;
        top: 0px;
        padding: 4px 16px;
        background: #0C6FFF;
        border-radius: 8px 0px 8px 0px;
        font-size: 14px;
        color: #FFFFFF;
    }
    .title{
        margin-top: 26px;
        color: rgba(51,51,51,0.9);
        font-weight: bold;
        font-size: 20px;
        text-align: center;
    }
    .description{
        font-size: 18px;
        color: #161616;
        text-indent: 2em;
        margin-top: 16px;
    }
}
</style>

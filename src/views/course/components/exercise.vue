<template>
  <div>
    <div v-if="!detail && !edit" v-loading="loading" v-permission="['system:practice:add', permsList]" class="noData">
      <span class="customer-info-remark__none">暂无练习，点击添加</span>
      <i slot="reference" class="el-icon-edit a_link" type="primary" @click="edit = true" />
    </div>
    <el-form v-if="edit" ref="form" :model="form" label-width="120px">
      <el-form-item label="练习题目标题: " prop="title">
        <el-input v-model="form.title" maxlength="20" show-word-limit />
      </el-form-item>

      <el-form-item label="练习题目:" prop="subject">
        <el-input v-model="form.subject" :autosize="{ minRows: 5 }" maxlength="500" show-word-limit type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="editTitle">保存</el-button>
        <el-button :loading="loading" @click="edit = false">取消</el-button>
      </el-form-item>
    </el-form>

    <el-form v-if="detail && !edit" ref="form" :model="form" label-width="120px">
      <el-form-item label="练习题目标题: " prop="title">
        <span>{{ detail.title }}</span>
      </el-form-item>

      <el-form-item label="练习题目:" prop="subject">
        <div style="white-space:pre-line;" v-html="form.subject" />
      </el-form-item>

      <el-form-item v-permission="['system:practice:edit', permsList]">
        <el-button type="primary" :loading="loading" @click="edit = true">编辑</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPracticeByGoodsId, editPractice } from '@/api/course'
export default {
  data() {
    return {
      // 表单的数据
      form: {
        title: '',
        subject: ''
      },
      // 练习的数据。没有的时候为null
      detail: null,
      loading: false,
      edit: false, // 编辑状态
      permsList: this.$route.meta.permsList || []
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getPractice()
  },
  methods: {
    // 获取练习
    getPractice() {
      this.loading = true
      getPracticeByGoodsId(this.id).then(res => {
        if (res.data) {
          this.form.title = res.data.title || ''
          this.form.subject = res.data.subject || ''
          this.detail = {
            title: res.data.title || '',
            subject: res.data.subject || ''
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 保存练习
    editTitle() {
      this.titleLoading = true
      this.subjectLoading = true
      const data = {
        goodsId: this.id,
        title: this.form.title,
        subject: this.form.subject
      }
      editPractice(data).then(res => {
        console.log(res, 'res')
        this.$notify.success({
          title: '提示',
          message: '操作成功'
        })
        this.edit = false
        this.getPractice()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.noData {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.customer-info-remark__none {
  color: #999;
  margin-right: 8px;
}
</style>

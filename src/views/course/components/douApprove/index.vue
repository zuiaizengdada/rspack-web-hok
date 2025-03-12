<template>
  <AppDialog
    v-if="visible"
    v-model="visible"
    width="500px"
    height="400px"
    title="确定提交抖音审核？"
    class="dou-container"
    :loading="loading"
    @success="handleSubmit"
  >
    <ul>
      <li v-for="(item, index) in tips" :key="item">
        <span v-if="index !== 0">{{ `${index}.` }}</span>
        <span
          v-if="index === 1"
        >错放课程分类会导致拒审，请查看<span
          style="color: #0c6fff; cursor: pointer"
          @click="handleClick"
        >分类规范</span>，找到正确的类目编码，谨慎填写</span>
        <span v-else>{{ item }}</span>
      </li>
    </ul>
    <el-form ref="form" :model="form" label-width="130px" :rules="rules">
      <el-form-item label="一级课程分类：" prop="firstClass">
        <m-select
          v-model="form.firstClass"
          style="width: 300px"
          :dict-list="classOneSelectData"
          :param="{ value: 'classId', label: 'className' }"
          @change="handleSelectClass"
        />
      </el-form-item>
      <el-form-item label="二级课程分类：" prop="secondClass">
        <m-select
          v-model="form.secondClass"
          style="width: 300px"
          :dict-list="classTwoSelectData"
          :param="{ value: 'classId', label: 'className' }"
        />
      </el-form-item>
      <el-form-item label="本次修改内容：" prop="content">
        <el-input
          v-model="form.content"
          placeholder="请输入修改内容"
          :maxlength="100"
          clearable
          type="textarea"
          class="w-300"
        />
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  douClassSubmit,
  getClassOneSelectData,
  getClassTwoSelectData,
  lastSubmitLog
} from '@/api/dou/index'
export default {
  name: 'DouApprove',
  components: {
    AppDialog
  },
  data() {
    return {
      form: {
        content: '',
        firstClass: '',
        secondClass: ''
      },
      visible: false,
      rules: {
        onecourse: [
          { required: true, message: '一级课程分类不能为空', trigger: 'blur' }
        ],
        twocourse: [
          { required: true, message: '二级课程分类不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '本次修改内容不能为空', trigger: 'blur' }
        ],
        firstClass: [
          { required: true, message: '请输入一级课程分类', trigger: 'blur' }
        ],
        secondClass: [
          { required: true, message: '请输入一级课程分类', trigger: 'blur' }
        ]
      },
      goodsId: '',
      tips: [
        '请确认以下内容是否符合抖音小程序规范',
        '商品所属类目是否正确？',
        '详情描述是否含有广告词限制？',
        '老师机构信息与课程详情信息不符？',
        '落地页课程详情页是否出现空白屏？',
        '是否收看方式和售后服务展示？',
        '是否包含购买须知？',
        '超过1000元商品是否有试看章节？'
      ],
      loading: false,
      classOneSelectData: [],
      classTwoSelectData: []
    }
  },
  created() {
    this.getSelectData()
  },
  methods: {
    async open(goodsId) {
      this.goodsId = goodsId
      this.form.content = ''
      this.visible = true
      const { data } = await lastSubmitLog(goodsId)
      this.form.firstClass = data?.firstClass ? Number(data?.firstClass) : ''
      this.form.secondClass = data?.secondClass ? Number(data?.secondClass) : ''
      this.form.content = data?.content ?? ''
      if (this.form.firstClass) this.getClassTwoSelectData()
    },
    handleClick() {
      window.open(
        'https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/operation/industry-norm/pan-knowledge/knowledge/',
        '_blank'
      )
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    async submit() {
      const params = {
        goodsId: this.goodsId,
        content: this.form.content,
        firstClass: this.form.firstClass,
        secondClass: this.form.secondClass
      }
      this.loading = true
      try {
        const { code } = await douClassSubmit(params)
        if (code === 1) {
          this.$notify.success({
            title: '提示',
            message: '操作成功'
          })
          this.$emit('success')
          this.visible = false
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getSelectData() {
      const { data } = await getClassOneSelectData()
      console.log(1111111, data)
      this.classOneSelectData = data
    },
    async handleSelectClass() {
      this.form.secondClass = ''
      if (!this.form.firstClass) {
        this.classTwoSelectData = []
        return
      }
      try {
        this.getClassTwoSelectData()
      } catch {
        this.classTwoSelectData = []
      }
    },
    async getClassTwoSelectData() {
      const { data } = await getClassTwoSelectData(this.form.firstClass)
      this.classTwoSelectData = data || []
    }
  }
}
</script>

<style lang="scss" scoped>
.dou-container {
  ul {
    margin: 20px 30px;
  }
}
</style>

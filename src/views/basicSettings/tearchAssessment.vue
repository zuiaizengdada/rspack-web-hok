<template>
  <!-- 师资评估维度管理 -->
  <MCard v-loading="loading" class="assessment">
    <div class="assessment-title">
      <div class="tips">
        <span>注：评估维度最多为10项，维度加起来必须等于100分</span>
        <el-button
          v-if="form.assessment.length < 10"
          type="primary"
          icon="el-icon-plus"
          :disabled="!isEdit"
          @click="handleAdd"
        >添加评估维度</el-button>
      </div>
    </div>
    <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container">
      <div class="assessment-content">
        <el-form
          ref="form"
          class="assessment-from"
          label-width="85px"
          size="small"
          :model="form"
          :inline="true"
        >
          <draggable
            :list="form.assessment"
            tag="div"
            draggable=".assessment-from-item"
            v-bind="{
              animation:500 ,
              handle:'.draggle',
            }"
            :move="handleMove"
          >
            <!-- <transition-group> -->
            <div v-for="(domain, index) in form.assessment" :key="index" class="assessment-from-item">
              <div class="assessment-from-header">
                <el-form-item
                  label="评估维度"
                  :prop="'assessment.' + index + '.evaluationDimension'"
                  :rules="[{ required: true,validator: validateDimension, trigger: 'blur'}]"
                >
                  <el-input
                    v-model="domain.evaluationDimension"
                    :disabled="!isEdit"
                    maxlength="6"
                    show-word-limit
                    clearable
                    class="w-200"
                  />
                </el-form-item>
                <el-form-item
                  label="评分值"
                  :prop="'assessment.' + index + '.point'"
                  :rules="[
                    { required: true,message: '评分值不能为空', trigger: 'blur'},
                    { validator: validatePoint, trigger: 'blur'}
                  ]"
                >
                  <el-input
                    v-model.number="domain.point"
                    style="width: 116px"
                    :disabled="!isEdit"
                  >
                    <el-button
                      slot="append"
                    >分</el-button>
                  </el-input>
                </el-form-item>
                <div v-if="isEdit" class="draggle">
                  <i class="el-icon-rank" />
                  排序
                </div>
              </div>
              <div>
                <el-form-item
                  label="维度描述"
                  :prop="'assessment.' + index + '.dimensionDescription'"
                  :rules="[{ required: true,message: '维度描述不能为空', trigger: 'blur'}]"
                >
                  <el-input
                    v-model="domain.dimensionDescription"
                    :disabled="!isEdit"
                    style="width: 472px"
                    clearable
                    maxlength="30"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item>
                  <el-button v-if="isEdit" type="danger" class="danger" plain @click="handleDel(index)">删除</el-button>
                </el-form-item>
              </div>
            </div>
            <!-- </transition-group> -->
          </draggable>
        </el-form>
      </div>
    </el-scrollbar>
    <div
      v-permission="['web:tearchAssessment:edit', permsList]"
      class="assessment-footer"
    >
      <template v-if="!isEdit">
        <el-button size="small" type="primary" @click="isEdit = true">编辑</el-button>
      </template>
      <template v-else>
        <el-button size="small" type="primary" @click="handleSave">保存</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </template>
    </div>
  </MCard>
</template>

<script>
import draggable from 'vuedraggable'
import { getDimensionOperateData } from '@/utils/getApiData'
import { getDimensionOperate } from '@/api/tearchCenter/index'
export default {
  components: {
    draggable
  },
  data() {
    const validateDimension = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入评估维度'))
      } else {
        const assessment = this.form.assessment.filter(i => i.evaluationDimension)
        const evaluationDimension = assessment.filter(i => i.evaluationDimension !== value)
        if (assessment.length > evaluationDimension.length + 1) {
          callback(new Error('评估维度不能重复'))
          return
        }
        callback()
      }
    }
    const validatePoint = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('评分值不能小于等于0'))
      } else {
        callback()
      }
    }
    return {
      form: {
        assessment: [
          { evaluationDimension: '', point: '', dimensionDescription: '' },
          { evaluationDimension: '', point: '', dimensionDescription: '' },
          { evaluationDimension: '', point: '', dimensionDescription: '' },
          { evaluationDimension: '', point: '', dimensionDescription: '' },
          { evaluationDimension: '', point: '', dimensionDescription: '' }
        ]
      },
      isEdit: '',
      permsList: this.$route.meta.permsList || [],
      validateDimension,
      validatePoint,
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        this.form.assessment = await getDimensionOperateData()
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleDel(index) {
      this.form.assessment.splice(index, 1)
    },
    handleAdd() {
      this.form.assessment.push(
        { evaluationDimension: '', point: '', dimensionDescription: '' }
      )
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.getList()
      this.isEdit = false
    },
    async save() {
      try {
        const point = this.form.assessment.map(i => i.point).reduce((prev, cur) => prev + cur)
        if (point !== 100) {
          this.$message.error('评估维度总分必须等于100分')
          return
        }
        const params = this.form.assessment.map((i, index) => {
          return {
            ...i,
            sort: index + 1
          }
        })
        const { code } = await getDimensionOperate(params)
        if (code === 1) {
          this.isEdit = false
          this.getList()
          this.$message.success('保存成功')
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleMove() {
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/styles/variables.scss';
.assessment {
  @include responsive-height(62px);
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .assessment-title {
    padding: 20px 0 ;
    margin: 0 20px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 24px;
    border-bottom: 1px solid #E7E7E7;
    .tips {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #F53F3F;
      line-height: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .scroll-container{
    flex: 1;
  }
  .assessment-content {
    width: 100%;
    padding: 20px;
    display: flex;
    overflow: auto;
    flex-direction: column;
    .draggle{

      margin: 0 0 20px 110px;
      cursor: move;
      display: flex;
      align-items: center;
      font-size: 14px;
      i{
        font-size: 18px;
        margin-right: 5px;
      }
    }
    .assessment-from {
      .assessment-from-item {
        padding-top: 20px;
        border-bottom: 1px solid #E7E7E7;
        .assessment-from-header{
          display: flex;
          align-items: center;
        }
      }
      .danger{
        margin-left: 60px;
        background: #fff !important;
        color: #F53F3F !important;
        border-color: #F53F3F !important;
      }
    }
  }
  .assessment-footer {
    height: 62px;
    box-shadow: -2px 0px 6px 0px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
::v-deep {
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
}
</style>

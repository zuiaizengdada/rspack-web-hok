<template>
  <!-- 顶部搜索栏 -->
  <div class="filterTop">
    <el-form ref="form" :model="form" label-width="auto" size="small">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="IP">
            <teacherSelect v-model="form.lecturerId" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程名称">
            <courseSelect
              ref="CourseSelect"
              style="width: 200px"
              :default-id="form.goodsId"
              :value="form.goodsName"
              :tab-list="tabList"
              current-id="3"
              @selected="handleCourseSelect"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="评价等级">
            <m-select
              v-model="form.level"
              style="max-width: 220px"
              dict-key="EVALUATION_LEVEL"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="评价内容">
            <m-select
              v-model="form.contentType"
              style="max-width: 220px"
              dict-key="COMMENT_TYPE"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推荐">
            <el-select v-model="form.isRecommend" clearable>
              <el-option value="0" label="普通" />
              <el-option value="1" label="推荐" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单号">
            <el-input v-model="form.orderNo" style="width: 200px" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="form.time"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label=" ">
            <el-button
              size="small"
              type="primary"
              @click="handleClickSearch"
            >查询</el-button>
            <el-button size="small" @click="clear">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import teacherSelect from '@/components/AppTemplate/teacherSelect/index'
import courseSelect from '@/views/deliver/components/courseSelect.vue'
import { evaluationLevel, evaluationContent } from '@/utils/enum'
export default {
  components: {
    courseSelect,
    teacherSelect
  },
  data() {
    return {
      evaluationLevel,
      evaluationContent,
      form: {
        level: '',
        lecturerId: '',
        goodsId: '',
        contentType: '',
        isRecommend: '',
        orderNo: '',
        time: ''
      },
      tabList: [
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' },
        { id: '5', name: '线下课', api: '' },
        { id: '8', name: '直播课', api: '' }
      ]
    }
  },
  created() {
    this.updateSearch()
  },
  activated() {
    this.updateSearch()
  },
  methods: {
    updateSearch() {
      const form = {
        ...this.form,
        time: undefined,
        startTime: this.form.time?.length
          ? `${this.form.time[0]} 00:00:00`
          : undefined,
        endTime: this.form.time?.length
          ? `${this.form.time[1]} 23:59:59`
          : undefined
      }
      this.$emit('search', form)
    },
    initForm() {
      this.form = {
        level: '',
        lecturerId: '',
        goodsId: '',
        contentType: '',
        isRecommend: '',
        orderNo: '',
        time: ''
      }
    },
    clear() {
      this.initForm()
      this.$emit('search', this.form)
    },
    handleClickSearch() {
      this.updateSearch()
    },
    handleCourseSelect(res) {
      if (res.length > 0) {
        this.form.goodsId = res[0].goodsId
        this.form.goodsName = res[0].contentName
        this.$emit('search', this.form)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  margin-top: 16px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e7e7e7;
}
</style>

<template>
  <div class="form-container">
    <div class="form-header flex justify-between">
      <Title title="脱敏数据看板" />
      <date-picker ref="datePicker" :title="'视频组创建时间'" :active="1" @change="updateFormDate" />
    </div>
    <el-form ref="form" inline :model="form" size="mini">
      <el-form-item label="部门" prop="deptId">
        <select-department ref="selectDepartment" @change="updateFormDepartment" @init="initSelectDepartment" />
      </el-form-item>
      <el-form-item label="主编" prop="createUserId">
        <select-editor :id="deptId" ref="selectEditor" @change="updateFormEditor" />
      </el-form-item>
      <el-form-item label="IP" prop="teacherId">
        <FilterTearch ref="filterTearch" :placeholder-str="'请选择IP'" :local-storage-str="'materialCommonUse'" @handleChange="updateFormTeacherId" />
      </el-form-item>
      <!-- <el-form-item label="视频组标题" prop="groupName">
        <el-input v-model="form.groupName" placeholder="请输入视频组标题" clearable />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="handleClickSearch">查询</el-button>
        <el-button plain @click="handleClickReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Title from '../Base/Title.vue'
import SelectDepartment from '../Form/SelectDepartment.vue'
import SelectEditor from '../Form/SelectEditor.vue'
import DatePicker from '../Form/DatePicker/index.vue'
import FilterTearch from '@/components/FilterTearch'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  components: {
    Title,
    SelectDepartment,
    SelectEditor,
    FilterTearch,
    DatePicker
  },
  data() {
    return {
      form: {
        startDate: moment().subtract(7 - 1, 'day').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        deptId: undefined,
        deptIdChain: undefined,
        createUserId: undefined,
        teacherId: undefined,
        groupName: undefined
      },
      deptId: '',
      isSearch: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    updateFormDate(val) {
      this.form.startDate = val[0]
      this.form.endDate = val[1]
      this.$emit('search', this.form)
    },
    updateFormDepartment(list) {
      if (list.length) {
        this.deptId = String(list[list.length - 1])
        this.form.deptIdChain = this.getDepartmentStr(list)
      } else {
        this.deptId = ''
        this.form.deptIdChain = undefined
        this.$refs.selectDepartment.empty()
      }
      this.form.createUserId = undefined
      this.$refs.selectEditor.empty()
      this.$emit('search', this.form)
    },
    getDepartmentStr(list) {
      const str = list.join('-')
      return `0-${str}`
    },
    updateFormTeacherId(val) {
      this.form.teacherId = val
      this.$emit('search', this.form)
    },
    updateFormEditor(val) {
      this.form.createUserId = val
      this.$emit('search', this.form)
    },
    handleClickSearch() {
      if (!this.isSearch) {
        this.isSearch = true
        this.$emit('search', this.form)
        setTimeout(() => {
          this.isSearch = false
        }, 600)
      }
    },
    handleClickReset() {
      this.$refs.form.resetFields()
      this.$refs.selectDepartment.reset()
      this.$refs.selectEditor.reset()
      this.$refs.filterTearch.reset()
      // this.$refs.selecteTeacher.value = ''
      this.deptId = ''
      this.form.createUserId = this.userInfo.userId
      const list = this.$refs.selectDepartment.value
      this.form.deptIdChain = this.getDepartmentStr(list)
      this.$refs.datePicker.reset()
    },
    initSelectDepartment(val) {
      this.deptId = String(val[val.length - 1])
      this.form.deptIdChain = `0-${val.join('-')}`
      this.$refs.selectEditor.init()
      this.form.createUserId = this.userInfo.userId
      this.$emit('init', this.form)
    }
  }
}
</script>
<style lang="scss" scoped>
.form-header{
  margin-bottom:25px;
}
</style>

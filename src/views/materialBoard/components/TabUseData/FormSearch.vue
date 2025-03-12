<template>
  <div class="form-container">
    <div class="form-header flex justify-between">
      <Title title="使用数据看板" />
      <date-picker ref="datePicker" :title="'视频首次共享时间'" @change="updateFormDate" />
    </div>
    <el-form ref="useForm" inline :model="form" size="mini">
      <el-form-item label="部门" prop="department">
        <select-department ref="selectDepartment" @change="updateFormDepartment" @init="initSelectDepartment" />
      </el-form-item>
      <el-form-item label="主编" prop="createUserId">
        <select-editor :id="deptId" ref="selectEditor" @change="updateFormEditor" />
      </el-form-item>
      <el-form-item label="IP" prop="teacherId">
        <FilterTearch ref="filterTearch" :placeholder-str="'请选择IP'" :local-storage-str="'materialCommonUse'" @handleChange="handleChangeTeacher" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleClickSearch">查询</el-button>
        <el-button plain @click="handleClickReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import moment from 'moment'
import Title from '../Base/Title.vue'
// import AppDatepicker from '@/components/AppDatePicker'
import SelectDepartment from '../Form/SelectDepartment.vue'
import SelectEditor from '../Form/SelectEditor.vue'
import DatePicker from '../Form/DatePicker/index.vue'
import FilterTearch from '@/components/FilterTearch'
import { mapGetters } from 'vuex'
export default {
  components: {
    Title,
    DatePicker,
    SelectDepartment,
    FilterTearch,
    SelectEditor
  },
  data() {
    return {
      form: {
        startDate: moment().subtract(7 - 1, 'day').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        deptIdChain: undefined,
        operatorId: undefined,
        groupName: undefined,
        name: undefined,
        platformId: undefined,
        teacherId: undefined,
        titleName: undefined,
        createUserId: undefined

      },
      operatortList: [],
      platformList: [],
      deptId: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {

  },
  methods: {
    updateFormDate(val) {
      this.form.startDate = val[0]
      this.form.endDate = val[1]
      this.$emit('search', this.form)
    },
    updateFormDepartment(list) {
      if (list && list.length > 0) {
        this.form.deptIdChain = this.getDepartmentStr(list)
        this.deptId = String(list[list.length - 1])
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
    updateFormEditor(val) {
      this.form.createUserId = val
      this.$emit('search', this.form)
    },
    updateFormOperator(val) {
      this.form.operatorId = val
      this.$emit('search', this.form)
    },
    handleChangePlatform() {
      this.$emit('search', this.form)
    },
    handleChangeTeacher(val) {
      console.log(val, 'IP')
      this.form.teacherId = val
      this.$emit('search', this.form)
    },
    handleClickSearch() {
      this.$emit('search', this.form)
    },
    handleClickReset() {
      this.$refs.useForm.resetFields()
      this.$refs.selectDepartment.reset()
      this.$refs.filterTearch.reset()
      this.$refs.selectEditor.reset()
      this.$refs.datePicker.reset()
      this.form.createUserId = this.userInfo.userId
      const list = this.$refs.selectDepartment.value
      this.form.deptIdChain = this.getDepartmentStr(list)
      // this.$refs.selecteTeacher.value = ''
      this.deptId = ''
      this.$emit('reset')
    },
    initSelectDepartment(val) {
      this.deptId = String(val[val.length - 1])
      this.$refs.selectEditor.init()
      this.form.createUserId = this.userInfo.userId
      this.form.deptIdChain = `0-${val.join('-')}`
      this.$emit('init')
    }
  }
}
</script>
<style lang="scss" scoped>
.form-header{
  margin-bottom:25px;
}
</style>

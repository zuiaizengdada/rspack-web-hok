<template>
  <div>
    <el-select
      v-model="filterId"
      remote
      :remote-method="searchFilter"
      clearable
      filterable
      :placeholder="placeholderStr"
      @blur="()=>searchFilter('')"
      @change="handleChangeTeacher"
    >
      <el-option-group
        v-for="group in filteredGroups(filterArray)"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
import { loadUserData, changeTeacher, tearchFilter, filteredGroups } from '@/utils/videoMange'

export default {
  name: 'FilterTearch',
  props: {
    /**
     * 1 讲师列表
     */
    type: {
      type: String,
      default: '1'
    },
    // 缓存里面的数据 用于展示常用列表
    localStorageStr: {
      type: String,
      default: ''
    },
    // 文案
    placeholderStr: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      // Your component data goes here
      filterId: '',
      filteredGroups,
      filterArray: [],
      filterList: []
    }
  },
  created() {
    this.init()
  },
  mounted() {
    // Code to run when the component is mounted goes here
  },
  methods: {
    // Your component methods go here
    init() {
      if (this.type === '1') {
        this.loadTeacherData()
      }
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData(this.localStorageStr, 1)
      this.filterArray = tearchArray
      this.filterList = tearchList
      this.searchFilter('')
    },
    async searchFilter(query) {
      setTimeout(async() => {
        const res = await tearchFilter(query, this.filterList)
        this.filterArray[0].isHidden = query.length > 0
        this.filterArray[1].options = res
      }, 300)
    },
    reset() {
      this.filterId = ''
    },
    async handleChangeTeacher(data) {
      if (this.filterId) {
        const res = await changeTeacher(this.filterList, this.filterArray, this.localStorageStr, this.filterId)
        this.filterArray = res
      }
      this.$emit('handleChange', this.filterId)
    }
  }
}
</script>

<style scoped>
/* Your component styles go here */
</style>

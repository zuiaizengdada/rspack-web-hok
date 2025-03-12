<template>
  <div>
    <el-select
      v-model="filterId"
      style="width: 100%;"
      :placeholder="placeholderStr"
      remote
      clearable
      filterable
      :popper-append-to-body="popper"
      :multiple="multiple"
      :remote-method="searchFilter"
      :disabled="disabled"
      @blur="()=>searchFilter('')"
      @change="handleChangeTeacher"
    >
      <template v-if="filterArray">
        <el-option
          v-for="item in filterArray"
          :key="item.value || ''"
          :label="item.label"
          :value="item.value"
        >
          <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
        </el-option>
      </template>
    </el-select>
  </div>
</template>

<script>
import { getTeacherData } from '@/utils/getApiData'
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
    multiple: {
      type: Boolean,
      default: false
    },
    popper: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 文案
    placeholderStr: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      filterId: '',
      filterArray: [
        {
          value: '1',
          label: '张三'
        }
      ],
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
        this.loadData()
      }
    },
    async loadData() {
      const res = await getTeacherData()
      this.filterList = res
      this.searchFilter('')
      console.log(res, '讲师列表')
    },
    searchFilter(query = '') {
      setTimeout(() => {
        const copyTearchArray = [...this.filterList]
        const arr = copyTearchArray.filter((item) => {
          return item.label.includes(query) || item.value.includes(query)
        })
        if (arr.length > 300) {
          this.filterArray = arr.slice(0, 300)
        } else {
          this.filterArray = arr
        }
      }, 300)
    },
    // 默认选中这条 如果filterArray里面没有就插入这条数据
    defaultSelect(filterId) {
      const addToFilterArray = (id) => {
        const index = this.filterArray.findIndex((item) => item.value === id)
        if (index === -1) {
          const arr = this.filterList.filter((item) => item.value === id)
          this.filterArray.unshift(arr[0])
        }
      }

      if (Array.isArray(filterId)) {
        filterId.forEach((ele) => addToFilterArray(ele))
      } else {
        addToFilterArray(filterId)
      }

      this.filterId = filterId
    },
    handleChangeTeacher() {
      this.$emit('handleChange', this.filterId)
    },
    clear() {
      this.filterId = ''
    }
  }
}
</script>

  <style scoped>
  /* Your component styles go here */
  </style>

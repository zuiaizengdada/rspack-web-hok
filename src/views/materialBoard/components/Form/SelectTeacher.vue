<template>
  <el-select v-model="value" clearable filterable placeholder="请选择" @change="handleChangeTeacher">
    <el-option-group
      v-for="group in list"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.teacherId"
        :label="item.teacherName"
        :value="item.teacherId"
      />
    </el-option-group>
  </el-select>
</template>
<script>
import { teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  data() {
    return {
      list: [],
      teacherList: [],
      value: ''
    }
  },
  mounted() {
    this.initTeacherList()
  },
  methods: {
    async initTeacherList() {
      const res = await teacherQueryByName({ name: '' })
      this.teacherList = res.data
      console.log(res, 'IP列表')
      const obj = {
        label: '全部',
        options: res.data
      }
      this.list = [obj]
      this.checkTeacher()
    },
    // 检测本地缓存有没有常用IP
    checkTeacher() {
      const materialCommonUse = localStorage.getItem('materialCommonUse')
      if (materialCommonUse) {
        const arr = JSON.parse(materialCommonUse)
        this.list.unshift({
          label: '最近常用',
          options: arr
        })
      }
    },
    handleChangeTeacher() {
      const arr = this.teacherList.filter(item => item.teacherId === this.value)
      if (arr.length) {
        const materialCommonUse = localStorage.getItem('materialCommonUse')
        if (!materialCommonUse) {
          localStorage.setItem('materialCommonUse', JSON.stringify(arr))
          this.list.unshift({
            label: '最近常用',
            options: arr
          })
        } else {
        // 如果缓存里面有了 没有5个就继续添加 有5个就把最后一个删除第一个替换成最新的
          const arr1 = JSON.parse(materialCommonUse)
          const index = arr1.findIndex(item => item.teacherId === this.value)
          if (index === -1) {
            if (arr1.length < 5) {
              arr1.unshift(arr[0])
            } else {
              arr1.pop()
              arr1.unshift(arr[0])
            }
          } else {
            arr1.splice(index, 1)
            arr1.unshift(arr[0])
          }
          localStorage.setItem('materialCommonUse', JSON.stringify(arr1))
          this.list[0].options = arr1
        }
      }
      this.$emit('change', this.value)
    }
  }
}
</script>

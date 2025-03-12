<template>
  <el-cascader v-model="value" v-bind="$attrs" :value="value" :options="list" :props="{ checkStrictly: true }" clearable @change="changeCascader" />
</template>
<script>
import { mapGetters } from 'vuex'
import { deptTree } from '@/api/addressBookApi'
import { getDeptId } from '@/api/business'

export default {
  data() {
    return {
      list: [],
      value: [],
      defaultValue: []
    }
  },
  computed: {
    ...mapGetters(['userDeptId'])
  },
  mounted() {
    this.initDepartmentList(true)
  },
  methods: {
    async initDepartmentList(isInit) {
      const res = await deptTree()
      const tree = this.encapsulateData(res.data)

      this.list = tree
      const resDeprt = await getDeptId() || Number(localStorage.getItem('userDeptId')) || this.userDeptId
      const deptId = resDeprt.data

      if (isInit) {
        const list = this.findParents(tree, deptId)
        const list2 = list.reverse()
        list2.push(deptId)
        this.value = list2
        this.defaultValue = list2
        this.$emit('init', this.value)
      }
    },
    changeCascader(val) {
      console.log(1111, val, 333)
      this.$emit('change', this.value)
    },
    encapsulateData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        array[i].disabled = true
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
      return array
    },
    findParents(treeData, id) {
      if (treeData.length === 0) return
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].id === id) {
          treeData[i].disabled = false
          if (treeData[i].children) {
            this.setListItemDisable(treeData[i].children)
          }
          return []
        } else {
          if (treeData[i].children) {
            const res = this.findParents(treeData[i].children, id)
            if (res !== undefined) {
              return res.concat(treeData[i].id)
            }
          }
        }
      }
    },
    setListItemDisable(list) {
      list.forEach(element => {
        element.disabled = false
        if (element.children && element.children.length > 0) {
          this.setListItemDisable(element.children)
        }
      })
    },
    reset() {
      this.value = this.defaultValue
    },
    empty() {
      this.value = []
    }
  }
}
</script>

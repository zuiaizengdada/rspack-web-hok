<template>
  <div class="box">
    <el-cascader
      ref="casSiteRef"
      v-model="dataValue"
      :props="{
        expandTrigger: 'click',
        checkStrictly: true
      }"
      :level="level"
      :options="dataTree"
      placeholder="请选择省，市，区，街道"
      @expand-change="handleExpandChange"
      @change="handleChange"
    />
  </div>
</template>
<script>
import { getAreaCodeList, getAreaCode } from '@/api/user/member'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number,
      default: 4
    }
  },
  data: () => ({
    isData: [],
    dataTree: [],
    dataValue: '',
    isQuery: true,
    isLazy: false
  }),
  watch: {
    value: {
      handler() {
        if (this.isQuery) {
          // 第一次调用
          this.getAreaCodeList(0)
          this.isQuery = false
          // 存在值
          if (this?.value?.length) {
            this.dataValue = this.value.map(item => item.value)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange() {
      const items = this.$refs.casSiteRef?.getCheckedNodes()[0]?.pathNodes || []
      const list = items.map(item => ({
        value: item.value,
        text: item.label
      }))
      this.$emit('input', list)
    },
    handleExpandChange(e) {
      let items = this.dataTree || []
      e.forEach((item, index) => {
        if (index === 0) {
          items = items?.find(i => i.value === item)
        }
        if (index > 0) {
          items = items?.children?.find(i => i.value === item)
        }
      })
      // this.dataValue = e
      this.getAreaCode(items)
    },
    // 第一层请求
    async getAreaCodeList(level) {
      const { data } = await getAreaCodeList({ level })
      const dataTree = []
      data.map(v => {
        dataTree.push({
          label: v.name,
          value: v.areaCode,
          level: 1,
          sitKeyIndex: [v.areaCode],
          children: [],
          disable: false
        })
      })
      this.dataTree = dataTree
      // 存在value
      if (this.value.length) {
        this.loopQuery()
      }
    },
    async loopQuery() {
      const listQuery = []
      const sitKeyIndex = [] // 使用一个外部数组来维护累积的 sitKeyIndex

      this.value.forEach((item, index) => {
        sitKeyIndex.push(item.value) // 直接将当前项的 value 加入累积数组

        listQuery.push({
          ...item,
          level: index,
          sitKeyIndex: [...sitKeyIndex] // 使用扩展运算符来生成当前的 sitKeyIndex 副本
        })
      })
      for (const query of listQuery) {
        await this.getAreaCode(query)
      }
    },
    async getAreaCode(e) {
      const list = []
      if (e.sitKeyIndex?.length >= this.level) {
        return
      }
      try {
        const { data } = await getAreaCode({ areaCode: e.value })
        if (!data?.length) {
          e.children = undefined
          return
        }
        data.map(v => {
          list.push({
            label: v.name,
            value: v.areaCode,
            level: e.level + 1,
            sitKeyIndex: e.sitKeyIndex
              ? [...e.sitKeyIndex, v.areaCode]
              : [v.areaCode],
            children: e.level < 3 ? [] : undefined,
            disable: false
          })
        })
        this.addData(e.sitKeyIndex, list)
      } catch {
        console.log()
      }
    },
    // 找到对应的地方添加数据
    addData(keyList, dataList) {
      let dataTree = this.dataTree
      for (let i = 0; i < keyList.length; i++) {
        const item = dataTree.find(item => item.value === keyList[i])
        if (i === keyList.length - 1) {
          item.children = dataList
        } else {
          dataTree = item.children
        }
      }
    }
  }
}
</script>

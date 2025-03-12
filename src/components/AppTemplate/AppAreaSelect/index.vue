<template>
  <div>
    <el-cascader
      :key="resetCascader"
      ref="cascader"
      :options="options"
      v-bind="$attrs"
      filterable
      clearable
      :popper-class="popperClass"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { getAreaCodeList, getAreaCode } from '@/api/user/member'
export default {
  components: {},
  props: {
    // 是否可以选择任意一项
    checkStrictly: {
      type: Boolean,
      default: false
    },
    propslabel: {
      type: String,
      default: 'name'
    },
    propsvalue: {
      type: String,
      default: 'areaCode'
    },
    // 最大层级
    maxlevel: {
      type: Number,
      default: 1
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: [],
      options: [],
      resetCascader: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      const params = [getAreaCodeList({
        level: 0
      }), getAreaCodeList({
        level: 1
      })]
      if (this.maxlevel === 2) {
        params.push(getAreaCodeList({
          level: 2
        }))
      }

      Promise.all(params)
        .then(res => {
          const options = res[1].data
          this.options = res[0].data.map(i => {
            return {
              value: i.name,
              label: i.name,
              id: i.areaCode,
              children: [],
              shortName: i.shortName
            }
          })
          this.options.forEach(i => {
            options.forEach(j => {
              if (i.id === j.parentCode) {
                i.children.push({
                  value: j.name,
                  label: j.name,
                  id: j.areaCode,
                  shortName: j.shortName,
                  children: this.maxlevel === 2 ? [] : null
                })
              }
            })
          })
          if (this.maxlevel === 2) {
            this.options.forEach(i => {
            i.children?.forEach(z => {
              res[2].data.forEach(j => {
                if (z.id === j.parentCode) {
                  z.children.push({
                    value: j.name,
                    label: j.name,
                    id: j.areaCode,
                    shortName: j.shortName
                  })
                }
              })
            })
            })
          }
        }).catch(() => {
          this.options = []
        })
    },
    buildTree(data, parentCode) {
      const tree = []
      for (const item of data) {
        console.log(item.parentCode, parentCode)
        if (item.parentCode === parentCode) {
          const children = this.buildTree(data, item.areaCode)
          if (children.length > 0) {
            item.children = children
          }
          tree.push(
            {
              ...item,
              value: item.areaCode,
              label: item.name,
              id: item.areaCode
            }
          )
        }
      }
      console.log(tree)
      return tree
    },
    lazyLoad(node, resolve) {
      const { level } = node
      console.log(level, 'level', node, this.maxlevel)
      let fn = getAreaCodeList
      let params
      if (level === 0) {
        fn = getAreaCodeList
        params = {
          level: 0
        }
      } else {
        fn = getAreaCode
        params = {
          areaCode: node.data.id
        }
      }
      if (level === this.maxlevel) {
        resolve([])
      } else {
        fn(params).then(res => {
          const data = []
          res.data.forEach(e => {
            data.push({
              value: e[this.propsvalue],
              label: e[this.propslabel],
              id: e.areaCode,
              leaf: level >= this.maxlevel - 1
            })
          })
          resolve(data)
        }).catch(() => {
          resolve([])
        })
      }
    },
    refresh() {
      this.resetCascader++
    }
  }
}
</script>

<style lang='scss' scoped>

</style>

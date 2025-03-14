<template>
  <div>
    <div>
      <van-cell title="产品研发演示" />
    </div>
    <el-cascader
      :key="resetCascader"
      ref="cascader"
      v-bind="$attrs"
      :props="props"
      filterable
      clearable
      v-on="$listeners"
    />
  </div>
</template>
<template>
  <div></div>
</template>
<script>
import { openUrl } from '@/utils/index'

export default {
  name: 'AppChinaArea',
  created() {
    const url = this.$route.query.url
    if (url) {
      window.location.href = decodeURIComponent(url)
    }
  }
}
</script>
<template>
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
      default: 3
    }
  },
  data() {
    return {
      id: [],
      valuedata: '3213/1231',
      props: {
        checkStrictly: this.checkStrictly,
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      resetCascader: 0
    }
  },
  mounted() {},
  methods: {
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

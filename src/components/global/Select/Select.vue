<!--
dictKey   strings   文件的字典名称 或 全局下拉接口字典key  默认:''            例：DELIVERY_STATUS
dictList  Array     下拉数据                             默认:[]            例：[{label:'李三',value:123212,hide:是否隐藏,disabled:是否禁止选中}]
all       Bollean   下拉是否添加全部                      默认:false
request   Function  下拉请求接口                          默认:无
param     Object    列表映射                             默认:无             例: {value:'teacherId',label:'teacherName'}
remote              是否远程查询
defaultName         默认选中反显Name                      默认:无            例: '李三' || ['李三','王麻子']    下拉菜单不存在这个value 设置defaultName
-->
<template>
  <el-select
    ref="selectRef"
    v-bind="$attrs"
    :value="newValue"
    :placeholder="placeholder"
    :filterable="filterable"
    :clearable="clearable"
    :remote-method="remoteMethods"
    :disabled="disabled"
    :loading="loading"
    style="width: 100%"
    v-on="$listeners"
  >
    <el-option
      v-for="item in options"
      v-show="!item.hide"
      :key="item.value"
      :style="item.color ? { background: item.color, color: '#ffffff' } : {}"
      :label="item.label"
      :value="item.value"
      :disabled="!!item.disabled"
    >
      <!-- 自定义下拉内容-插槽 -->
      <slot :item="item" />
    </el-option>
  </el-select>
</template>
<script>
import { getDict } from '@/utils/index'
export default {
  name: 'MySelect',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: ''
    },
    // 默认选中反显label
    defaultName: {
      type: [String, Array],
      default: undefined
    },
    // 字段映射
    param: {
      type: Object,
      default: null
    },
    // 下拉接口
    request: {
      type: Function,
      default: () => {
        return ''
      }
    },
    // 字典名称
    dictKey: {
      type: String,
      default: ''
    },
    filterable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 是否要一键删除  默认可删除
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 下拉数据
    dictList: {
      type: Array,
      default: undefined
    },
    remoteMethod: {
      type: [Function || undefined],
      default: undefined
    },
    // 下拉是否添加全部
    all: {
      type: undefined,
      default: false
    }
  },
  data: () => ({
    options: [],
    loading: false,
    newValue: ''
  }),
  watch: {
    // dictList 传递的方式

    dictList: {
      handler: function () {
        this.initOptions(this.dictList || [])
      },
      immediate: true
    },
    defaultName: {
      handler: function () {
        if (this.defaultName && this.value) {
          if (
            Array.isArray(this.defaultName) &&
            this.defaultName.length &&
            this.defaultName.length === this.value.length
          ) {
            const newList = this.value.map((item, index) => ({
              label: this.defaultName[index],
              value: item
            }))
            this.addItem([...newList])
          }
          if (!Array.isArray(this.defaultName)) {
            this.addItem([{ label: this.defaultName, value: this.value }])
          }
        }
      },
      immediate: true,
      deep: true
    },
    value: {
      handler: function () {
        if (this.value !== this.newValue) {
          this.newValue = JSON.parse(JSON.stringify(this.value))
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // dictKey 获取下拉的方式
    this.dictKey && this.initDict()
    // 是否接口获取下拉
    if (this.$attrs.remote === undefined && this.request) this.getList()
  },
  methods: {
    initRef() {
      return this.$refs.selectRef
    },
    async getList() {
      this.loading = true
      const res = await this.request()
      if (res.code === 1) this.initOptions(res?.data || [])
      this.loading = false
    },
    // 初始化数据
    async initDict() {
      this.loading = true
      const list = await getDict(this.dictKey)
      this.initOptions(list || [])
      this.loading = false
    },
    // 添加全部
    addAll() {
      if (this.all) {
        this.options = [{ label: '全部', value: '' }, ...this.options]
      }
    },
    addItem(list) {
      list.forEach(element => {
        const is = this.options.some(item => item.value === element.value)
        if (!is) this.options.push(element)
      })
    },
    // 下拉请求的方式
    async remoteMethods(value) {
      if (this.remoteMethod) {
        this.remoteMethod(value)
        return
      }
      if (value && this.request) {
        this.loading = true
        const res = await this.request({ name: value })
        if (res.code === 1) this.initOptions(res?.data || [])
        this.loading = false
      } else {
        this.initOptions([])
      }
    },
    // 数据处理
    initOptions(list) {
      if (!this.param) {
        this.options = list
        this.addAll()
        return
      }
      this.options = list?.map(item => ({
        ...item,
        value: item[this?.param?.value],
        label: item[this?.param?.label],
        color: item[this?.param?.color] || item.color
      }))
      this.addAll()
    },
    clearOption() {
      this.options = []
    }
  }
}
</script>

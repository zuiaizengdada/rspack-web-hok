<template>
  <div>
    <!-- 输入框 -->
    <el-input
      v-if="!widget.valueType || widget.valueType === 'input'"
      v-model="dataModel"
      style="width: 228px"
      clearable
      :placeholder="`请输入${formProps.label || widget.label}`"
      @change="submit"
    />
    <span v-if="widget.valueType === 'text'">{{ dataModel }}</span>
    <!-- 下拉框 -->
    <el-select
      v-if="widget.valueType === 'select'"
      v-model="dataModel"
      style="width: 228px"
      :filterable="formProps.filterable"
      :remote="formProps.remote"
      :remote-method="remoteMethod"
      clearable
      :loading="loading"
      :placeholder="`请选择${formProps.placeholder || formProps.label || widget.label}`"
      @change="submit"
    >
      <el-option
        v-for="list in formProps.options || []"
        :key="list[(formProps.alias && formProps.alias.value) || 'value']"
        :label="list[(formProps.alias && formProps.alias.label) || 'label']"
        :value="list[(formProps.alias && formProps.alias.value) || 'value']"
      />
    </el-select>
    <!-- 级联选择器 -->
    <el-cascader
      v-if="widget.valueType === 'cascader'"
      v-model="dataModel"
      style="width: 228px"
      :options="formProps.options || []"
      :props="cascaderProps"
      :placeholder="`请选择${formProps.label || widget.label}`"
      clearable
      @change="submit"
    />
    <!-- 日期选择器 -->
    <el-date-picker
      v-if="widget.valueType === 'daterange'"
      v-model="dataModel"
      style="width: 228px"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :picker-options="(widget.formProps && widget.formProps.pickerOptions) || {}"
      clearable
      @change="handleChangeDate"
    />
  </div>
</template>

<script>
export default {
  props: {
    models: {
      type: Object,
      default: () => {}
    },
    widget: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dataModel: this.models[this.value],
      loading: false
    }
  },
  computed: {
    value() {
      return (this.widget.formProps && this.widget.formProps.formAliasName) || this.widget.prop
    },
    formProps() {
      return this.widget.formProps || {}
    },
    cascaderProps() {
      return this.formProps.props ?? { checkStrictly: true, emitPath: false }
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.value] = val
        const models = {
          ...this.models,
          [this.value]: val
        }
        if (this.formProps.getChildIds) {
          models[this.formProps.childIdsKey] = this.getChildById(val)
        }
        this.$emit('update:models', models)
        this.$emit('input-change', val, this.value)
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.value]
      }
    }
  },
  mounted() {
    if (this.widget.valueType === 'daterange') {
      console.log(this.widget.formProps)
    }
    if (this.widget.valueType === 'select' && this.widget.formProps.remote && this.widget.formProps.remoteMethod) {
      this.remoteMethod()
    }
  },
  methods: {
    handleChangeDate() {
      const startTime = this.formProps?.alias?.startTime ?? 'startTime'
      const endTime = this.formProps?.alias?.endTime ?? 'endTime'
      this.$emit('update:models', {
        ...this.models,
        [startTime]: this.dataModel ? this.dataModel[0] : undefined,
        [endTime]: this.dataModel ? this.dataModel[1] : undefined
      })
      this.submit()
    },
    submit() {
      setTimeout(() => {
        this.$emit('submit')
      }, 100)
    },
    async remoteMethod(query) {
      this.loading = true
      const { data, code } = await this.formProps.remoteMethod(query)
      if (code === 1) {
        this.widget.formProps.options = data
      }
      this.loading = false
    },
    getChildById(val) {
      const ids = []
      const getIds = (arr) => {
        arr.forEach((i) => {
          ids.push({ label: i.label, value: i.value })
          if (i.children && i.children.length) {
            getIds(i.children)
          }
        })
      }
      const getDataIds = (id, arr) => {
        arr.forEach((i) => {
          if (id === i.value) {
            ids.push({ label: i.label, value: i.value })
            if (i.children && i.children.length) {
              getIds(i.children)
            }
          }
          if (i.children && i.children.length) {
            getDataIds(id, i.children)
          }
        })
      }
      getDataIds(val, this.formProps.options)
      return ids.map((i) => i.value)
    }
  }
}
</script>

<style></style>

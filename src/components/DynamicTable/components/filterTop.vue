<template>
  <div class="filter-container">
    <el-form
      v-if="formColumns.length"
      ref="form"
      :model="form"
      size="small"
      class="flex flex-wrap"
      label-width="70px"
      :inline="true"
    >
      <template v-for="item in formColumns">
        <el-form-item
          v-if="item.showInSearch"
          :key="item.prop"
          :label-width="(item.formProps && item.formProps.labelWidth) || '70px'"
          style="margin-right: 15px"
          :label="`${(item.formProps && item.formProps.label) || item.label}`"
        >
          <form-item
            :widget="item"
            :models.sync="form"
            @input-change="onInputChange"
            @submit="onSubmit"
          />
        </el-form-item>
      </template>
      <div class="flex-1">
        <div
          class="flex flex-between flex-middle"
          style="width: 100%; margin: 8px 0; height: 36px; min-width: 120px"
        >
          <div>
            <el-button
              type="primary"
              size="small"
              @click="onSubmit"
            >查询</el-button>
            <el-button size="small" @click="resetForm()">重置</el-button>
          </div>
          <slot name="submitBtn" />
        </div>
      </div>
    </el-form>
    <el-row
      v-if="$slots.headerBtn"
      type="flex"
      class="row-btn"
      justify="space-between"
    >
      <el-col :span="6">
        <slot name="headerBtn" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import formItem from './formItem'
import { deepClone } from '@/utils/index'
export default {
  components: {
    formItem
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    resetRefreshFn: {
      type: Function,
      default: null
    },
    taskId: {
      type: [String, Number],
      default: ''
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {},
      hasActionBtn: false,
      key: 1,
      formColumns: []
    }
  },
  watch: {
    columns: {
      deep: true,
      handler(val) {
        this.generateModle()
      }
    }
  },
  created() {
    this.generateModle()
  },
  methods: {
    generateModle() {
      const columns = deepClone(this.columns).filter(i => i.showInSearch)
      columns.forEach(i => {
        const prop = i?.formProps?.formAliasName ?? i.prop
        const defaultValue = i.formProps?.defaultValue
        if (
          i.valueType === 'select' &&
          i?.formProps?.multiple &&
          this.form[prop] === undefined
        ) {
          this.$set(this.form, prop, defaultValue ?? [])
        } else if (
          i.valueType === 'daterange' &&
          this.form[prop] !== (defaultValue ?? [])
        ) {
          this.$set(this.form, prop, defaultValue ?? [])
          if (
            i.valueType === 'daterange' &&
            defaultValue &&
            defaultValue.length
          ) {
            const startTime = i.formProps?.alias?.startTime ?? 'startTime'
            const endTime = i.formProps?.alias?.endTime ?? 'endTime'
            this.$set(this.form, startTime, defaultValue[0])
            this.$set(this.form, endTime, defaultValue[1])
          }
        } else if (
          i.valueType !== 'daterange' &&
          i.showInSearch &&
          this.form[prop] !== (defaultValue ?? '')
        ) {
          this.$set(this.form, prop, defaultValue ?? '')
        } else if (i.valueType === 'text') {
          this.$set(this.form, prop, defaultValue ?? '')
        }
      })
      columns.sort((a, b) => {
        const s1 = a.formProps?.sort ?? 99
        const s2 = b.formProps?.sort ?? 99
        return s1 - s2
      })
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.hasActionBtn = !!columns.length
      this.$set(this, 'formColumns', columns)
      // this.formColumns = columns
    },
    onSubmit() {
      if (!this.taskId && !this.dataList.length) return
      this.$emit('submit', this.form)
    },
    onInputChange(value, field) {
      // this.$emit('input-change', this.form)
    },
    resetForm() {
      this.form = {}
      this.formColumns.forEach(i => {
        const prop = i?.formProps?.formAliasName ?? i.prop
        const defaultValue = i.formProps?.defaultValue
        if (i.valueType === 'text') {
          this.$set(this.form, prop, defaultValue ?? '')
        }
      })
      this.resetRefreshFn ? this.resetRefreshFn() : this.onSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container ::v-deep {
  padding: 20px 20px 0 20px;
  .row-btn {
    padding: 10px 0 20px;
    border-bottom: 1px solid #e7e7e7;
    .el-button {
      border: 1px solid #0c6fff;
      color: #0c6fff;
      background: none !important;
    }
  }
  .col-submit-btn {
    margin-left: 25px;
  }
}
</style>

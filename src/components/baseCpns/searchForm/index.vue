<template>
  <el-form
    :ref="refText"
    :class="['hok-search-form', className]"
    :model="formOpts.formData"
    :rules="formOpts.rules"
    :label-position="labelPosition"
    :label-width="formOpts.labelWidth || 'auto'"
    v-bind="$attrs"
    :size="size"
    v-on="$listeners"
  >
    <el-row :gutter="gutterSize" align="top">
      <!-- 内容form -->
      <div
        :class="[
          'search-form-box',
          border ? 'border-item' : '',
          isShrink ? '' : 'hidden-search-form'
        ]"
      >
        <template v-for="(filed, index) in formOpts.fieldList">
          <el-col
            v-if="filed.isHide !== true"
            :key="index"
            :span="formatSpan(filed.span)"
          >
            <el-form-item
              :prop="filed.prop"
              :label="filed.label"
              :label-width="filed.labelWidth || 'auto'"
              :class="filed.className ? [...filed.className] : []"
            >
              <!-- 自定义输入框插槽 -->
              <template v-if="filed.slotName">
                <slot :name="filed.slotName" />
              </template>
              <!-- 是否使用自己的组件 -->
              <template v-else-if="filed.isSelfCpn">
                <component
                  :is="filed.cpn"
                  v-model="formOpts.formData[filed.prop]"
                  v-bind="{ ...filed.bind }"
                  v-on="bindEvents(filed)"
                />
              </template>
              <!-- 使用element自带的组件 -->
              <template v-else>
                <component
                  :is="filed.cpn"
                  v-model.trim="formOpts.formData[filed.prop]"
                  :placeholder="formatPlaceholder(filed)"
                  :options="formatOptions(filed)"
                  filterable
                  :clearable="isClearable(filed.bind)"
                  v-bind="{ ...filed.bind }"
                  v-on="bindEvents(filed)"
                >
                  <template v-if="filed.childSlotName">
                    <slot :name="filed.childSlotName" />
                  </template>
                  <template v-else>
                    <component
                      :is="compChildName(filed)"
                      v-for="(value, key) in propTraOpt(filed)"
                      :key="key"
                      :disabled="value.disabled"
                      :label="compChildLabel(filed, value)"
                      :value="compChildValue(filed, value, key)"
                    />
                  </template>
                </component>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </div>
      <!-- 按钮操作 -->
      <el-col class="hok-search-form-btn" :span="formOpts.operatorSpan || 24">
        <template v-if="formOpts.operatorSlotName">
          <slot :name="formOpts.operatorSlotName" />
        </template>
        <template
          v-else-if="formOpts.operatorList && formOpts.operatorList.length > 0"
        >
          <template v-for="(btnItem, btnIndex) in formOpts.operatorList">
            <el-button
              v-if="btnItem.isHide !== true"
              :key="btnIndex"
              v-permission="
                btnItem.permission ? [btnItem.permission || '', permsList] : []
              "
              :type="btnItem.type || 'primary'"
              :size="btnItem.size || 'small'"
              :class="['hok-button', ...(btnItem.className || [])]"
              :loading="btnItem.loading"
              v-bind="btnItem.bind"
              @click="btnItem.fn"
            >
              {{ btnItem.label }}
            </el-button>
          </template>
        </template>
        <template v-if="isMore && isMoreOutside">
          <div class="shrink-box" @click="shrinkBtn">
            <span>{{ isShrink ? '收起' : '更多筛选' }}</span>
            <i :class="['el-icon-arrow-down', isShrink ? '' : 'up']" />
          </div>
        </template>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'HOKSEARCHFORM',
  props: {
    isMoreOutside: {
      type: Boolean,
      default: true
    },
    formOpts: {
      type: Object,
      default: () => {
        return {}
      }
    },
    className: {
      type: String,
      default: ''
    },
    labelPosition: {
      type: String,
      default: 'left'
    },
    // 一行最大数量
    widthSize: {
      type: Number,
      default: 4,
      validator: value => {
        return value <= 4
      }
    },
    size: {
      type: String,
      default: 'small '
    },
    // 是否使用内容全边框包裹
    border: {
      type: Boolean,
      default: true
    },
    // row间隔
    gutterSize: {
      type: Number,
      default: 20
    },
    // 一个页面存在多个此组件，需要传递ref的name
    refText: {
      type: String,
      default: 'form'
    },
    // 当前form ref对象
    refObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    setShrink: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      isShrink: true, // true/将收起 false/将展开
      isMore: false // 是否需要展示更多
    }
  },
  watch: {
    // 将
    'formOpts.formData': {
      handler(val) {
        this.$emit('update:refObj', this.$refs[this.refText])
      },
      deep: true
    },
    'formOpts.fieldList': {
      handler(val) {
        this.isMore =
          Array.isArray(val) && val.filter(f => f.isHide !== true).length > 4
      },
      deep: true
    },
    widthSize(val) {
      if (val > 4) {
        this.$message.warning('widthSize值不能大于4！')
        this.colSize = 4
      } else {
        this.colSize = val
      }
    },
    setShrink: {
      handler(val) {
        this.isShrink = val
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$emit('update:refObj', this.$refs[this.refText])
    const fileds = this.formOpts?.fieldList
    this.isMore =
      Array.isArray(fileds) && fileds.filter(f => f.isHide !== true).length > 4
  },
  methods: {
    isClearable(binds) {
      if (binds && binds.clearable !== undefined) {
        return binds.clearable
      } else {
        return true
      }
    },
    // 工具类函数
    formatSpan(number) {
      return number || 24 / this.widthSize
    },
    // placeholder转换
    formatPlaceholder(field) {
      if (field.placeholder) {
        return field.placeholder
      } else {
        let txt = ''
        switch (field.cpn) {
          case 'el-input':
            txt = '请输入' + field.label
            break
          case 'el-select':
            txt = '请选择' + field.label
            break
          case 'el-cascader':
            txt = '请选择' + field.label
            break

          default:
            break
        }
        return txt
      }
    },
    // 子组件类型 转换
    compChildName({ cpn }) {
      switch (cpn) {
        case 'el-select':
          return 'el-option'

        default:
          break
      }
    },
    // 根据prop获取options
    propTraOpt({ prop }) {
      if (this.formOpts.optionsObj && this.formOpts.optionsObj[prop]) {
        return this.formOpts.optionsObj[prop]
      } else {
        return []
      }
    },
    // 子组件转换 label
    compChildLabel({ cpn, selectOption }, value) {
      switch (cpn) {
        case 'el-select':
          return value[selectOption?.label || 'label']

        default:
          break
      }
    },
    // 子组件转换 value
    compChildValue({ cpn, selectOption }, value) {
      switch (cpn) {
        case 'el-select':
          return value[selectOption?.value || 'value']

        default:
          break
      }
    },
    // 组件格式化数据
    formatOptions(field) {
      if (field.cpn === 'el-cascader') {
        return this.formOpts.optionsObj[field.prop]
      }
      return null
    },
    // className 转换
    formatClassName(className) {
      if (typeof className === 'string') {
        return className
      } else if (Array.isArray(className)) {
        return [...className]
      }
      return ''
    },
    // 事件绑定
    bindEvents(field) {
      // eventHandle  tChange 需要绑定的事件
      const event = field.eventHandler || {}
      const changeEvent = {}
      Object.keys(event).forEach(v => {
        changeEvent[v] = e => {
          if ((typeof e === 'number' && e === 0) || e) {
            event[v] && event[v](e, this.formOpts, arguments)
          } else {
            event[v] && event[v](this.formOpts, arguments)
          }
        }
      })
      // console.log({ ...changeEvent })
      return { ...changeEvent }
    },

    // 收缩 / 展开
    shrinkBtn() {
      this.isShrink = !this.isShrink
      this.$emit('changeShrink', this.isShrink)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
/* 需要考虑lable值超出很多 */
::v-deep {
  .border-item {
    .el-input {
      display: block;
    }
    .el-input__inner {
      border: none;
      padding-left: 0;
    }
    .el-form-item:not(.not-bd) {
      &::before {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        border: 1px solid #dcdee1;
        border-radius: 4px;
      }
      &:hover,
      &:focus {
        &::before {
          border: 1px solid $primaryColor;
        }
      }
    }
  }

  .el-form-item {
    box-sizing: border-box;
    position: relative;
    /* overflow: hidden; */
    /* height: 32px; // 暂时写死处理 */
    input {
      background: transparent;
      color: #000000;
      font-size: 14px;
      font-weight: 400;
      /* display: block; */
    }
    .el-select,
    .el-input__inner {
      display: block;
      /* border: none; */
      width: 100%;
      background: transparent;
    }
    /* select 能自适应宽度 */
  }
  .children-ml0 {
    .el-form-item__label-wrap {
      margin-left: 0 !important;
      flex-shrink: 0;
    }
  }
  .el-form-item__content {
    margin-left: 0;
    .el-date-editor--daterange.el-input__inner,
    .el-cascader,
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-date-editor .el-range-input {
      margin-top: -3px;
    }
  }
  .el-input.el-input--prefix {
    padding-left: 25px;
    .el-input__prefix {
      left: 0;
    }
  }
  .el-date-editor.el-range-editor.el-input__inner.el-date-editor--datetimerange.el-range-editor--small {
    height: 31px;
  }
  .hok-select-multiple .el-select__tags {
    max-height: 78px;
    overflow-y: auto;
  }
  .el-form-item__label {
    padding: 0 0 0 8px;
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    font-family: '微软雅黑';
    padding-right: 10px;
  }
}
.el-range-editor.el-input__inner {
  display: flex !important;
}
.hok-search-form {
  margin-bottom: -18px;
  .search-form-box {
    height: auto;
    transition: height 0.5s ease;
    &.hidden-search-form {
      display: block;
      height: 50px;
      overflow-y: hidden;
    }
  }
  .hok-search-form-btn {
    display: block;
    margin-bottom: 18px;
    .shrink-box {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      color: $primaryColor;
      font-size: 14px;
      font-weight: 400;
      span {
        padding: 0 4px 0 12px;
      }
      i {
        font-size: 14px;
        transition: all 0.2s ease;
        &.up {
          transform: rotate(180deg);
        }
      }
    }
    .hok-button.right {
      float: right;
    }
  }
}
</style>

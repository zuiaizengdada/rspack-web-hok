<template>
  <div v-if="show">
    <el-form label-position="top">
      <el-form-item v-if="data.type != 'grid'" label="字段属性">
        <el-input v-model="data.model" disabled />
      </el-form-item>
      <el-form-item v-if="data.type != 'grid'" label="标题">
        <el-input v-model="data.name" />
      </el-form-item>
      <!-- <el-form-item v-if="Object.keys(data.options).indexOf('width') >= 0" label="宽度">
        <el-input v-model="data.options.width" />
      </el-form-item> -->

      <el-form-item v-if="Object.keys(data.options).indexOf('height') >= 0" label="高度">
        <el-input v-model="data.options.height" />
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('size') >= 0" label="大小">
        宽度
        <el-input v-model.number="data.options.size.width" style="width: 90px" type="number" />
        高度
        <el-input v-model.number="data.options.size.height" style="width: 90px" type="number" />
      </el-form-item>

      <el-form-item
        v-if="Object.keys(data.options).indexOf('placeholder') >= 0 && (data.type != 'time' || data.type != 'date')"
        label="占位内容"
      >
        <el-input v-model="data.options.placeholder" />
      </el-form-item>
      <!-- <el-form-item v-if="Object.keys(data.options).indexOf('inline') >= 0" label="布局方式">
        <el-radio-group v-model="data.options.inline">
          <el-radio-button :label="false">块级</el-radio-button>
          <el-radio-button :label="true">行内</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item v-if="Object.keys(data.options).indexOf('showInput') >= 0" label="显示输入框">
        <el-switch v-model="data.options.showInput" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('min') >= 0" label="最小值">
        <el-input-number v-model="data.options.min" :min="0" :max="100" :step="1" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('max') >= 0" label="最大值">
        <el-input-number v-model="data.options.max" :min="0" :max="100" :step="1" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('step') >= 0" label="步长">
        <el-input-number v-model="data.options.step" :min="0" :max="100" :step="1" />
      </el-form-item>
      <!-- <el-form-item v-if="data.type == 'select' || data.type == 'imgupload'" label="是否多选">
        <el-switch v-model="data.options.multiple" @change="handleSelectMuliple" />
      </el-form-item> -->
      <!-- <el-form-item v-if="data.type == 'select'" label="是否可搜索">
        <el-switch v-model="data.options.filterable" />
      </el-form-item> -->
      <el-form-item v-if="Object.keys(data.options).indexOf('allowHalf') >= 0" label="允许半选">
        <el-switch v-model="data.options.allowHalf" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showAlpha') >= 0" label="支持透明度选择">
        <el-switch v-model="data.options.showAlpha" />
      </el-form-item>
      <!-- <el-form-item v-if="Object.keys(data.options).indexOf('showLabel') >= 0" label="是否显示标签">
        <el-switch v-model="data.options.showLabel" />
      </el-form-item> -->
      <el-form-item v-if="Object.keys(data.options).indexOf('options') >= 0 && !data.params" label="选项">
        <!-- <el-radio-group v-model="data.options.remote" size="mini" style="margin-bottom: 10px">
          <el-radio-button :label="false">静态数据</el-radio-button>
          <el-radio-button :label="true">远端数据</el-radio-button>
        </el-radio-group> -->
        <!-- <template v-if="data.options.remote">
          <div>
            <el-input v-model="data.options.remoteFunc" size="mini" style="">
              <template slot="prepend">远端方法</template>
            </el-input>
            <el-input v-model="data.options.props.value" size="mini" style="">
              <template slot="prepend">值</template>
            </el-input>
            <el-input v-model="data.options.props.label" size="mini" style="">
              <template slot="prepend">标签</template>
            </el-input>
          </div>
        </template>
        <template v-else> -->
        <template v-if="data.type == 'radio' || (data.type == 'select' && !data.options.multiple)">
          <el-radio-group v-model="data.options.defaultValue">
            <draggable
              tag="ul"
              :list="data.options.options"
              v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }"
              handle=".drag-item"
            >
              <li v-for="(item, index) in data.options.options" :key="index">
                <el-radio :label="item[data.options.props.value]" style="margin-right: 5px">
                  <el-input
                    v-model="item[data.options.props.value]"
                    :style="{ width: data.options.showLabel ? '90px' : '180px' }"
                    size="mini"
                    @input="handleChangeOptions(item)"
                  />
                  <el-input v-if="data.options.showLabel" v-model="item.label" style="width: 90px" size="mini" />
                  <!-- <input v-model="item.value"/> -->
                </el-radio>
                <i
                  class="drag-item"
                  style="font-size: 16px; margin: 0 5px; cursor: move"
                ><i
                  class="iconfont icon-icon_bars"
                /></i>
                <el-button
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                  @click="handleOptionsRemove(index)"
                />
              </li>
            </draggable>
          </el-radio-group>
        </template>

        <template v-if="data.type == 'checkbox' || (data.type == 'select' && data.options.multiple)">
          <el-checkbox-group v-model="data.options.defaultValue">
            <draggable
              tag="ul"
              :list="data.options.options"
              v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }"
              handle=".drag-item"
            >
              <li v-for="(item, index) in data.options.options" :key="index">
                <el-checkbox :label="item[data.options.props.value]" style="margin-right: 5px">
                  <el-input
                    v-model="item[data.options.props.value]"
                    :style="{ width: data.options.showLabel ? '90px' : '180px' }"
                    size="mini"
                    @input="handleChangeOptions(item)"
                  />
                  <el-input v-if="data.options.showLabel" v-model="item.label" style="width: 90px" size="mini" />
                </el-checkbox>
                <i
                  class="drag-item"
                  style="font-size: 16px; margin: 0 5px; cursor: move"
                ><i
                  class="iconfont icon-icon_bars"
                /></i>
                <el-button
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                  @click="handleOptionsRemove(index)"
                />
              </li>
            </draggable>
          </el-checkbox-group>
        </template>
        <div style="margin-left: 22px">
          <el-button type="text" @click="handleAddOption">添加选项</el-button>
        </div>
        <!-- </template> -->
      </el-form-item>

      <el-form-item v-if="data.type == 'cascader'" label="远端数据">
        <div>
          <el-input v-model="data.options.remoteFunc" size="mini" style="">
            <template slot="prepend">远端方法</template>
          </el-input>
          <el-input v-model="data.options.props.value" size="mini" style="">
            <template slot="prepend">值</template>
          </el-input>
          <el-input v-model="data.options.props.label" size="mini" style="">
            <template slot="prepend">标签</template>
          </el-input>
          <el-input v-model="data.options.props.children" size="mini" style="">
            <template slot="prepend">子选项</template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item
        v-if="
          Object.keys(data.options).indexOf('defaultValue') >= 0 &&
            (data.type == 'textarea' ||
              data.type == 'input' ||
              data.type == 'rate' ||
              data.type == 'color' ||
              data.type == 'switch' ||
              data.type == 'text')
        "
        label="默认值"
      >
        <el-input v-if="data.type == 'textarea'" v-model="data.options.defaultValue" type="textarea" :rows="5" />
        <el-input v-if="data.type == 'input'" v-model="data.options.defaultValue" />
        <el-rate
          v-if="data.type == 'rate'"
          v-model="data.options.defaultValue"
          style="display: inline-block; vertical-align: middle"
          :max="data.options.max"
          :allow-half="data.options.allowHalf"
        />
        <el-button
          v-if="data.type == 'rate'"
          type="text"
          style="display: inline-block; vertical-align: middle; margin-left: 10px"
          @click="data.options.defaultValue = 0"
        >清空</el-button>
        <el-color-picker
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        />
        <el-switch v-if="data.type == 'switch'" v-model="data.options.defaultValue" />
        <el-input v-if="data.type == 'text'" v-model="data.options.defaultValue" />
      </el-form-item>

      <el-form-item v-if="data.type == 'textarea' || data.type == 'input'" label="最大字数">
        <el-input-number v-model="data.options.maxlength" :min="-1" />
      </el-form-item>
      <el-form-item v-if="data.type == 'textarea' || data.type == 'input'" label="显示字数统计">
        <el-switch v-model="data.options.showWordLimit" />
      </el-form-item>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <el-form-item v-if="data.type == 'date'" label="显示类型">
          <el-select v-model="data.options.type">
            <el-option value="year" />
            <el-option value="month" />
            <el-option value="date" />
            <el-option value="dates" />
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime" />
            <el-option value="datetimerange" />
            <el-option value="daterange" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.type == 'time'" label="是否为范围选择">
          <el-switch v-model="data.options.isRange" />
        </el-form-item>
        <el-form-item v-if="data.type == 'date'" label="是否获取时间戳">
          <el-switch v-model="data.options.timestamp" />
        </el-form-item>
        <el-form-item
          v-if="
            (!data.options.isRange && data.type == 'time') ||
              (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')
          "
          label="占位内容"
        >
          <el-input v-model="data.options.placeholder" />
        </el-form-item>
        <el-form-item
          v-if="data.options.isRange || data.options.type == 'datetimerange' || data.options.type == 'daterange'"
          label="开始时间占位内容"
        >
          <el-input v-model="data.options.startPlaceholder" />
        </el-form-item>
        <el-form-item
          v-if="data.options.isRange || data.options.type == 'datetimerange' || data.options.type == 'daterange'"
          label="结束时间占位内容"
        >
          <el-input v-model="data.options.endPlaceholder" />
        </el-form-item>
        <el-form-item label="格式">
          <el-input v-model="data.options.format" />
        </el-form-item>
        <el-form-item v-if="data.type == 'time' && Object.keys(data.options).indexOf('isRange') >= 0" label="默认值">
          <el-time-picker
            v-if="!data.options.isRange"
            key="1"
            v-model="data.options.defaultValue"
            style="width: 100%"
            :arrow-control="data.options.arrowControl"
            :value-format="data.options.format"
          />
          <el-time-picker
            v-if="data.options.isRange"
            key="2"
            v-model="data.options.defaultValue"
            style="width: 100%"
            is-range
            :arrow-control="data.options.arrowControl"
            :value-format="data.options.format"
          />
        </el-form-item>
      </template>

      <template v-if="data.type == 'imgupload'">
        <el-form-item label="最大上传数">
          <el-input v-model.number="data.options.length" type="number" />
        </el-form-item>
        <el-form-item label="使用七牛上传">
          <el-switch v-model="data.options.isQiniu" />
        </el-form-item>
        <template v-if="data.options.isQiniu">
          <el-form-item label="Domain" :required="true">
            <el-input v-model="data.options.domain" />
          </el-form-item>
          <el-form-item label="获取七牛Token方法" :required="true">
            <el-input v-model="data.options.tokenFunc" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="图片上传地址" :required="true">
            <el-input v-model="data.options.action" />
          </el-form-item>
        </template>
      </template>

      <template v-if="data.type == 'blank'">
        <el-form-item label="绑定数据类型">
          <el-select v-model="data.options.defaultType">
            <el-option value="String" label="字符串" />
            <el-option value="Object" label="对象" />
            <el-option value="Array" label="数组" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'grid'">
        <el-form-item label="栅格间隔">
          <el-input v-model.number="data.options.gutter" type="number" />
        </el-form-item>
        <el-form-item label="列配置项">
          <draggable
            tag="ul"
            :list="data.columns"
            v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.columns" :key="index">
              <i
                class="drag-item"
                style="font-size: 16px; margin: 0 5px; cursor: move"
              ><i
                class="iconfont icon-icon_bars"
              /></i>
              <el-input
                v-model.number="item.span"
                placeholder="栅格值"
                size="mini"
                style="width: 100px"
                type="number"
              />

              <el-button
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px; margin-left: 5px"
                @click="handleOptionsRemove(index)"
              />
            </li>
          </draggable>
          <div style="margin-left: 22px">
            <el-button type="text" @click="handleAddColumn">添加列</el-button>
          </div>
        </el-form-item>
        <el-form-item label="水平排列方式">
          <el-select v-model="data.options.justify">
            <el-option value="start" label="左对齐" />
            <el-option value="end" label="右对齐" />
            <el-option value="center" label="居中" />
            <el-option value="space-around" label="两侧间隔相等" />
            <el-option value="space-between" label="两端对齐" />
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式">
          <el-select v-model="data.options.align">
            <el-option value="top" label="顶部对齐" />
            <el-option value="middle" label="居中" />
            <el-option value="bottom" label="底部对齐" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type != 'grid'">
        <el-form-item label="操作属性">
          <el-checkbox
            v-if="Object.keys(data.options).indexOf('readonly') >= 0"
            v-model="data.options.readonly"
          >完全只读</el-checkbox>
          <el-checkbox
            v-if="Object.keys(data.options).indexOf('disabled') >= 0"
            v-model="data.options.disabled"
          >禁用
          </el-checkbox>
          <el-checkbox
            v-if="Object.keys(data.options).indexOf('editable') >= 0"
            v-model="data.options.editable"
          >文本框可输入</el-checkbox>
          <el-checkbox
            v-if="Object.keys(data.options).indexOf('clearable') >= 0"
            v-model="data.options.clearable"
          >显示清除按钮
          </el-checkbox>
          <el-checkbox
            v-if="Object.keys(data.options).indexOf('arrowControl') >= 0"
            v-model="data.options.arrowControl"
          >使用箭头进行时间选择</el-checkbox>
          <el-checkbox
            v-if="Object.keys(data.options).indexOf('isDelete') >= 0"
            v-model="data.options.isDelete"
          >删除</el-checkbox>
          <el-checkbox
            v-if="Object.keys(data.options).indexOf('isEdit') >= 0"
            v-model="data.options.isEdit"
          >编辑</el-checkbox>
        </el-form-item>
        <el-form-item label="校验">
          <div v-if="Object.keys(data.options).indexOf('required') >= 0">
            <el-checkbox v-model="data.options.required">必填</el-checkbox>
          </div>
          <!-- <el-select
            v-if="Object.keys(data.options).indexOf('dataType') >= 0"
            v-model="data.options.dataType"
            size="mini"
          >
            <el-option value="string" label="字符串" />
            <el-option value="number" label="数字" />
            <el-option value="boolean" label="布尔值" />
            <el-option value="integer" label="整数" />
            <el-option value="float" label="浮点数" />
            <el-option value="url" label="URL地址" />
            <el-option value="email" label="邮箱地址" />
            <el-option value="hex" label="十六进制" />
          </el-select> -->

          <div v-if="Object.keys(data.options).indexOf('pattern') >= 0">
            <!-- <el-input
              v-model.lazy="data.options.pattern"
              size="mini"
              class="config-pattern-input"
              style="width: 240px"
              placeholder="填写正则表达式"
            >
              <template slot="prepend">/</template>
              <template slot="append">/</template>
            </el-input> -->
            <el-select
              v-if="Object.keys(data.options).indexOf('pattern') >= 0"
              v-model="data.options.pattern"
              size="mini"
            >
              <el-option value="^(?:(?:\+|00)86)?1[3-9]\d{9}$" label="手机号" />
              <el-option value="^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$" label="邮箱地址" />
              <el-option
                value="^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$"
                label="邮政编码"
              />
            </el-select>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['data'],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    }
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  watch: {
    'data.options.isRange': function (val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue') >= 0) {
            this.data.options.defaultValue = ''
          }
        }
      }
    },
    'data.options.required': function (val) {
      this.validateRequired(val)
    },
    'data.options.dataType': function (val) {
      this.validateDataType(val)
    },
    'data.options.pattern': function (val) {
      this.valiatePattern(val)
    },
    'data.name': function (val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.valiatePattern(this.data.options.pattern)
      }
    }
  },
  methods: {
    handleOptionsRemove(index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else {
        this.data.options.options.splice(index, 1)
      }
    },
    handleChangeOptions(item) {
      item[this.data.options.props.label] = item[this.data.options.props.value]
    },
    handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: '新选项',
          label: '新选项'
        })
      } else {
        this.data.options.options.push({
          value: '新选项'
        })
      }
    },
    handleAddColumn() {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    generateRule() {
      this.data.rules = []
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }
      }
    },

    validateRequired(val) {
      if (val) {
        this.validator.required = {
          required: true,
          message: `${this.data.name}必须填写`
        }
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },

    validateDataType(val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.type = { type: val, message: this.data.name + '格式不正确' }
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    valiatePattern(val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = {
          pattern: val,
          message: this.data.name + '格式不匹配'
        }
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    }
  }
}
</script>

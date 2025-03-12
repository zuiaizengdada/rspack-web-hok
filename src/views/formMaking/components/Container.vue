<template>
  <div class="fm-style">
    <el-container class="fm2-container">
      <el-main class="fm2-main">
        <el-container>
          <el-aside width="250px">
            <div class="components-list">
              <template v-if="basicFields.length">
                <div class="widget-cate">通用</div>
                <draggable
                  tag="ul"
                  :list="basicComponents"
                  v-bind="{ group: { name: 'people', pull: 'clone', put: false }, sort: false, ghostClass: 'ghost' }"
                  :move="handleMove"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                >
                  <template v-for="(item, index) in basicComponents">
                    <li
                      v-if="basicFields.indexOf(item.type) >= 0"
                      :key="index"
                      class="form-edit-widget-label"
                      :class="{ 'no-put': item.type == 'divider' }"
                    >
                      <a>
                        <i class="icon iconfont" :class="item.icon" />
                        <span>{{ item.name }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>
              <template v-if="advanceFields.length">
                <div class="widget-cate">基本信息</div>
                <draggable
                  tag="ul"
                  :list="advanceComponents"
                  v-bind="{ group: { name: 'people', pull: 'clone', put: false }, sort: false, ghostClass: 'ghost' }"
                  :move="handleMove"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                >
                  <template v-for="(item, index) in advanceComponents">
                    <li
                      v-if="advanceFields.indexOf(item.type) >= 0"
                      :key="index"
                      class="form-edit-widget-label"
                      :class="{ 'no-put': item.type == 'table' }"
                    >
                      <a>
                        <i class="icon iconfont" :class="item.icon" />
                        <span>{{ item.name }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>

              <!-- <template v-if="layoutFields.length">
                <div class="widget-cate">布局字段</div>
                <draggable
                  tag="ul"
                  :list="layoutComponents"
                  v-bind="{ group: { name: 'people', pull: 'clone', put: false }, sort: false, ghostClass: 'ghost' }"
                  :move="handleMove"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                >
                  <template v-for="(item, index) in layoutComponents">
                    <li v-if="layoutFields.indexOf(item.type) >= 0" :key="index" class="form-edit-widget-label no-put">
                      <a>
                        <i class="icon iconfont" :class="item.icon" />
                        <span>{{ item.name }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template> -->
            </div>
          </el-aside>
          <el-container class="center-container" direction="vertical">
            <el-header class="btn-bar" style="height: 45px">
              <div>
                <el-button
                  v-if="clearable"
                  type="text"
                  size="medium"
                  icon="el-icon-delete"
                  @click="handleClear"
                >清空</el-button>
                <el-button
                  v-if="preview"
                  type="text"
                  size="medium"
                  icon="el-icon-view"
                  @click="handlePreview"
                >预览</el-button>
                <el-button
                  v-if="generateJson"
                  type="text"
                  size="medium"
                  icon="el-icon-tickets"
                  @click="handleGenerateJson"
                >生成JSON</el-button>
              </div>
              <div>
                <el-button @click="handleBack">取消</el-button>
                <el-button type="primary" @click="handleSave">保存</el-button>
              </div>
              <slot name="action" />
            </el-header>
            <el-main :class="{ 'widget-empty': widgetForm.list.length == 0 }">
              <widget-form v-if="!resetJson" ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect" />
            </el-main>
          </el-container>
          <form-dialog ref="formDialog" @clear="clear" />
          <el-aside class="widget-config-container">
            <el-container>
              <el-header height="45px">
                <div
                  class="config-tab"
                  :class="{ active: configTab == 'widget' }"
                  @click="handleConfigSelect('widget')"
                >
                  字段属性
                </div>
                <!-- <div class="config-tab" :class="{ active: configTab == 'form' }" @click="handleConfigSelect('form')">
                  表单属性
                </div> -->
              </el-header>
              <el-main class="config-content">
                <widget-config v-show="configTab == 'widget'" :data="widgetFormSelect" />
                <form-config v-show="configTab == 'form'" :data="widgetForm.config" />
              </el-main>
            </el-container>
          </el-aside>

          <cus-dialog
            ref="widgetPreview"
            :visible="previewVisible"
            width="1000px"
            form
            @on-close="previewVisible = false"
          >
            <generate-form
              v-if="previewVisible"
              ref="generateForm"
              insite="true"
              :data="widgetForm"
              :value="widgetModels"
              :remote="remoteFuncs"
              @on-change="handleDataChange"
            >
              <template v-slot:blank="scope">
                Width <el-input v-model="scope.model.blank.width" style="width: 100px" /> Height
                <el-input v-model="scope.model.blank.height" style="width: 100px" />
              </template>
            </generate-form>

            <template slot="action">
              <el-button type="primary" @click="handleTest">获取数据</el-button>
              <el-button @click="handleReset">重置</el-button>
            </template>
          </cus-dialog>

          <cus-dialog
            ref="uploadJson"
            :visible="uploadVisible"
            width="800px"
            form
            @on-close="uploadVisible = false"
            @on-submit="handleUploadJson"
          >
            <el-alert type="info" title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可" />
            <div id="uploadeditor" style="height: 400px; width: 100%">{{ jsonEg }}</div>
          </cus-dialog>

          <cus-dialog ref="jsonPreview" :visible="jsonVisible" width="800px" form @on-close="jsonVisible = false">
            <div id="jsoneditor">
              <span>{{ jsonTemplate }}</span>
            </div>

            <template slot="action">
              <el-button type="primary" class="json-btn" @click="handleCopy">复制数据</el-button>
            </template>
          </cus-dialog>
        </el-container>
      </el-main>
      <el-footer
        height="30px"
        style="font-weight: 600"
      >Powered by
        <a target="_blank" href="https://github.com/GavinZhuLei/vue-form-making">vue-form-making</a></el-footer>
    </el-container>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import FormDialog from './FormDialog'
import GenerateForm from './GenerateForm'
import { basicComponents, advanceComponents } from './componentsConfig.js'
import request from '../util/request.js'
import generateCode from './generateCode.js'
import '../styles/cover.scss'
import '../styles/index.scss'
export default {
  name: 'FmMakingForm',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm,
    FormDialog
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    basicFields: {
      type: Array,
      default: () => [
        'input',
        'textarea',
        'number',
        'radio',
        'checkbox',
        'time',
        'date',
        'rate',
        'color',
        'select',
        'switch',
        'slider',
        'text'
      ]
    },
    advanceFields: {
      type: Array,
      default: () => ['blank', 'imgupload', 'editor', 'cascader', 'input', 'select']
    },
    layoutFields: {
      type: Array,
      default: () => ['grid']
    }
  },
  data() {
    return {
      basicComponents,
      advanceComponents,
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'top',
          size: 'small',
          questionnaireName: '',
          validType: '',
          startTime: '',
          endTime: ''
        }
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: '1', name: '1111' },
              { id: '2', name: '2222' },
              { id: '3', name: '3333' }
            ]

            resolve(options)
          }, 2000)
        },
        funcGetToken(resolve) {
          request.get('http://tools-server.making.link/api/uptoken').then((res) => {
            resolve(res.uptoken)
          })
        },
        upload_callback(response, file, fileList) {
          console.log('callback', response, file, fileList)
        }
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      vueTemplate: '',
      jsonTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
  "list": [],
  "config": {
    "labelWidth": 100,
    "labelPosition": "top",
    "size": "small"
  }
}`,
      codeActiveName: 'vue'
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function (val) {
        console.log(this.$refs.widgetForm)
      }
    }
  },

  methods: {
    handleGoGithub() {
      window.location.href = 'https://github.com/GavinZhuLei/vue-form-making'
    },
    handleConfigSelect(value) {
      this.configTab = value
    },
    handleMoveEnd(evt) {
      console.log('end', evt)
    },
    handleMoveStart({ oldIndex }) {
      console.log('start', oldIndex, this.basicComponents)
    },
    handleMove() {
      return true
    },
    handlePreview() {
      this.previewVisible = true
    },
    handleBack() {
      this.$router.back(-1)
      this.clear()
    },
    handleSave() {
      if (!this.widgetForm.list.length) {
        this.$notify.warning('表单不能为空')
        return
      }
      this.$refs.formDialog.init(JSON.stringify(this.widgetForm))
    },
    handleCopy() {
      let copyTextArea = null
      try {
        copyTextArea = document.createElement('textarea')
        copyTextArea.style.height = '0px'
        copyTextArea.style.opacity = '0'
        copyTextArea.style.width = '0px'
        document.body.appendChild(copyTextArea)
        copyTextArea.value = this.jsonCopyValue
        copyTextArea.select()
        document.execCommand('copy')
      } finally {
        if (copyTextArea && copyTextArea.parentNode) {
          copyTextArea.parentNode.removeChild(copyTextArea)
        }
      }
      this.$notify.success('复制成功')
    },
    handleTest() {
      this.$refs.generateForm
        .getData()
        .then((data) => {
          this.$alert(data, '').catch((e) => {})
          this.$refs.widgetPreview.end()
        })
        .catch((e) => {
          this.$refs.widgetPreview.end()
        })
    },
    handleReset() {
      this.$refs.generateForm.reset()
    },
    handleGenerateJson() {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      this.$nextTick(() => {
        // const editor = ace.edit('jsoneditor')
        // editor.session.setMode('ace/mode/json')

        // if (!this.jsonClipboard) {
        //   this.jsonClipboard = new Clipboard('.json-btn')
        //   this.jsonClipboard.on('success', (e) => {
        //     this.$message.success('复制成功')
        //   })
        // }
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    handleUploadJson() {
      try {
        this.setJSON(JSON.parse(this.uploadEditor.getValue()))
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },
    handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'top',
          size: 'small',
          questionnaireName: '',
          validType: '',
          startTime: '',
          endTime: ''
        }
      }
      this.widgetFormSelect = {}
    },
    clear() {
      this.handleClear()
    },
    getJSON() {
      return this.widgetForm
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON(json) {
      this.widgetForm = json

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0]
      }
    },
    handleInput(val) {
      console.log(val)
      this.blank = val
    },
    handleDataChange(field, value, data) {
      console.log(field, value, data)
    }
  }
}
</script>

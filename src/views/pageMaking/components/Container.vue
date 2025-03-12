<template>
  <div class="pm-style">
    <el-container class="fm2-container">
      <el-header class="btn-bar" style="height: 68px">
        <div class="flex flex-middle fm2-back" @click="handleBack">
          <svg-icon icon-class="icon_back" class="icon_back" />
          <span>退出</span>
        </div>
        <div>
          <el-button
            type="primary"
            plain
            size="small"
            @click="handlePreview"
          >保存并预览</el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleSave"
          >保存</el-button>
        </div>
      </el-header>
      <el-main class="fm2-main">
        <el-container>
          <el-aside>
            <div class="components-list">
              <template v-if="basicComponents.length">
                <div class="widget-cate">
                  <span class="title">工具区</span>
                  <span>拖动/点击组件到操作区</span>
                </div>
                <draggable
                  tag="ul"
                  class="widget-url"
                  :list="basicComponents"
                  v-bind="{
                    group: { name: 'people', pull: 'clone', put: false },
                    sort: false,
                    ghostClass: 'ghost'
                  }"
                  :move="handleMove"
                >
                  <template v-for="(item, index) in basicComponents">
                    <li
                      :key="index"
                      class="form-edit-widget-label"
                      :class="{ 'mar-0': index === basicComponents.length - 1 }"
                    >
                      <svg-icon
                        :icon-class="item.icon"
                        class="form-edit-widget-icon"
                      />
                      <span>{{ item.name }}</span>
                    </li>
                  </template>
                </draggable>
              </template>
            </div>
          </el-aside>
          <el-container class="center-container" direction="vertical">
            <el-main :class="{ 'widget-empty': widgetForm.list.length == 0 }">
              <widget-form
                v-if="!resetJson"
                ref="widgetForm"
                :data="widgetForm"
                :select.sync="widgetFormSelect"
              />
            </el-main>
          </el-container>
          <form-dialog ref="formDialog" @clear="clear" />
          <el-aside width="540px" class="widget-config-container">
            <el-container>
              <el-header height="45px">
                <div
                  class="config-tab"
                  :class="{ active: configTab == 'form' }"
                  @click="handleConfigSelect('form')"
                >
                  页面设置
                </div>
                <div
                  class="config-tab"
                  :class="{ active: configTab == 'widget' }"
                  @click="handleConfigSelect('widget')"
                >
                  组件设置
                </div>
              </el-header>
              <el-scrollbar style="height: 800px">
                <el-main class="config-content">
                  <form-config
                    v-show="configTab == 'form'"
                    ref="formConfig"
                    :data.sync="widgetForm.config"
                  />
                  <widget-config
                    v-show="configTab == 'widget'"
                    :data.sync="widgetFormSelect"
                    @del="handleDel"
                  />
                </el-main>
              </el-scrollbar>
            </el-container>
          </el-aside>
          <el-dialog
            title="预览"
            :visible.sync="previewVisible"
            :close-on-click-modal="false"
            width="400px"
          >
            <div class="flex flex-middle flex-center">
              <AppQrcode :src="textSrc" />
            </div>
          </el-dialog>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import FormDialog from './FormDialog'
import { basicComponents } from './componentsConfig.js'
import AppQrcode from '@/components/AppQrcode'
import '../styles/index.scss'
import { setItem, getItem, removeItem } from '@/utils/localStorage'
import {
  specialCreate,
  specialEdit,
  specialDetail,
  specialGetGoods,
  specialGetTeacher,
  specialPageCheck
} from '@/api/messageManagement/special'
export default {
  name: 'FmMakingForm',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    FormDialog,
    AppQrcode
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
    }
  },
  data() {
    return {
      basicComponents,
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          backgroundType: 1,
          backgroundVal: '',
          imageUrl: [],
          title: '',
          startTime: '',
          endTime: '',
          pageName: '',
          remark: '',
          status: 1,
          isFixed: 1,
          tenantId: '',
          id: undefined
        }
      },
      isPreview: false,
      configTab: 'form',
      widgetFormSelect: {},
      previewVisible: false,
      codeVisible: false,
      widgetModels: {},
      jsonTemplate: '',
      jsonCopyValue: '',
      textSrc: '',
      timeOut: null,
      type: 'add'
    }
  },
  created() {
    this.init()
    window.addEventListener('beforeunload', this.beforeUnloadHandler, false)
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler, false)
    if (this.timeOut) {
      clearInterval(this.timeOut)
    }
  },
  methods: {
    beforeUnloadHandler(e) {
      e.returnValue = '离开此页面？'
      if (this.timeOut) {
        clearInterval(this.timeOut)
      }
    },
    beforeLeave() {
      return this.$confirm('系统可能不会保存您所做的更改。', '离开此页面？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    async init() {
      const id = this.$route.query.id
      this.type = id ? 'edit' : 'add'
      this.scheduledSave()
      if (!id) {
        const json = getItem('PageGenerator')
        if (json) {
          this.widgetForm = json
        }
        return
      }
      const { data } = await specialDetail({ id })
      let listData = []
      try {
        listData = JSON.parse(data.json)
      } catch (e) {
        listData = []
      }
      const list = await this.getDataSourceDetail(listData)
      const isFixed = data.isFixed ?? 0
      this.widgetForm = {
        list,
        config: {
          backgroundType: data.backgroundType,
          backgroundVal: data.backgroundVal,
          imageUrl: data.backgroundType === 3 ? [data.backgroundVal] : [],
          title: data.title,
          startTime: data.startTime,
          endTime: isFixed === 0 ? undefined : data.endTime,
          pageName: data.pageName,
          remark: data.remark,
          status: data.status,
          isFixed,
          tenantId: data.tenantId,
          id: this.$route.query.id
        }
      }
    },
    scheduledSave() {
      if (this.type === 'add') {
        this.timeOut = setInterval(() => {
          const json = JSON.stringify(this.widgetForm)
          if (json !== this.jsonCopyValue) {
            this.jsonCopyValue = JSON.stringify(this.widgetForm)
            setItem('PageGenerator', this.widgetForm)
          }
        }, 300000)
      }
    },
    async getDataSourceDetail(list) {
      const lecturerList = []
      const courseList = []
      let lecturerData = []
      let courseData = []
      list.forEach(i => {
        if (i.type === 'lecturer') {
          i.options.dataSource.forEach(j => {
            lecturerList.push(j.value)
          })
        }
        if (i.type === 'course') {
          i.options.dataSource.forEach(j => {
            courseList.push(j.value)
          })
        }
        if (i.type === 'picture') {
          i.options.dataSource.forEach(j => {
            if (j.jumpType === 1) {
              courseList.push(j.value)
            }
          })
        }
      })
      // 去重
      const lecturerId = [...new Set(lecturerList)]
      const goodsId = [...new Set(courseList)]
      if (lecturerList.length) {
        const { data } = await specialGetTeacher({ lecturerId })
        lecturerData = data
      }
      if (courseList.length) {
        const { data } = await specialGetGoods({ goodsId })
        courseData = data
      }
      return list.map(i => {
        if (i.type === 'lecturer') {
          const dataSource = i.options.dataSource.map(j => {
            const item = lecturerData.find(z => z.lecturerId === j.value) ?? {}
            return {
              ...item,
              ...j
            }
          })
          return {
            ...i,
            options: {
              ...i.options,
              dataSource
            }
          }
        }
        if (i.type === 'course') {
          const dataSource = i.options.dataSource.map(j => {
            const item = courseData.find(z => z.goodsId === j.value) ?? {}
            return {
              ...item,
              ...j
            }
          })
          return {
            ...i,
            options: {
              ...i.options,
              dataSource
            }
          }
        }
        if (i.type === 'picture') {
          const dataSource = i.options.dataSource.map(j => {
            if (j.jumpType === 1) {
              const item = courseData.find(z => z.goodsId === j.value) ?? {}
              return {
                ...j,
                contentName: item.contentName
              }
            }
            return j
          })
          return {
            ...i,
            options: {
              ...i.options,
              dataSource
            }
          }
        }
      })
    },
    handleConfigSelect(value) {
      this.configTab = value
    },
    handleMove() {
      return true
    },
    handleDel(model) {
      const index = this.widgetForm.list.findIndex(i => i.model === model)
      if (index !== -1) {
        this.$refs.widgetForm.handleWidgetDelete(index)
      }
    },
    handlePreview() {
      this.isPreview = true
      this.handleSave()
    },
    handleBack() {
      this.beforeLeave().then(() => {
        this.$router.push('/messageManager/specialManagement')
        if (this.timeOut) {
          clearInterval(this.timeOut)
        }
        this.clear()
      })
    },
    handleSave() {
      if (!this.widgetForm.list.length) {
        this.$message.error('表单不能为空')
        return
      }
      this.$refs.formConfig.$refs.form.validate(async valid => {
        // 页面设置是否为空校验
        if (valid) {
          // 字段属性是否为空校验
          const widgetValidate = await this.widgetValidate()
          if (!widgetValidate) return
          console.log(222222222, this.type)
          if (this.type === 'edit') {
            this.edit()
          } else {
            this.add()
          }
        } else {
          this.configTab = 'form'
        }
      })
    },
    areObjectPropertiesEmpty(arr) {
      if (!arr.length) {
        return false
      }
      const arrEmpty = arr.filter(i => i.jumpType !== 0)
      for (let i = 0; i < arrEmpty.length; i++) {
        const object = arrEmpty[i]
        const url = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/
        if (object.jumpType === 4 && !url.test(object.value)) {
          return false
        }
        for (const key in object) {
          const isEmpty =
            object[key] !== null &&
            object[key] !== undefined &&
            object[key] !== ''
          if (!isEmpty) {
            return false
          }
        }
      }
      return true // 如果所有属性都为空，则返回 true
    },
    async widgetValidate() {
      let valid = true
      const list = this.widgetForm.list
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const dataSource = item.options.dataSource
        if (item.type === 'picture') {
          valid = this.areObjectPropertiesEmpty(item.options.dataSource)
          console.log(item, item.options.dataSource)
        }
        if (item.type === 'lecturer') {
          valid = dataSource.length !== 0
        }
        if (item.type === 'course') {
          valid = item.options.tabsKey.length !== 0 && dataSource.length !== 0
          if (dataSource.length) {
            const statusList = dataSource
              .filter(i => i.status)
              .map(i => i.status)
            const obj = {
              1: '已隐藏',
              2: '已下架',
              3: '无库存',
              4: '已删除'
            }
            for (const key in obj) {
              if (statusList.includes(+key)) {
                valid = false
                this.$message.error(`课程组件有${obj[key]}商品，请检查后重试`)
                return
              }
            }
          }
        }
        if (!valid) {
          const obj = {
            picture: '图片',
            lecturer: '老师',
            course: '课程'
          }
          this.$message.error(`请检测${obj[item.type]}信息有误`)
          break
        }
      }
      if (!valid) {
        return valid
      }
      const goodsIds = []
      const lecturerIds = []
      list.forEach(i => {
        if (i.type === 'lecturer') {
          i.options.dataSource.forEach(i => {
            lecturerIds.push(i.value)
          })
        }
        if (i.type === 'course') {
          i.options.dataSource.forEach(i => {
            goodsIds.push(i.value)
          })
        }
      })
      const lecturerId = [...new Set(lecturerIds)]
      const goodsId = [...new Set(goodsIds)]
      const { code } = await specialPageCheck({ goodsId, lecturerId })
      if (code !== 1) {
        valid = false
      }
      return valid
    },
    getJson(data) {
      const list = data.map(i => {
        if (i.type === 'lecturer' || i.type === 'course') {
          const dataSource = i.options.dataSource.map(j => {
            const obj = {
              value: j.value
            }
            if (i.type === 'course') {
              obj.tabsKey = j.tabsKey
            }
            return obj
          })
          return {
            ...i,
            options: {
              ...i.options,
              dataSource
            }
          }
        }
        return i
      })
      return JSON.stringify(list)
    },
    async edit() {
      const json = this.getJson(this.widgetForm.list)
      const isFixed = this.widgetForm.config.isFixed
      let backgroundVal = this.widgetForm.config.backgroundVal
      const backgroundType = this.widgetForm.config.backgroundType
      if (backgroundType === 1) {
        backgroundVal = ''
      } else if (backgroundType === 3) {
        backgroundVal = this.widgetForm.config.imageUrl[0]
      }
      const { code } = await specialEdit({
        json,
        backgroundType,
        backgroundVal,
        endTime: isFixed === 0 ? undefined : this.widgetForm.config.endTime,
        isFixed,
        pageName: this.widgetForm.config.pageName,
        remark: this.widgetForm.config.remark,
        startTime: this.widgetForm.config.startTime,
        status: this.widgetForm.config.status,
        title: this.widgetForm.config.title,
        id: this.$route.query.id
      })
      if (code === 1) {
        this.$message.success('保存成功')
        if (this.isPreview) {
          const orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
          this.textSrc = process.env.VUE_APP_H5_URL + `pages/pageGenerator/index?id=${this.$route.query.id}&shopId=${this.widgetForm.config.tenantId || orgInfo.organizationId}&isPreview=true`
          this.isPreview = false
          this.previewVisible = true
        }
      }
    },
    async add() {
      const json = this.getJson(this.widgetForm.list)
      const isFixed = this.widgetForm.config.isFixed
      let backgroundVal = this.widgetForm.config.backgroundVal
      const backgroundType = this.widgetForm.config.backgroundType
      if (backgroundType === 1) {
        backgroundVal = ''
      } else if (backgroundType === 3) {
        backgroundVal = this.widgetForm.config.imageUrl[0]
      }
      const { code, data } = await specialCreate({
        json,
        backgroundType,
        backgroundVal,
        endTime: isFixed === 0 ? undefined : this.widgetForm.config.endTime,
        isFixed,
        pageName: this.widgetForm.config.pageName,
        remark: this.widgetForm.config.remark,
        startTime: this.widgetForm.config.startTime,
        status: this.widgetForm.config.status,
        title: this.widgetForm.config.title
      })
      if (code === 1) {
        this.$message.success('保存成功')
        this.type = 'edit'
        this.$router.push(`/pageGenerator?id=${data}`)
        removeItem('PageGenerator')
        if (this.timeOut) {
          clearInterval(this.timeOut)
        }
        if (this.isPreview) {
          const orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
          this.textSrc = process.env.VUE_APP_H5_URL + `pages/pageGenerator/index?id=${this.$route.query.id || data}&shopId=${this.widgetForm.config.tenantId || orgInfo.organizationId}&isPreview=true`
          this.isPreview = false
          this.previewVisible = true
        }
      }
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
    clear() {
      this.widgetForm = {
        list: [],
        config: {
          backgroundType: 1,
          backgroundVal: '',
          imageUrl: [],
          title: '',
          startTime: '',
          endTime: '',
          pageName: '',
          remark: '',
          status: 1,
          isFixed: 1,
          id: undefined
        }
      }
      this.widgetFormSelect = {}
    },
    handleDataChange(field, value, data) {
      console.log(field, value, data)
    }
  }
}
</script>

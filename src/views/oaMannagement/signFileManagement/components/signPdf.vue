<!-- //?模块说明 =>  合同签章模块 addToTab-->
<template>
  <div class="contract-signature-view">
    <div class="title-operation">
      <h2 class="title">签署配置</h2>
      <div class="operation">
        <el-button
          @click="cancel"
          style="background: #f1f2f4"
          :loading="loadingBtn"
          >取消</el-button
        >
        <el-button type="primary" @click="sumbit" :loading="loadingBtn"
          >保存模板</el-button
        >
      </div>
    </div>
    <div class="section-box">
      <!-- 选择组件 -->
      <aside class="signature-img">
        <div class="info">选择组件</div>
        <div class="list-container">
          <div
            v-for="item in componentList"
            :key="item.label"
            class="list-items"
            @click="handleComponentListClick(item)"
          >
            <img :src="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </div>
      </aside>
      <!-- 主体区域 -->
      <section class="main-layout" :class="{ 'is-first': isFirst }">
        <!-- 画图 -->
        <div class="out-view" :class="{ 'is-show': isShowPdf }">
          <div
            class="canvas-layout"
            v-for="item in numPages"
            :key="item"
            :id="`pdfEditor${item}`"
          >
            <!--页面组件列表展示-->
            <Shape
              v-for="(divItem, index) in componentData.filter(
                i => i.pageNum === item
              )"
              :key="divItem.id"
              :default-style="divItem.style"
              :style="getShapeStyle(divItem.style)"
              :active="divItem.id === (curComponent || {}).id"
              :element="divItem"
              :index="divItem.id"
              :pageNum="item"
            >
              <component
                :is="divItem.component"
                :id="'component' + divItem.id"
                class="component"
                :style="getComponentStyle(divItem.style)"
                :prop-value="divItem.propValue"
                :element="divItem"
              />
            </Shape>
            <!-- 右击菜单 -->
            <!-- <ContextMenu /> -->
            <!-- pdf部分 -->
            <canvas class="the-canvas" ref="theCanvas" />
          </div>
        </div>
        <i class="loading" v-loading="!isShowPdf" />
      </section>
      <!-- 位置信息 -->
      <div class="position-info">
        <h3 class="title">参数列表</h3>
        <rightFormList :row="row"></rightFormList>
      </div>
    </div>
  </div>
</template>
<script>
// 拖拽插件
import draggable from 'vuedraggable'
// pdf插件
import { fabric } from 'fabric'
import workerSrc from 'pdfjs-dist/es5/build/pdf.worker.entry'
const pdfjsLib = require('pdfjs-dist/es5/build/pdf.js')
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
import singleLineTextPng from '@/assets/image/oa/singleLineText.png'
import numberPng from '@/assets/image/oa/number.png'
import officialSealPng from '@/assets/image/oa/officialSeal.png'
import multilineTextPng from '@/assets/image/oa/multilineText.png'
import datePng from '@/assets/image/oa/datePng.png'
import autographPng from '@/assets/image/oa/autograph.png'
import emailPng from '@/assets/image/oa/email.png'
import idCardPng from '@/assets/image/oa/idCard.png'
import { getShapeStyle, getStyle } from './utils/style.js'
import { mapState } from 'vuex'
import componentList from './custom-component/component-list'
import { deepCopy, getRgbString, getMapKeyByValue } from './utils/utils'
import generateID from './utils/generateID'
import Shape from './Shape.vue'
import ContextMenu from './ContextMenu'
import VText from './custom-component/VText/Component'
import rightFormList from './rightFormList'
import {
  saveParamConfigInfoAjax,
  paramConfigInfoAjax
} from '../../api/signFile'
import { alignType, labelTextType } from './utils/options'
export default {
  components: { draggable, Shape, VText, rightFormList, ContextMenu },
  props: {
    row: {
      type: Object,
      default: () => {
        return {
          fileUrl: ''
        }
      }
    }
  },
  data() {
    return {
      // pdf地址
      componentList,
      canvasDivList: [],
      // 右侧坐标数据
      coordinateList: [
        { name: '名称', page: '所在页面', left: 'x坐标', top: 'Y坐标' }
      ],
      // 总页数
      numPages: 1,
      defaultNumPages: 1,
      // 当前页
      pageNum: 1,
      // 缩放比例
      scale: 1,
      // scale: 1.815,
      // pdf是否显示
      isFirst: true,
      isShowPdf: false,
      // pdf最外层的out-view
      outViewDom: null,
      // 各页pdf的canvas-layout
      canvasLayoutTopList: [],
      // 用来签章的canvas数组
      canvasEle: [],
      // 绘图区域的宽高
      whDatas: null,
      // pdf渲染的canvas数组
      canvas: [],
      // pdf渲染的canvas的ctx数组
      ctx: [],
      // pdf渲染的canvas的宽高
      pdfDoc: null,
      // 隐藏的input，用来提交数据
      shadowInputValue: '',
      showText: false,
      textPosition: { x: 0, y: 0 },
      xPos: 0,
      yPos: 0,
      dragStartX: 0,
      dragStartY: 0,
      dragging: false,
      svgFilterAttrs: ['width', 'height', 'top', 'left', 'rotate'],
      numberPng,
      datePng,
      singleLineTextPng,
      officialSealPng,
      multilineTextPng,
      autographPng,
      emailPng,
      idCardPng,
      loadingBtn: false
    }
  },
  computed: {
    ...mapState({
      componentData: state => state.oaManage.componentData,
      curComponent: state => state.oaManage.curComponent
    })
  },
  created() {
    this.paramConfigInfo()
    this.setPdfArea()
    this.$store.commit('oaManage/clearCanvas')
  },
  mounted() {},
  methods: {
    getShapeStyle,
    /**
     * pdf相关部分
     */
    // 设置PDF地址
    setPdfArea() {
      console.log(this.row, '设置PDF地址')
      // this.pdfUrl =
      //   'https://oss.hokkj.cn/edata_oa/djq/protocol/a6960da773a043b7b458775aa2bd6e24.pdf'
      this.$nextTick(() => {
        this.showpdf(this.row.fileUrl) // 接口返回的应该还有盖章信息，不只是pdf
      })
    },
    // 解析pdf
    showpdf(fileUrl) {
      pdfjsLib
        .getDocument({
          url: fileUrl,
          rangeChunkSize: 65536,
          disableAutoFetch: false
        })
        .promise.then(pdfDoc_ => {
          this.pdfDoc = pdfDoc_
          this.numPages = this.pdfDoc.numPages
          this.defaultNumPages = this.pdfDoc.numPages
          this.$nextTick(() => {
            this.canvas = document.querySelectorAll('.the-canvas')
            this.canvas.forEach(item => {
              this.ctx.push(item.getContext('2d'))
            })
            // 循环渲染pdf
            for (let i = 1; i <= this.numPages; i++) {
              this.renderPage(i).then(() => {
                this.renderPdf({
                  width: this.canvas[i - 1].width,
                  height: this.canvas[i - 1].height
                })
              })
            }
            setTimeout(() => {
              this.renderFabric()
              this.canvasEvents()
            }, 1000)
          })
        })
    },
    // 设置pdf宽高，缩放比例，渲染pdf
    renderPage(num) {
      // console.log('this.canvas', this.canvas[num], num);
      return this.pdfDoc.getPage(num).then(page => {
        // const viewport = page.getViewport({ scale: 1 })
        // const desiredWidth = 1080 // 指定渲染宽度
        // const scaleX = desiredWidth / viewport.width // 计算缩放比例
        // const desiredViewport = page.getViewport({ scale: scaleX })
        // this.scale = scaleX
        const desiredViewport = page.getViewport({ scale: this.scale })
        console.log(desiredViewport, 'desiredViewport+++')
        this.canvas[num - 1].height = desiredViewport.height
        this.canvas[num - 1].width = desiredViewport.width
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: this.ctx[num - 1],
          viewport: desiredViewport
        }
        page.render(renderContext)
      })
    },
    // 设置绘图区域宽高
    renderPdf(data) {
      this.whDatas = data
    },
    // 生成绘图区域
    renderFabric() {
      // 1. 拿到全部的canvas-layout
      const canvasLayoutDom = document.querySelectorAll('.canvas-layout')
      // 2. 循环遍历
      canvasLayoutDom.forEach(item => {
        this.canvasLayoutTopList.push({ obj: item, top: item.offsetTop })
        // 3. 设置宽高和居中
        item.style.width = this.whDatas.width + 'px'
        item.style.height = this.whDatas.height + 'px'
        item.style.margin = '0 auto 18px'
        item.style.boxShadow = '4px 4px 4px #e9e9e9'
      })
      // 现形
      this.isFirst = false
      this.isShowPdf = true
      this.outViewDom = document.querySelector('.out-view')
      // 开启监听窗口滚动
      this.outViewScroll()
    },
    // 开启监听窗口滚动
    outViewScroll() {
      this.outViewDom.addEventListener('scroll', this.outViewRun)
    },
    // 关闭监听窗口滚动
    outViewScrollClose() {
      this.outViewDom.removeEventListener('scroll', this.outViewRun)
    },
    // 窗口滚动
    outViewRun() {
      const scrollTop = this.outViewDom.scrollTop + 160
      const topList = this.canvasLayoutTopList.map(item => item.top)
      // 增加一个最大值
      topList.push(Number.MAX_SAFE_INTEGER)
      for (let index = 0; index < topList.length; index++) {
        const element = topList[index]
        if (element <= scrollTop && scrollTop < topList[index + 1]) {
          this.pageNum = index + 1
          break
        }
      }
    },
    // scale滑块,重新渲染整个pdf
    sliderChange() {
      this.pageNum = 1
      this.numPages = 0
      this.canvasLayoutTopList = []
      this.canvasEle = []
      this.ctx = []
      this.canvas = []
      this.isShowPdf = false
      // this.outViewScrollClose();
      this.whDatas = null
      this.coordinateList = [
        { name: '名称', page: '所在页面', left: 'x坐标', top: 'Y坐标' }
      ]
      this.getSignatureJson()
      setTimeout(() => {
        this.numPages = this.pdfDoc.numPages
        this.$nextTick(() => {
          this.canvas = document.querySelectorAll('.the-canvas')
          this.canvas.forEach(item => {
            this.ctx.push(item.getContext('2d'))
          })
          // 循环渲染pdf
          for (let i = 1; i <= this.numPages; i++) {
            this.renderPage(i).then(() => {
              this.renderPdf({
                width: this.canvas[i - 1].width,
                height: this.canvas[i - 1].height
              })
            })
          }
          setTimeout(() => {
            this.renderFabric()
            this.canvasEvents()
          }, 1000)
        })
      }, 1000)
    },
    /**
     * 签章相关部分
     */
    // 签章拖拽边界处理，不能将图片拖拽到绘图区域外
    canvasEvents() {
      this.canvasEle.forEach(item => {
        item.on('object:moving', e => {
          const obj = e.target
          // if object is too big ignore
          if (
            obj.currentHeight > obj.canvas.height ||
            obj.currentWidth > obj.canvas.width
          ) {
            return
          }
          obj.setCoords()
          // top-left  corner
          if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
            obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top)
            obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left)
          }
          // bot-right corner
          if (
            obj.getBoundingRect().top + obj.getBoundingRect().height >
              obj.canvas.height ||
            obj.getBoundingRect().left + obj.getBoundingRect().width >
              obj.canvas.width
          ) {
            obj.top = Math.min(
              obj.top,
              obj.canvas.height -
                obj.getBoundingRect().height +
                obj.top -
                obj.getBoundingRect().top
            )
            obj.left = Math.min(
              obj.left,
              obj.canvas.width -
                obj.getBoundingRect().width +
                obj.left -
                obj.getBoundingRect().left
            )
          }
          // console.log('obj.cacheKey',obj.cacheKey);
          // const findIndex = this.coordinateList
          //   .slice(1)
          //   .findIndex(coord => coord.cacheKey == obj.cacheKey)
          // const keys = [
          //   'width',
          //   'height',
          //   'top',
          //   'left',
          //   'angle',
          //   'scaleX',
          //   'scaleY'
          // ]
          // keys.forEach(item => {
          //   this.coordinateList[findIndex + 1][item] = Math.ceil(
          //     obj[item] / this.scale
          //   )
          // })
          // this.getSignatureJson()
        })
      })
    },
    // 拖拽结束
    end(e) {
      // 找到当前拖拽到哪一个canvas-layout上
      const currentCanvasLayout =
        e.originalEvent.target.parentElement.parentElement
      const findIndex = this.canvasLayoutTopList.findIndex(
        item => item.obj == currentCanvasLayout
      )
      if (findIndex == -1) return false
      // 取整
      const left =
        e.originalEvent.layerX < 0
          ? 0
          : Math.ceil(e.originalEvent.layerX / this.scale)
      const top =
        e.originalEvent.layerY < 0
          ? 0
          : Math.ceil(e.originalEvent.layerY / this.scale)
      // console.log('e', e, findIndex);
      this.addSeal({
        sealUrl: this.componentList[e.newDraggableIndex].img,
        left,
        top,
        index: e.newDraggableIndex,
        pageNum: findIndex
      })
    },
    // 添加公章
    addSeal({ sealUrl, left, top, index, pageNum }) {
      fabric.Image.fromURL(sealUrl, oImg => {
        oImg.set({
          // 距离左边的距离
          left: left,
          // 距离顶部的距离
          top: top,
          // 角度
          // angle: 10,
          // 缩放比例，需要乘以scale
          scaleX: 0.8 * this.scale,
          scaleY: 0.8 * this.scale,
          index,
          // 禁止缩放
          lockScalingX: true,
          lockScalingY: true,
          // 禁止旋转
          lockRotation: true
        })
        this.canvasEle[pageNum].add(oImg)
        // 保存签章信息
        this.saveSignature({ pageNum, index, sealUrl })
      })
      // this.removeActive();
    },
    // 保存签章
    saveSignature({ pageNum, index, sealUrl }) {
      // 1. 拿到当前签章的信息
      let length = 0
      let pageConfig = this.coordinateList.filter(
        item => item.page - 1 == pageNum
      )
      if (pageConfig) length = pageConfig.length
      const currentSignInfo = this.canvasEle[pageNum].getObjects()[length]
      // 2. 拼接数据
      const keys = [
        'width',
        'height',
        'top',
        'left',
        'angle',
        'scaleX',
        'scaleY'
      ]
      const obj = {}
      keys.forEach(item => {
        obj[item] = Math.ceil(currentSignInfo[item] / this.scale)
      })
      obj.cacheKey = currentSignInfo.cacheKey
      obj.sealUrl = sealUrl
      obj.index = index
      obj.name = `${this.componentList[index].name}${this.coordinateList.length}`
      obj.page = pageNum + 1
      this.coordinateList.push(obj)
      this.getSignatureJson()
    },
    // 签章生成json字符串
    getSignatureJson() {
      // 1. 判断是否有签章
      if (this.coordinateList.length <= 1) return (this.shadowInputValue = '')
      // 2. 拿到签章的信息，去除第一条
      const signatureList = this.coordinateList.slice(1)
      // 3. 拼接数据，只要left和top和page
      const keys = ['page', 'left', 'top']
      const arr = []
      signatureList.forEach(item => {
        const obj = {}
        keys.forEach(key => {
          obj[key] = item[key]
        })
        arr.push(obj)
      })
      // 4. 转成json字符串
      this.shadowInputValue = JSON.stringify(arr)
    },
    /**
     * 操作相关部分
     */
    // 上一页
    prevPage() {
      if (this.pageNum <= 1) return
      this.pageNum--
      // 滚动到指定位置
      this.outViewDom.scrollTop = this.canvasLayoutTopList[this.pageNum - 1].top
    },
    // 下一页
    nextPage() {
      if (this.pageNum >= this.numPages) return
      this.pageNum++
      // 滚动到指定位置
      this.outViewDom.scrollTop = this.canvasLayoutTopList[this.pageNum - 1].top
    },
    // 切换页码
    cutover() {
      this.outViewScrollClose()
      if (this.pageNum < 1) {
        this.pageNum = 1
      } else if (this.pageNum > this.numPages) {
        this.pageNum = this.numPages
      }
      // 滚动到指定位置
      this.outViewDom.scrollTop = this.canvasLayoutTopList[this.pageNum - 1].top
      setTimeout(() => {
        this.outViewScroll()
      }, 500)
    },
    // 删除所有的签章选中状态
    removeActive() {
      this.canvasEle.forEach(item => {
        item.discardActiveObject().renderAll()
      })
    },
    // 删除签章
    removeSignature() {
      // 1. 判断是否有选中的签章
      const findItem = this.canvasEle.filter(item => item.getActiveObject())
      // 2. 判断选中签章的个数
      if (findItem.length == 0) return this.$message.error('请选择要删除的签章')
      // 3. 判断选中签章的个数是否大于1
      if (findItem.length > 1) {
        this.removeActive()
        return this.$message.error('只能选择删除一个签章,请重新选择')
      }
      // 4. 拿到选中的签章的cacheKey
      const activeObj = findItem[0].getActiveObject()
      const findIndex = this.coordinateList.findIndex(
        item => item.cacheKey == activeObj.cacheKey
      )
      // 5. 删除选中的签章
      findItem[0].remove(activeObj)
      // 6. 删除选中的签章的信息
      this.coordinateList.splice(findIndex, 1)
      this.getSignatureJson()
    },
    // 清空签章
    clearSignature() {
      this.canvasEle.forEach(item => {
        item.clear()
      })
      this.coordinateList = [
        { name: '名称', page: '所在页面', left: 'x坐标', top: 'Y坐标' }
      ]
      this.getSignatureJson()
    },
    // 提交数据
    submitSignature() {
      console.log('this.coordinateList', this.coordinateList)
    },
    // handleImageClick(e) {
    //   //  const rect = e.target.getBoundingClientRect();
    //   const x = e.clientX  // x position within the element.
    //   const y = e.clientY;  // y position within the element.
    //   console.log(e,x,y,444444)
    //   this.showText = true;
    //   this.textPosition.x = x - 30;
    //   this.textPosition.y = y - 20;
    // },
    handleMouseDown(e) {
      const x = e.clientX // x position within the element.
      const y = e.clientY // y position within the element.
      this.xPos = x - 30
      this.yPos = y - 20
      this.showText = true
      this.dragStartX = x - this.xPos
      this.dragStartY = y - this.yPos
      this.dragging = true
      window.addEventListener('mousemove', this.handleMouseMove)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseMove(e) {
      if (this.dragging) {
        this.xPos = e.clientX - this.dragStartX
        this.yPos = e.clientY - this.dragStartY
      }
    },
    handleMouseUp(e) {
      console.log(e, '鼠标松开++++')
      this.dragging = false
      window.removeEventListener('mousemove', this.handleMouseMove)
      window.removeEventListener('mouseup', this.handleMouseUp)
      // 判断拖拽结束后，元素处于哪个子元素内
      this.determineDropZone()
    },
    handleTextMouseDown(e) {
      this.dragStartX = e.clientX - this.xPos
      this.dragStartY = e.clientY - this.yPos
      window.addEventListener('mousemove', this.handleMouseMove)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    determineDropZone() {
      const childDivs = this.$refs.theCanvas
      const draggedItemRect = this.$el
        .querySelector('.floating-text')
        .getBoundingClientRect()
      this.showText = false
      for (let i = 0; i < childDivs.length; i++) {
        const rect = childDivs[i].getBoundingClientRect()
        if (
          draggedItemRect.top >= rect.top &&
          draggedItemRect.bottom <= rect.bottom &&
          draggedItemRect.left >= rect.left &&
          draggedItemRect.right <= rect.right
        ) {
          const data = {
            i,
            x: draggedItemRect.x - rect.x,
            y: draggedItemRect.y - rect.y
          }
          console.log(
            rect,
            draggedItemRect,
            `拖拽到了子元素 ${i + 1}`,
            data.x,
            data.y
          )
          this.handleAddPdfDiv(data)
          break
        }
      }
    },
    //pdf添加div元素
    handleAddPdfDiv({ i, x, y }) {
      this.canvasDivList[i].push({
        name: '拖拽中',
        y,
        x
      })
    },
    // handleImgListClick() {
    //   const obj = {
    //     i: this.pageNum - 1,
    //     x: 0,
    //     y: 0
    //   }
    //   this.handleAddPdfDiv(obj)
    // },
    handleComponentListClick(item) {
      let component
      if (item.label === '单行文本') {
        component = deepCopy(componentList[0])
      } else if (item.label === '多行文本') {
        component = deepCopy(componentList[1])
      } else if (item.label === '身份证') {
        component = deepCopy(componentList[2])
      } else if (item.label === '数字') {
        component = deepCopy(componentList[3])
      } else if (item.label === '日期') {
        component = deepCopy(componentList[4])
      } else if (item.label === '邮箱') {
        component = deepCopy(componentList[5])
      } else if (item.label === '签名') {
        component = deepCopy(componentList[6])
      } else if (item.label === '公章') {
        component = deepCopy(componentList[7])
      }
      console.log(component, '88888888888')
      component.id = generateID()
      component.pageNum = this.pageNum
      // 获取大div元素的DOM引用
      const largeDiv = this.$el.querySelector(`#pdfEditor${component.pageNum}`)
      console.log(largeDiv, 66666)
      // 计算屏幕中心点
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      // 计算大div的位置信息
      const { top, left, width, height } = largeDiv.getBoundingClientRect()

      // 定位小div以使其在屏幕上居中
      // 这里减去小div一半的宽度和高度是为了将其中心点设置在屏幕中心
      // 计算需要将小div定位在大div内部的确切位置
      const positionX = centerX - left - component.style.width / 2
      const positionY = centerY - top - component.style.height / 2

      // 检查小div是否会超出大div的边界，如果是，则调整其位置
      const adjustedX = Math.min(
        Math.max(positionX, 0),
        width - component.style.width
      )
      const adjustedY = Math.min(
        Math.max(positionY, 0),
        height - component.style.height
      )
      // 设置位置并显示小div
      component.style.left = adjustedX
      component.style.top = adjustedY

      this.$store.commit('oaManage/addComponent', { component })
      // const clickIndex = this.componentData.findIndex(
      //   i => i.id === component.id
      // )
      this.$store.commit('oaManage/setCurComponent', {
        component,
        index: component.id
      })
      // this.$store.commit('oaManage/recordSnapshot')
    },
    getComponentStyle(style) {
      return getStyle(style, this.svgFilterAttrs)
    },
    //取消
    cancel() {
      this.$emit('cancel')
    },
    //提交
    sumbit() {
      console.log(this.componentData, '保存数据+++')
      // if (this.componentData.length === 0) return
      const params = this.componentData.map(item => {
        let color = getRgbString(item.style.color)
        console.log(color, 'color=++')
        return {
          align: alignType.get(item.style.textAlign),
          fontColorBlue: color[0],
          fontColorGreen: color[1],
          fontColorRed: color[2],
          fontId: item.fontId,
          fontSize: item.style.fontSize,
          isRequired: item.isRequired,
          maxLength: item.maxLength,
          pageNum: item.pageNum,
          dateUnit: item.dateUnit,
          paramName: item.propValue,
          paramType: item.type,
          positionLength: item.style.height,
          positionUlx: item.style.left,
          positionUly: item.style.top,
          positionWidth: item.style.width,
          signFileId: this.row.signFileId,
          signatureType: item.signatureType,
          textExample: item.textExample,
          textExampleContent: item.textExampleContent
        }
      })
      this.loadingBtn = true
      saveParamConfigInfoAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loadingBtn = false
        })
    },
    paramConfigInfo() {
      const params = {
        signFileId: this.row.signFileId
      }
      paramConfigInfoAjax(params).then(res => {
        if (res.code === 1) {
          console.log(res, '99999')
          const list = res.data.map(item => {
            return {
              component: 'VText',
              label: labelTextType.get(item.paramType),
              propValue: item.paramName,
              pageNum: item.pageNum,
              type: item.paramType,
              fontId: item.fontId,
              isRequired: item.isRequired,
              signatureType: item.signatureType,
              dateUnit: item.dateUnit,
              maxLength: item.maxLength,
              textExample: item.textExample,
              textExampleContent: item.textExampleContent,
              style: {
                rotate: 0,
                opacity: 1,
                width: item.positionWidth,
                height: item.positionLength,
                fontSize: item.fontSize,
                fontWeight: 400,
                lineHeight: '',
                letterSpacing: 0,
                textAlign: getMapKeyByValue(alignType, item.align || 0),
                color: `rgb(${item.fontColorBlue}, ${item.fontColorGreen}, ${item.fontColorRed})`,
                padding: 4,
                top: item.positionUly,
                left: item.positionUlx
              },
              id: item.id
            }
          })
          this.$store.commit('oaManage/setComponentData', list)
          this.$store.commit('oaManage/setCurComponent', {
            component: list[0],
            index: list[0].id
          })
          // 获取编辑器元素
          this.$store.commit(
            'oaManage/getEditor',
            `pdfEditor${list[0].pageNum}`
          )
        }
      })
    },
    handleContextMenu(e) {
      console.log(e, '333333')
      e.stopPropagation()
      e.preventDefault()
      // 计算菜单相对于编辑器的位移
      let target = e.target
      let top = e.clientY
      let left = e.clientX
      if (!target.className.includes('the-canvas')) {
        this.$store.commit('oaManage/showContextMenu', { top, left })
      } else {
        this.$store.commit('oaManage/hideContextMenu')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.contract-signature-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 2000;
  /*pdf部分*/
  .ele-canvas {
    overflow: hidden;
  }
  .title-operation {
    height: 58px;
    padding: 0px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      color: #000000;
      font-family: 'Microsoft YaHei UI';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
    }
    border-bottom: 1px solid #e4e4e4;
  }
  .section-box {
    position: relative;
    display: flex;
    height: calc(100% - 58px);
    .signature-img {
      width: 216px;
      min-width: 216px;
      background-color: #fff;
      height: 100%;
      border-right: 1px solid #e4e4e4;
      .info {
        height: 48px;
        line-height: 48px;
        color: #000000;
        font-family: 'Microsoft YaHei UI';
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        padding: 0 16px;
        border-bottom: 1px solid #e4e4e4;
      }
      .list-container {
        padding: 25px 24px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .list-items {
          width: 78px;
          height: 72px;
          border-radius: 6px;
          background: #f8f8f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 12px 0 10px 0;
          cursor: pointer;
          img {
            width: 28px;
            height: 28px;
          }
          span {
            color: #333333;
            font-family: 'Microsoft YaHei UI';
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
          }
        }
        .list-items:hover {
          background: #e4e4e4;
        }
      }
      // .item {
      //   padding: 10px;
      //   border: 1px dashed rgba(0, 0, 0, 0.3);
      //   &:not(:last-child) {
      //     margin-bottom: 10px;
      //   }
      //   .img {
      //     vertical-align: middle;
      //     width: 120px;
      //     background-repeat: no-repeat;
      //   }
      // }
    }
    .main-layout {
      flex: 1;
      background-color: #f7f8fa;
      position: relative;
      &.is-first {
        .operate-box {
          opacity: 0;
        }
      }
      .operate-box {
        opacity: 1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 40px;
        background-color: #fff;
        border-bottom: 1px solid #e4e4e4;
        display: flex;
        justify-content: center;
        align-items: center;
        .slider-box {
          width: 230px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-left: 1px solid #e4e4e4;
          border-right: 1px solid #e4e4e4;
          .slider {
            width: 120px;
          }
          .scale-value {
            margin-left: 24px;
            font-size: 16px;
            color: #000000;
            line-height: 22px;
          }
        }
        .page-change {
          display: flex;
          align-items: center;
          margin-left: 30px;
          .icon {
            cursor: pointer;
            padding: 0 5px;
            color: #c1c1c1;
          }
          .input-box {
            border: none;
            ::v-deep .el-input__inner {
              width: 34px;
              height: 20px;
              border: none;
              padding: 0;
              text-align: center;
              border-bottom: 1px solid #e4e4e4;
            }
          }
          .default-text {
            display: flex;
            line-height: 22px;
            margin-right: 5px;
          }
        }
      }
      .out-view {
        height: 100%;
        margin: 0px auto;
        overflow-x: auto;
        overflow-y: auto;
        // padding-top: 20px;
        text-align: center;
        opacity: 0;
        transition: all 0.5s;
        &.is-show {
          opacity: 1;
        }
        .canvas-layout {
          position: relative;
          text-align: center;
          margin: 0 auto 18px;
        }
      }
      .loading {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;
        ::v-deep .el-loading-mask {
          background-color: transparent;
        }
      }
    }
    .position-info {
      width: 260px;
      min-width: 260px;
      border-left: 1px solid #e4e4e4;
      background-color: #fff;
      .title {
        height: 48px;
        line-height: 48px;
        color: #000000;
        font-family: 'Microsoft YaHei UI';
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        padding: 0 16px;
        border-bottom: 1px solid #e4e4e4;
      }
      .nav {
        display: flex;
        flex-direction: column;
        .item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          &:first-child {
            background-color: #f7f8fa;
          }
          span {
            flex: 1;
            text-align: center;
            font-size: 12px;
            color: #000000;
            line-height: 20px;
          }
        }
      }
    }
  }

  .floating-text {
    position: fixed;
    // pointer-events: none; /* 使鼠标事件"穿透"该元素，便于操作其它元素 */
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.7);
    border: 1px solid #ccc;
    padding: 5px;
    cursor: move;
  }
  .the-canvas-div {
    background-color: rgba(255, 255, 255, 0.7);
    border: 1px solid #ccc;
    padding: 5px;
    position: absolute;
    cursor: move;
  }
}
</style>

import {
  signAuditAjax,
  contractListAjax
} from '@/views/oaMannagement/api/staff.js'
import {
  elecFollowConditionListAjax,
  electronicSealInfoAjax
} from '@/views/oaMannagement/api/badge.js'
import { fileFollowConditionListAjax } from '@/views/oaMannagement/api/signFile.js'
import { contractfollowConditionListAjax } from '@/views/oaMannagement/api/staff.js'

import Vue from 'vue'
import { swap } from '@/views/oaMannagement/signFileManagement/components/utils/utils.js'
import store from '@/store'
import generateID from '@/views/oaMannagement/signFileManagement/components/utils/generateID'
import eventBus from '@/views/oaMannagement/signFileManagement/components/utils/eventBus'
// import decomposeComponent from '@/views/oaMannagement/signFileManagement/components/utils/decomposeComponent'
import {
  $,
  deepCopy
} from '@/views/oaMannagement/signFileManagement/components/utils/utils'
// import { commonStyle, commonAttr } from '@/custom-component/component-list'
import { createGroupStyle } from '@/views/oaMannagement/signFileManagement/components/utils/style'
import changeComponentsSizeWithScale from '@/views/oaMannagement/signFileManagement/components/utils/changeComponentsSizeWithScale'
let defaultcomponentData = []
function getDefaultcomponentData() {
  return JSON.parse(JSON.stringify(defaultcomponentData))
}
export function setDefaultcomponentData(data = []) {
  defaultcomponentData = data
}
const state = {
  lastScale: 100, // 记录快照上次的缩放比例，用于判断是否需要更新快照
  editMode: 'edit', // 编辑器模式 edit preview
  canvasStyleData: {
    // 页面全局数据
    width: 1200,
    height: 740,
    scale: 100,
    color: '#000',
    opacity: 1,
    background: '#fff',
    fontSize: 14
  },
  isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
  componentData: [], // 画布组件数据
  curComponent: null,
  curComponentIndex: null,
  // 点击画布时是否点中组件，主要用于取消选中组件用。
  // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
  isClickComponent: false,
  rightList: true,
  isDarkMode: false,
  areaData: {
    // 选中区域包含的组件以及区域位移信息
    style: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    components: []
  },
  editor: null,
  menuTop: 0, // 右击菜单数据
  menuLeft: 0,
  menuShow: false,
  snapshotData: [], // 编辑器快照数据
  snapshotIndex: -1 // 快照索引
}
const mutations = {
  addAnimation({ curComponent }, animation) {
    curComponent.animations.push(animation)
  },

  removeAnimation({ curComponent }, index) {
    curComponent.animations.splice(index, 1)
  },

  alterAnimation({ curComponent }, { index, data = {} }) {
    if (typeof index === 'number') {
      const original = curComponent.animations[index]
      curComponent.animations[index] = { ...original, ...data }
    }
  },
  getEditor(state, data) {
    state.editor = $(`#${data}`)
  },

  setAreaData(state, data) {
    state.areaData = data
  },

  compose({ componentData, areaData, editor }) {
    const components = []
    areaData.components.forEach(component => {
      if (component.component != 'Group') {
        components.push(component)
      } else {
        // 如果要组合的组件中，已经存在组合数据，则需要提前拆分
        const parentStyle = { ...component.style }
        const subComponents = component.propValue
        const editorRect = editor.getBoundingClientRect()

        subComponents.forEach(component => {
          decomposeComponent(component, editorRect, parentStyle)
        })

        components.push(...component.propValue)
      }
    })

    const groupComponent = {
      id: generateID(),
      component: 'Group',
      label: '组合',
      icon: 'zuhe',
      ...commonAttr,
      style: {
        ...commonStyle,
        ...areaData.style
      },
      propValue: components
    }

    createGroupStyle(groupComponent)

    store.commit('oaManage/addComponent', {
      component: groupComponent
    })

    eventBus.$emit('hideArea')

    store.commit('oaManage/batchDeleteComponent', areaData.components)
    store.commit('oaManage/setCurComponent', {
      component: componentData[componentData.length - 1],
      index: componentData.length - 1
    })

    areaData.components = []
  },

  // 将已经放到 Group 组件数据删除，也就是在 componentData 中删除，因为它们已经从 componentData 挪到 Group 组件中了
  batchDeleteComponent({ componentData }, deleteData) {
    deleteData.forEach(component => {
      for (let i = 0, len = componentData.length; i < len; i++) {
        if (component.id == componentData[i].id) {
          componentData.splice(i, 1)
          break
        }
      }
    })
  },

  decompose({ curComponent, editor }) {
    const parentStyle = { ...curComponent.style }
    const components = curComponent.propValue
    const editorRect = editor.getBoundingClientRect()

    store.commit('oaManage/deleteComponent')
    components.forEach(component => {
      decomposeComponent(component, editorRect, parentStyle)
      store.commit('oaManage/addComponent', { component })
    })
  },

  showContextMenu(state, { top, left }) {
    state.menuShow = true
    state.menuTop = top
    state.menuLeft = left
  },

  hideContextMenu(state) {
    state.menuShow = false
  },
  addEvent({ curComponent }, { event, param }) {
    curComponent.events[event] = param
  },

  removeEvent({ curComponent }, event) {
    Vue.delete(curComponent.events, event)
  },
  upComponent(state) {
    const { componentData, curComponentIndex } = state
    // 上移图层 index，表示元素在数组中越往后
    if (curComponentIndex < componentData.length - 1) {
      swap(componentData, curComponentIndex, curComponentIndex + 1)
      state.curComponentIndex = curComponentIndex + 1
    } else {
      alert('已经到顶了')
    }
  },

  downComponent(state) {
    const { componentData, curComponentIndex } = state
    // 下移图层 index，表示元素在数组中越往前
    if (curComponentIndex > 0) {
      swap(componentData, curComponentIndex, curComponentIndex - 1)
      state.curComponentIndex = curComponentIndex - 1
    } else {
      alert('已经到底了')
    }
  },

  topComponent(state) {
    const { componentData, curComponentIndex, curComponent } = state
    // 置顶
    if (curComponentIndex < componentData.length - 1) {
      componentData.splice(curComponentIndex, 1)
      componentData.push(curComponent)
      state.curComponentIndex = componentData.length - 1
    } else {
      alert('已经到顶了')
    }
  },

  bottomComponent(state) {
    const { componentData, curComponentIndex, curComponent } = state
    // 置底
    if (curComponentIndex > 0) {
      componentData.splice(curComponentIndex, 1)
      componentData.unshift(curComponent)
      state.curComponentIndex = 0
    } else {
      alert('已经到底了')
    }
  },
  lock({ curComponent }) {
    curComponent.isLock = true
  },

  unlock({ curComponent }) {
    curComponent.isLock = false
  },
  undo(state) {
    if (state.snapshotIndex >= 0) {
      state.snapshotIndex--
      let componentData =
        deepCopy(state.snapshotData[state.snapshotIndex]) ||
        getDefaultcomponentData()
      if (state.curComponent) {
        // 如果当前组件不在 componentData 中，则置空
        const needClean = !componentData.find(
          component => state.curComponent.id === component.id
        )

        if (needClean) {
          store.commit('oaManage/setCurComponent', {
            component: null,
            index: null
          })
        }
      }
      componentData = changeComponentsSizeWithScale(
        state.lastScale,
        componentData
      )
      store.commit('oaManage/setComponentData', componentData)
    }
  },

  redo(state) {
    if (state.snapshotIndex < state.snapshotData.length - 1) {
      state.snapshotIndex++
      let componentData = changeComponentsSizeWithScale(
        state.lastScale,
        deepCopy(state.snapshotData[state.snapshotIndex])
      )
      store.commit('oaManage/setComponentData', componentData)
    }
  },

  recordSnapshot(state) {
    // 添加新的快照
    let copyData = deepCopy(state.componentData)
    copyData.forEach(v => (v.lastScale = state.lastScale))
    state.snapshotData[++state.snapshotIndex] = copyData
    // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
    if (state.snapshotIndex < state.snapshotData.length - 1) {
      state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
    }
  },
  aceSetCanvasData(state, value) {
    state.canvasStyleData = value
  },
  setLastScale(state, value) {
    state.lastScale = value
  },
  // 通过json设置组件
  aceSetcurComponent(state, value) {
    for (let i = 0; i < state.componentData.length; i++) {
      if (state.componentData[i].id === value.id) {
        state.componentData.splice(i, 1)
      }
    }
    state.componentData.push(value)
    state.curComponent = value
  },

  setClickComponentStatus(state, status) {
    state.isClickComponent = status
  },

  isShowRightList(state) {
    state.rightList = !state.rightList
  },

  toggleDarkMode(state, sateus) {
    state.isDarkMode = sateus
    state.canvasStyleData.background = sateus ? '#817f7f' : '#fff'
    localStorage.setItem('isDarkMode', JSON.stringify(state.isDarkMode))
  },

  setEditMode(state, mode) {
    state.editMode = mode
  },

  setInEditorStatus(state, status) {
    state.isInEdiotr = status
  },

  setCanvasStyle(state, style) {
    state.canvasStyleData = style
  },

  setCurComponent(state, { component, index }) {
    console.log(component, index, '+++++++')
    state.curComponent = component
    state.curComponentIndex = index
  },

  setShapeStyle(
    { curComponent },
    { top, left, width, height, rotate, padding }
  ) {
    if (top !== undefined) curComponent.style.top = Math.round(top)
    if (left !== undefined) curComponent.style.left = Math.round(left)
    if (width) curComponent.style.width = Math.round(width)
    if (padding) curComponent.style.padding = Math.round(padding)
    if (height) curComponent.style.height = Math.round(height)
    if (rotate) curComponent.style.rotate = Math.round(rotate)
  },

  setShapeSingleStyle({ curComponent }, { key, value }) {
    curComponent.style[key] = value
  },

  setComponentData(state, componentData = []) {
    Vue.set(state, 'componentData', componentData)
    console.log(state.componentData, '444444')
  },

  addComponent(state, { component, index }) {
    // if (index !== undefined) {
    //   state.componentData.splice(index, 0, component)
    // } else {
    state.componentData.push(component)
    console.log(state.componentData, 444)
    // }
  },

  deleteComponent(state, index) {
    if (index === undefined) {
      index = state.curComponentIndex
    }
    if (index == state.curComponentIndex) {
      console.log('删除++++++++', state.curComponentIndex)
      // 找到需要删除项的索引
      store.commit('oaManage/setCurComponent', {
        component: {
          style: {}
        },
        index: -1
      })
      const removeindex = state.componentData.findIndex(
        item => item.id === index
      )
      state.componentData.splice(removeindex, 1)
    }

    // if (/\d/.test(index)) {
    //   state.componentData.splice(index, 1)
    // }
  },
  clearCanvas() {
    store.commit('oaManage/setCurComponent', { component: null, index: null })
    store.commit('oaManage/setComponentData', [])
  }
}
const actions = {
  //合同审核
  getSignAudit({ commit }, data) {
    const params = {
      personnelBaseInfoId: data
    }
    return signAuditAjax(params).then(res => {
      if (res.code === 1) {
        return res.data
      }
    })
  },
  //查询签署合同列表
  getContractList({ commit }, data = {}) {
    const params = {
      ...data
    }
    return contractListAjax(params).then(res => {
      if (res.code === 1) {
        return res.data
      }
    })
  },
  //印章列表
  getElecFollowConditionList({ commit }, data = {}) {
    const params = {
      ...data
    }
    return elecFollowConditionListAjax(params).then(res => {
      if (res.code === 1) {
        return res.data
      }
    })
  },
  //印章详情
  getElectronicSealInfo({ commit }, data = {}) {
    const params = {
      ...data
    }
    return electronicSealInfoAjax(params).then(res => {
      if (res.code === 1) {
        return res.data
      }
    })
  },
  //合同列表
  getfileFollowConditionList({ commit }, data = {}) {
    const params = {
      ...data
    }
    return fileFollowConditionListAjax(params).then(res => {
      if (res.code === 1) {
        return res.data
      }
    })
  },
  //多人查询合同列表
  contractfollowConditionList({ commit }, data = {}) {
    const params = {
      ...data
    }
    return contractfollowConditionListAjax(params).then(res => {
      if (res.code === 1) {
        return res.data
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

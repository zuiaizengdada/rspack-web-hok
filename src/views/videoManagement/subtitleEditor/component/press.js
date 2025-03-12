let flag = false // 是否开启拖拽
let oldLeft = 0 // 鼠标按下时的位置
let oldTop = 0
let box // 操作区
let moveSelected // 选区
const press = {
  bind: function (el, binding, vNode) {
    // console.log(el, binding, vNode)
    // el就是dom
    box = el
    moveSelected = document.createElement('li')
    moveSelected.style.cssText = 'position: fixed;top: 0;left: 0;border: 1px dashed #2783F5;pointer-events: none;display: none;'
    box.append(moveSelected)
    if (typeof binding.value !== 'function') {
      // eslint-disable-next-line no-throw-literal
      throw 'callback must be a function'
    }
    // 鼠标按下时开启拖拽，给选区设置定位
    box.onmousedown = function(e) {
      moveSelected.style.width = 0
      moveSelected.style.height = 0
      moveSelected.style.top = 0
      moveSelected.style.left = 0
      moveSelected.style.bottom = 0
      moveSelected.style.right = 0

      flag = true
      moveSelected.style.top = e.pageY + 'px'
      moveSelected.style.left = e.pageX + 'px'
      oldLeft = e.pageX
      oldTop = e.pageY
      moveSelected.style.display = 'block'
    }
    // 鼠标移动时计算选区的位置和大小
    box.onmousemove = function(e) {
      if (!flag) return
      if (e.pageX < oldLeft) { // 表示左移
        moveSelected.style.left = e.pageX + 'px'
        moveSelected.style.width = (oldLeft - e.pageX) + 'px' // 向左移动的距离作为选区的宽
      } else {
        moveSelected.style.width = (e.pageX - oldLeft) + 'px'
      }
      if (e.pageY < oldTop) { // 向上移动
        moveSelected.style.top = e.pageY + 'px'
        moveSelected.style.height = (oldTop - e.pageY) + 'px'
      } else {
        moveSelected.style.height = (e.pageY - oldTop) + 'px'
      }
      // 通过得到的left和top加上元素自身的宽高来计算选区的right和bottom
      moveSelected.style.bottom = Number(moveSelected.style.top.split('px')[0]) + Number(moveSelected.style
        .height.split('px')[0]) + 'px'
      moveSelected.style.right = Number(moveSelected.style.left.split('px')[0]) + Number(moveSelected.style
        .width.split('px')[0]) + 'px'
      // binding.value(moveSelected, box)
      // 找出选中的区域并激活
      // for (let i = 0; i < checkboxs.length; i++) {
      //   // 计算每个checkbox的位置信息
      //   const left = checkboxs[i].offsetLeft + box.offsetLeft
      //   const right = checkboxs[i].offsetWidth + left
      //   const top = checkboxs[i].offsetTop + box.offsetTop
      //   const bottom = checkboxs[i].offsetHeight + top
      //   // 判断是否在选择区
      //   const leftCover = moveSelected.style.left.split('px')[0] <= left && left <= moveSelected.style
      //     .right.split('px')[0]
      //   const rightCover = moveSelected.style.left.split('px')[0] <= right && right <= moveSelected.style
      //     .right.split('px')[0]
      //   const topCover = moveSelected.style.top.split('px')[0] <= top && top <= moveSelected.style.bottom
      //     .split('px')[0]
      //   const bottomCover = moveSelected.style.top.split('px')[0] <= bottom && bottom <= moveSelected.style
      //     .bottom.split('px')[0]
      //   if ((leftCover || rightCover) && (topCover || bottomCover)) {
      //     checkboxs[i].checked = true // 激活复选框
      //   } else {
      //     checkboxs[i].checked = false
      //   }
      // }
    }
    // 鼠标抬起时重置选区
    box.onmouseup = function(e) {
      // if (!flag) return
      // flag = false
      // moveSelected.style.width = 0
      // moveSelected.style.height = 0
      // moveSelected.style.top = 0
      // moveSelected.style.left = 0
      // moveSelected.style.bottom = 0
      // moveSelected.style.right = 0
      // moveSelected.style.display = 'none'
      if (!flag) return
      flag = false
      binding.value(moveSelected, box)
      moveSelected.style.display = 'none'
    }
    // 鼠标超出操作区重置选区
    box.onmouseleave = function(e) {
      flag = false
      // moveSelected.style.width = 0
      // moveSelected.style.height = 0
      // moveSelected.style.top = 0
      // moveSelected.style.left = 0
      // moveSelected.style.bottom = 0
      // moveSelected.style.right = 0
    }
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler)
  }
}

export default press

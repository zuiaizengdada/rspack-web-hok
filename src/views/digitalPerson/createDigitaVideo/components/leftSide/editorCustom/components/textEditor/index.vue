<template>
  <div id="editor-wrapper-id" class="editor-wrapper">
    <slot name="header" />
    <div
      id="editor-text"
      contenteditable="true"
      class="editor"
      @click="globalClick"
      @blur="blur"
      @paste="paste"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @input="inputText"
     
    />
    <slot name="count" />
    <slot name="suspension" />
    <!-- <div v-if="count < 1" class="editor-placeholder">请输入内容</div> -->
  </div>
</template>

<script>
function isHuoShan(v){
   return v === 5 || v === 2 
}

function is3BeforeAndHuoShan(v){
  return v < 3 || v === 5
}

const ntype = {
                  1: { 电话: 'phone', 数值: 'figure', 序列: 'spell' },
                  2: { 电话: 'telephone', 数值: 'number', 序列: 'digits' },
                  5: { 电话: 'telephone', 数值: 'cardinal', 序列: 'digit' },
              }

export default {
  name: 'TextEditor',
  data() {
    const configType = {
      1: obj => {
        const id = new Date().getTime()
        const icon = `<span id="${id}_tag" data-value="${obj.value}" tags="pause-icon" contenteditable="false" class="pause-icon">${obj.name}</span>`
        return {
          tag: 'pause-tag',
          id,
          value: obj.value,
          html: icon
        }
      },
      2: obj => {
        const id = new Date().getTime()
        const icon = `<span id="${id}_tag" data-value="${obj.value}" tags="mute-icon" contenteditable="false" class="pause-icon">静音${obj.name}秒</span>`
        return {
          tag: 'mute-tag',
          id,
          value: obj.value,
          html: icon
        }
      },
      3: obj => {
        const id = new Date().getTime()
        const label = `<span id="${id}_label" tags="chinese-label" contenteditable="false" class="chinese-label">${obj.text}</span>`
        const icon = `<span id="${id}_tag" tags="chinese-icon" contenteditable="false" class="chinese-icon">${obj.name}</span>`
        return {
          tag: 'chinese-tag',
          id,
          value: obj.value,
          info: obj,
          html: label + icon
        }
      },
      4: obj => {
        const id = new Date().getTime()
        const label = `<span id="${id}_label" data-value="${obj.value}" tags="number-label" contenteditable="false" class="number-label">${obj.text}</span>`
        const icon = `<span id="${id}_icon" data-value="${obj.value}" tags="number-icon" contenteditable="false" class="number-icon">${obj.name}</span>`
        return {
          tag: 'number-tag',
          id,
          value: obj.value,
          info: obj,
          html: label + icon
        }
      },
      5: obj => {
        const id = new Date().getTime()
        const label = `<span id="${id}_label" data-value="${
          obj.value
        }" tags="ys-label" class="ys-label">${this.tagsHtmlList
          .join('')
          .trim()}</span>`
        const icon = `<span id="${id}_icon" tags="ys-icon" data-value="${
          obj.value
        }" contenteditable="false" class="ys-icon">语速${(
          obj.value * 100
        ).toFixed(0)}</span>`
        return {
          tag: 'ys-tag',
          id,
          value: obj.value,
          info: obj,
          html: label + icon
        }
      },
      6: obj => {
        const id = new Date().getTime()
        const label = `<span id="${id}_label" data-value="${
          obj.value
        }" tags="yd-label" class="yd-label">${this.tagsHtmlList
          .join('')
          .trim()}</span>`
        const icon = `<span id="${id}_icon" data-value="${
          obj.value
        }" tags="yd-icon" contenteditable="false" class="yd-icon">语调${(
          obj.value * 100
        ).toFixed(0)}</span>`
        return {
          tag: 'yd-tag',
          id,
          value: obj.value,
          info: obj,
          html: label + icon
        }
      },
      7: obj => {
        const id = new Date().getTime()
        const label = `<span id="${id}_label" data-value="${
          obj.value
        }" tags="yl-label" class="yl-label">${this.tagsHtmlList
          .join('')
          .trim()}</span>`
        const icon = `<span id="${id}_icon" data-value="${
          obj.value
        }" tags="yl-icon" contenteditable="false" class="yl-icon">音量${(
          obj.value * 100
        ).toFixed(0)}</span>`
        return {
          tag: 'yl-tag',
          id,
          info: obj,
          html: label + icon
        }
      }
    }
    return {
      configType,
      isFocus: false,
      tagsList: [],
      // 用于局部语速，语调，音量
      tagsHtmlList: [],
      thirdType: 2,
      count: 0,
      ownSelection: undefined,
      historyTexts: [],
      // 撤销回撤数据集合
      delHistoryTexts: []
    }
  },
  watch: {
    count(val) {
      this.$nextTick(() => {
        this.$emit('countChange', val)
      })
    }
  },
  created() {
    this.init()
  },
  destroyed() {
    document.removeEventListener('click', this.globalClick)
  },
  methods: {
    inputText(){
        
    },
    reductionannotationsStyle() {
      const el = document.getElementById('editor-text').innerHTML
      const regex = /<mark>/g
      const regex1 = /<\/mark>/g
      document.getElementById('editor-text').innerHTML = el
        .replace(regex, '')
        .replace(regex1, '')
    },
    annotationsClick(text) {
      this.reductionannotationsStyle()
      this.$nextTick(() => {
        const el = document.getElementById('editor-text').innerHTML
        const regex = new RegExp(text, 'g')
        const regex1 = new RegExp(text.replace(/\n/g, '<br>'), 'g')
        const reg = el.includes(text) ? regex : regex1

        document.getElementById('editor-text').innerHTML = el.replace(
          reg,
          '<mark>$&</mark>'
        )
      })
    },
    init() {
      this.$nextTick(() => {
        document.addEventListener('click', this.globalClick)
        const vm = document.getElementById('editor-text')
        // 监听键盘事件
        vm.addEventListener('keydown', this.keydownCustom)

        // 禁用右键菜单
        vm.oncontextmenu = function (e) {
          e.preventDefault()
        }
        // this.undoText.push(document.getElementById('editor-text').outerHTML)
        // 订阅DOM变化
        const observer = new MutationObserver(mutations => {
          // this.undoText.push(document.getElementById('editor-text').outerHTML)
          mutations.forEach(mutation => {
            // console.log(
            //   mutation,
            //   'mutation====================================defaultValueHtml'
            // )
            // console.log(
            //   document.getElementById('editor-text').innerHTML,
            //   'document.getElementById(editor-text).innerHTML'
            // )
            if (
              (mutation.addedNodes.length > 0 || mutation.oldValue) &&
              mutation.removedNodes.length < 1
            ) {
              const lastHistoryText =
                this.historyTexts[this.historyTexts.length - 1]
              const inh = document.getElementById('editor-text').innerHTML
              if (lastHistoryText !== inh) {
                this.historyTexts.push(inh)
              }
              console.log(this.historyTexts, 'this.historyTexts', mutations)
            }
            const tt = this.getText().replace(/\n/g, '') || ''
            this.count = tt.length || 0

            if (
              mutation.addedNodes.length === 1 &&
              mutation.addedNodes[0].outerHTML === '<br>'
            ) {
              this.$nextTick(() => {
                const range = window.getSelection().getRangeAt(0)
                range.deleteContents()
                range.insertNode(document.createTextNode(''))
              })
            }
            // mutation.previousSibling是icon左边的label removedNodes是删除的icon元素
            if (
              mutation.type === 'childList' &&
              mutation.removedNodes.length > 0 &&
              mutation.previousSibling?.id &&
              mutation.previousSibling?.id &&
              mutation.previousSibling?.id.indexOf('_parent') > -1
            ) {
              const vnode = []
              const childs = mutation.previousSibling.childNodes

              // vnode.push(...childs[0].nodeType === 1 ? childs[0].childNodes : childs[0].data)
              childs[0].childNodes.forEach(item => {
                if (item.nodeType === 1 && item.innerHTML !== '&nbsp;') {
                  vnode.push(item.outerHTML)
                } else if (item.nodeType === 3) {
                  vnode.push(item.data)
                } else {
                  const tmp = document.createElement('span')
                  tmp.innerHTML = '&nbsp;'
                  tmp.setAttribute('contenteditable', false)
                  vnode.push(tmp.innerHTML)
                }
              })
              // childs.forEach((item, i) => {
              //   if (i > 0) {
              //     if (item.nodeType === 3) {
              //       vnode.push(item.data)
              //     }
              //   }
              // })
              const parser = new DOMParser()
              const nodes = parser.parseFromString(vnode.join(''), 'text/html')
                .body.childNodes
              document.getElementById(mutation.previousSibling.id) &&
                document
                  .getElementById(mutation.previousSibling.id)
                  .replaceWith(...nodes)
            }
            if (
              mutation.type === 'childList' &&
              mutation.removedNodes.length > 0 &&
              mutation.previousSibling?.id &&
              mutation.previousSibling?.id &&
              mutation.previousSibling?.id.indexOf('_label') > -1
            ) {
              const vnode = []
              const childs = mutation.previousSibling.childNodes
              childs.forEach(item => {
                if (item.nodeType === 1 && item.innerHTML !== '&nbsp;') {
                  vnode.push(item.outerHTML)
                } else if (item.nodeType === 3) {
                  vnode.push(item.data)
                }
              })
              // childs.forEach((item, i) => {
              //   if (i > 0) {
              //     if (item.nodeType === 3) {
              //       vnode.push(item.data)
              //     }
              //   }
              // })
              const parser = new DOMParser()
              const nodes = parser.parseFromString(vnode.join(''), 'text/html')
                .body.childNodes

              const selection2 = window.getSelection()
              const range = document.createRange()
              range.setStart(
                document.getElementById(mutation.previousSibling.parentNode.id),
                0
              )
              range.setEnd(
                document.getElementById(mutation.previousSibling.parentNode.id),
                0
              )
              selection2.addRange(range)
              selection2.modify('move', 'forward', 'character')

              document
                .getElementById(mutation.previousSibling.parentNode.id)
                .replaceWith(...nodes)
            }
            // 在标签label上删除内容
            if (
              mutation.type === 'childList' &&
              mutation.removedNodes.length > 0 &&
              mutation.removedNodes[0].id?.indexOf('_label') > -1 &&
              mutation.nextSibling?.id &&
              mutation.nextSibling?.id.indexOf('_icon') > -1
            ) {
              if (
                mutation.nextSibling?.parentNode.parentNode?.parentNode
                  ?.parentNode?.parentNode?.id
              ) {
                document
                  .getElementById(
                    mutation.nextSibling?.parentNode.parentNode.parentNode
                      .parentNode.parentNode.id
                  )
                  .remove()
              } else if (
                mutation.nextSibling?.parentNode.parentNode?.parentNode?.id
              ) {
                document
                  .getElementById(
                    mutation.nextSibling?.parentNode.parentNode.parentNode.id
                  )
                  .remove()
              } else {
                document
                  .getElementById(mutation.nextSibling?.parentNode.id)
                  .remove()
              }
            }
          })
        })

        // 开始监听
        observer.observe(document.getElementById('editor-text'), {
          attributes: true,
          childList: true,
          subtree: true,
          characterData: true,
          characterDataOldValue: true
        })
      })
    },
    // 是否选择文本预览
    isSelectTextAudioPreview() {
      const count = this.getText().length
      if (count < 1) {
        this.$message.warning('请输入内容')
        return ''
      }
      let audioSSML = []
      if (this.ownSelection && !!this.ownSelection.toString()) {
        // const count = this.ownSelection.toString().length
        // if (count > 200) {
        //   this.$message.warning('预览最多支持200字')
        //   return ''
        // }
        audioSSML = this.convertSSMLAudio(
          this.ownSelection.getRangeAt(0).cloneContents()
        )
      } else {
        audioSSML = this.convertSSMLAudio()
      }
      console.log(audioSSML, 'audioSSML')
      return audioSSML
    },
    prviewAudio(type, value) {
      let audioSSML = []
      if (this.ownSelection && !!this.ownSelection.toString()) {
        audioSSML = this.convertSSMLAudio(
          this.ownSelection.getRangeAt(0).cloneContents()
        )
        audioSSML = audioSSML.map(m => {
          let textStart = '<speak>'
          const textEnd = '</prosody></speak>'
          if (type === 5) {
            textStart += `<prosody speed="${value}">`
          }
          if (type === 6) {
            textStart += `<prosody pitch="${value}">`
          }
          if (type === 7) {
            textStart += `<prosody volume="${value}">`
          }
          m = m.replace('<speak>', textStart).replace('</speak>', textEnd)
          return m
        })
      }
      console.log(audioSSML, 'audioSSML')
      return audioSSML
    },
    setValue(val) {
      document.getElementById('editor-text').innerHTML = val
    },
    // 兼容旧数据（组件更换）
    mapOldGenerateContent(val) {
      if (!val || val.length < 1) return
      let htmlText = val
      const parser = new DOMParser()
      const parserHtml = parser.parseFromString(htmlText, 'text/html').body
        .firstChild

      parserHtml.childNodes.forEach(item => {
        if (
          item.attributes &&
          item.attributes['data-w-e-type']?.value === 'tags'
        ) {
          const type = Number(item.attributes['data-type'].value)
          const id = new Date().getTime()
          const info = JSON.parse(
            decodeURIComponent(item.attributes['data-info'].value)
          )
          if (type === 1) {
            htmlText = htmlText.replace(
              item.outerHTML,
              `<span id="${id}_parent" data-value="${
                info.value
              }" data-info=${JSON.stringify(
                info
              )} tags="pause-tag"> <span id="${id}_tag" data-value="${
                info.value
              }" tags="pause-icon" contenteditable="false" class="pause-icon">${
                info.label
              }</span></span>`
            )
          }
          if (type === 2) {
            htmlText = htmlText.replace(
              item.outerHTML,
              `<span id="${id}_parent" data-value="${
                info.value
              }" data-info=${JSON.stringify(
                info
              )} tags="mute-tag"> <span id="${id}_tag" data-value="${
                info.value
              }" tags="mute-icon" contenteditable="false" class="pause-icon">${
                info.label
              }</span></span>`
            )
          }
          if (type === 3) {
            htmlText = htmlText.replace(
              item.outerHTML,
              `<span id="${id}_parent" data-value="${
                item.attributes['data-value']?.value
              }" data-info=${JSON.stringify(
                info
              )} tags="chinese-tag"> <span id="${id}_label" data-value="${
                info.label
              }" tags="chinese-label" contenteditable="false" class="chinese-label">${
                info.text
              }</span><span id="${id}_tag" data-value="${
                info.label
              }" tags="chinese-icon" contenteditable="false" class="chinese-icon">${
                info.label
              }</span></span></span>`
            )
          }
          if (type === 4) {
            htmlText = htmlText.replace(
              item.outerHTML,
              `<span id="${id}_parent" data-value="${
                item.attributes['data-value']?.value
              }" data-info=${JSON.stringify(
                info
              )} tags="number-tag"> <span id="${id}_label" data-value="${
                info.label
              }" tags="number-label" contenteditable="false" class="number-label">${
                info.text
              }</span><span id="${id}_tag" data-value="${
                info.label
              }" tags="number-icon" contenteditable="false" class="number-icon">${
                info.label
              }</span></span></span>`
            )
          }
        }
      })
      document.getElementById('editor-text').innerHTML = htmlText
        .replace('<p>', '')
        .replace('</p>', '')
    },
    // 转化SSML 数字人保存需要
    convertSSML(val = undefined) {
      this.$emit('removeAnnotationsClick')
      // this.reductionannotationsStyle()
      const el = val || document.getElementById('editor-text')
      let text = '<speak>'
      const children = el.childNodes
      if (children.length > 0) {
        children.forEach(item => {
          if (item.nodeType === 1) {
            const type = item.attributes?.tags?.value
            if (type === 'pause-tag') {
              const v = item.attributes['data-value'].value
              const time =
                v === 'weak'
                  ? '0.1'
                  : v === 'medium'
                    ? '0.5'
                    : v === 'strong'
                      ? '1'
                      : v
              if (this.thirdType === 1) {
                text += `<break strength="${v}"></break>`
              } else if (this.thirdType === 2) {
                text += `<break time="${time}s"></break>`
              } else if (this.thirdType === 3) {
                text += `<delay value="${time}" />`
              } else if (this.thirdType === 4) {
                text += `<break>${time}</break>`
              }
            }
            if (type === 'mute-tag') {
              if (this.thirdType < 4) {
                text += `<break time="${
                  item.attributes['data-value'].value * 1000
                }ms"></break>`
              } else {
                text += `<break>${item.attributes['data-value'].value}</break>`
              }
            }
            if (type === 'chinese-tag') {
              const info = JSON.parse(item.attributes['data-info'].value)
              if (this.thirdType === 1) {
                text += `<phoneme ph="${info.value}">${info.text}</phoneme>`
              } else if (isHuoShan(this.thirdType)) {
                text += `<phoneme alphabet="py" ph="${info.value}">${info.text}</phoneme>`
              } else if (this.thirdType === 3) {
                text += `<grammar type="pinyin" value="${info.value}">${info.text}</grammar>`
              } else if (this.thirdType === 4) {
                text += `<phoneme ph='${info.value}'>${info.text}</phoneme>`
              }
            }
            if (type === 'number-tag') {
              const info = JSON.parse(item.attributes['data-info'].value)
              if (is3BeforeAndHuoShan(this.thirdType)) {
                
                text += `<say-as interpret-as="${
                  ntype[this.thirdType][info.name || info.label]
                }">${info.text}</say-as>`
              } else if (this.thirdType === 3) {
                text += `<grammar type="custom" value="${info.customText}">${info.value}</grammar>`
              } else if (this.thirdType === 4) {
                text += `<replace alias='${info.customText}'>${info.value}</replace>`
              }
            }
            if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
              const obj = this.nestData({ type, item })
              text += `<prosody `
              obj.atts.forEach(info => {
                text += `${info.key}="${info.info.value}" `
              })
              text += `>${obj.text}</prosody>`
            }
            if (!type) {
              text += this.nestUnknownTags(item)
            }
          } else if (item.nodeType === 3) {
            text += item.data
          }
        })
      } else {
        text += el.data || el.innerText
      }
      text += '</speak>'
      console.log(text.trim(), 'convertSSMLtext')
      return text.trim()
    },

    // 转化SSML 返回数组 数字人音频预览
    convertSSMLAudio(val = undefined) {
      this.$emit('removeAnnotationsClick')
      if (!val) {
        this.reductionannotationsStyle()
      }
      const el = val || document.getElementById('editor-text')
      const texts = []
      const children = el.childNodes
      if (children.length > 0) {
        children.forEach(item => {
          if (item.nodeType === 1) {
            const type = item.attributes?.tags?.value
            if (type === 'pause-tag') {
              let tmpText = ''
              const v = item.attributes['data-value'].value
              const time =
                v === 'weak'
                  ? '0.1'
                  : v === 'medium'
                    ? '0.5'
                    : v === 'strong'
                      ? '1'
                      : v
              if (this.thirdType === 1) {
                tmpText += `<break strength="${v}"></break>`
              } else if (this.thirdType === 2) {
                tmpText += `<break time="${time}s"></break>`
              } else if (this.thirdType === 3) {
                tmpText += `<delay value="${time}" />`
              } else if (this.thirdType === 4) {
                tmpText += `<break>${time}</break>`
              }
              if (
                texts.length > 0 &&
                texts[texts.length - 1].length + tmpText.length <= 150
              ) {
                texts[texts.length - 1] += tmpText
              } else {
                texts.push(tmpText)
              }
            }
            if (type === 'mute-tag') {
              let tmpText = `<break time="${
                item.attributes['data-value'].value * 1000
              }ms"></break>`
              if (this.thirdType === 4) {
                tmpText = `<break>${item.attributes['data-value'].value}</break>`
              }

              if (
                texts.length > 0 &&
                texts[texts.length - 1].length + tmpText.length <= 150
              ) {
                texts[texts.length - 1] += tmpText
              } else {
                texts.push(tmpText)
              }
            }
            if (type === 'chinese-tag') {
              let tmpText = ''
              const info = JSON.parse(item.attributes['data-info'].value)
              if (this.thirdType === 1) {
                tmpText += `<phoneme ph="${info.value}">${info.text}</phoneme>`
              } else if (isHuoShan(this.thirdType)) {
                tmpText += `<phoneme alphabet="py" ph="${info.value}">${info.text}</phoneme>`
              } else if (this.thirdType === 3) {
                tmpText += `<grammar type="pinyin" value="${info.value}">${info.text}</grammar>`
              } else if (this.thirdType === 4) {
                tmpText += `<phoneme ph='${info.value}'>${info.text}</phoneme>`
              }
              if (
                texts.length > 0 &&
                texts[texts.length - 1].length + tmpText.length <= 150
              ) {
                texts[texts.length - 1] += tmpText
              } else {
                texts.push(tmpText)
              }
            }
            if (type === 'number-tag') {
              let tmpText = ''
              const info = JSON.parse(item.attributes['data-info'].value)
              if (is3BeforeAndHuoShan(this.thirdType)) {
                tmpText += `<say-as interpret-as="${
                  ntype[this.thirdType][info.name || info.label]
                }">${info.text}</say-as>`
              } else if (this.thirdType === 3) {
                tmpText += `<grammar type="custom" value="${info.customText}">${info.value}</grammar>`
              } else if (this.thirdType === 4) {
                tmpText += `<replace alias='${info.customText}'>${info.value}</replace>`
              }

              if (
                texts.length > 0 &&
                texts[texts.length - 1].length + tmpText.length <= 150
              ) {
                texts[texts.length - 1] += tmpText
              } else {
                texts.push(tmpText)
              }
            }
            if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
              const obj = this.nestAudioData({ type, item })
              const tmpText = []
              let att = ''
              obj.atts.forEach(info => {
                att += `${info.key}="${info.info.value}" `
              })
              if (obj.text.length + att.length > 150) {
                let tt = ''
                obj.text.split('').forEach((objItem, i) => {
                  tt += objItem
                  if (
                    tt.length === 150 ||
                    (tt.length < 150 && i === obj.text.length - 1)
                  ) {
                    tmpText.push('<prosody ' + att + `>${tt}</prosody>`)
                    tt = ''
                  }
                })
              } else {
                tmpText.push('<prosody ' + att + `>${obj.text}</prosody>`)
              }
              tmpText.forEach(objItem => {
                if (
                  texts.length > 0 &&
                  texts[texts.length - 1].length + objItem.length <= 150
                ) {
                  texts[texts.length - 1] += objItem
                } else {
                  texts.push(objItem)
                }
              })
            }
            // 敏感词
            if (type === 'sensitive') {
              texts.push(item.innerText)
            }
            if (!type) {
              texts.push(...this.nestUnknownTagsAudio(item))
            }
          } else if (item.nodeType === 3) {
            if (item.data.length > 150) {
              let tt = ''
              item.data.split('').forEach((objItem, i) => {
                tt += objItem
                if (
                  tt.length === 150 ||
                  (tt.length < 150 && i === item.data.length - 1)
                ) {
                  texts.push(tt)
                  tt = ''
                }
              })
            } else {
              texts.push(item.data)
            }
          }
        })
      } else {
        texts.push(el.data || el.innerText)
      }
      console.log(texts, 'textstextstextstexts')
      let res = []
      texts.forEach(item => {
        const lastInfo = res[res.length - 1]
        if (lastInfo && lastInfo.length < 150) {
          const newJoinInfo = lastInfo + item
          if (newJoinInfo.length <= 150) {
            res[res.length - 1] = lastInfo + item
          } else {
            res.push(item)
          }
        } else {
          res.push(item)
        }
      })
      console.log(res, 'resconvertSSMLAudio')
      // 内容必须有中文，数字或者英文其中一个
      res = res
        .filter(item => {
          const reg = /[\u4e00-\u9fa5]/g
          const reg2 = /[a-zA-Z]/g
          const reg3 = /[0-9]/g
          return reg.test(item) || reg2.test(item) || reg3.test(item)
        })
        .map(item => {
          return `<speak>${item}</speak>`
        })

      return res
    },
    // 处理未知标签
    nestUnknownTags(item) {
      let text = ''
      if (item.childNodes.length > 0) {
        item.childNodes.forEach(item => {
          if (item.nodeType === 1) {
            const type = item.attributes?.tags?.value
            if (type === 'pause-tag') {
              const v = item.attributes['data-value'].value
              const time =
                v === 'weak'
                  ? '0.1'
                  : v === 'medium'
                    ? '0.5'
                    : v === 'strong'
                      ? '1'
                      : v
              if (this.thirdType === 1) {
                text += `<break strength="${v}"></break>`
              } else if (this.thirdType === 2) {
                text += `<break time="${time}s"></break>`
              } else if (this.thirdType === 3) {
                text += `<delay value="${time}" />`
              } else if (this.thirdType === 4) {
                text += `<break>${time}</break>`
              }
            }
            if (type === 'mute-tag') {
              if (this.thirdType < 4) {
                text += `<break time="${
                  item.attributes['data-value'].value * 1000
                }ms"></break>`
              } else {
                text += `<break>${item.attributes['data-value'].value}</break>`
              }
            }
            if (type === 'chinese-tag') {
              const info = JSON.parse(item.attributes['data-info'].value)
              if (this.thirdType === 1) {
                text += `<phoneme ph="${info.value}">${info.text}</phoneme>`
              } else if (isHuoShan(this.thirdType)) {
                text += `<phoneme alphabet="py" ph="${info.value}">${info.text}</phoneme>`
              } else if (this.thirdType === 3) {
                text += `<grammar type="pinyin" value="${info.value}">${info.text}</grammar>`
              } else if (this.thirdType === 4) {
                text += `<phoneme ph='${info.value}'>${info.text}</phoneme>`
              }
            }
            if (type === 'number-tag') {
              const info = JSON.parse(item.attributes['data-info'].value)
              if (is3BeforeAndHuoShan(this.thirdType)) {
                text += `<say-as interpret-as="${
                  ntype[this.thirdType][info.name || info.label]
                }">${info.text}</say-as>`
              } else if (this.thirdType === 3) {
                text += `<grammar type="custom" value="${info.customText}">${info.value}</grammar>`
              } else if (this.thirdType === 4) {
                text += `<replace alias='${info.customText}'>${info.value}</replace>`
              }
            }
            if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
              const obj = this.nestData({ type, item })
              text += `<prosody `
              obj.atts.forEach(info => {
                text += `${info.key}="${info.info.value}" `
              })
              text += `>${obj.text}</prosody>`
            }
            // 敏感词
            if (type === 'sensitive') {
              text += item.innerText
            }
            if (!type) {
              text += this.nestUnknownTags(item)
            }
          } else if (item.nodeType === 3) {
            text += item.data
          }
        })
      } else {
        text = item.innerText
      }
      return text
    },
    // 处理未知标签-音频
    nestUnknownTagsAudio(item) {
      const texts = []
      if (item.childNodes.length > 0) {
        item.childNodes.forEach(item => {
          if (item.nodeType === 1) {
            const type = item.attributes?.tags?.value
            if (type === 'pause-tag') {
              let tmpText = ''
              const v = item.attributes['data-value'].value
              const time =
                v === 'weak'
                  ? '0.1'
                  : v === 'medium'
                    ? '0.5'
                    : v === 'strong'
                      ? '1'
                      : v
              if (this.thirdType === 1) {
                tmpText += `<break strength="${v}"></break>`
              } else if (this.thirdType === 2) {
                tmpText += `<break time="${time}s"></break>`
              } else if (this.thirdType === 3) {
                tmpText += `<delay value="${time}" />`
              } else if (this.thirdType === 4) {
                tmpText += `<break>${time}</break>`
              }
              if (
                texts.length > 0 &&
                texts[texts.length - 1].length + tmpText.length <= 150
              ) {
                texts[texts.length - 1] += tmpText
              } else {
                texts.push(tmpText)
              }
            }
            if (type === 'mute-tag') {
              let tmpText = `<break time="${
                item.attributes['data-value'].value * 1000
              }ms"></break>`
              if (this.thirdType === 4) {
                tmpText = `<break>${item.attributes['data-value'].value}</break>`
              }
              if (
                texts.length > 0 &&
                texts[texts.length - 1].length + tmpText.length <= 150
              ) {
                texts[texts.length - 1] += tmpText
              } else {
                texts.push(tmpText)
              }
            }
            if (type === 'chinese-tag') {
              let tmpText = ''
              const info = JSON.parse(item.attributes['data-info'].value)
              if (this.thirdType === 1) {
                tmpText += `<phoneme ph="${info.value}">${info.text}</phoneme>`
              } else if (isHuoShan(this.thirdType)) {
                tmpText += `<phoneme alphabet="py" ph="${info.value}">${info.text}</phoneme>`
              } else if (this.thirdType === 3) {
                tmpText += `<grammar type="pinyin" value="${info.value}">${info.text}</grammar>`
              } else if (this.thirdType === 4) {
                tmpText += `<phoneme ph='${info.value}'>${info.text}</phoneme>`
              }
              if (
                texts.length > 0 &&
                texts[texts.length - 1].length + tmpText.length <= 150
              ) {
                texts[texts.length - 1] += tmpText
              } else {
                texts.push(tmpText)
              }
            }
            if (type === 'number-tag') {
              let tmpText = ''
              const info = JSON.parse(item.attributes['data-info'].value)
              if (is3BeforeAndHuoShan(this.thirdType)) {
                tmpText += `<say-as interpret-as="${
                  ntype[this.thirdType][info.name || info.label]
                }">${info.text}</say-as>`
              } else if (this.thirdType === 3) {
                tmpText += `<grammar type="custom" value="${info.customText}">${info.value}</grammar>`
              } else if (this.thirdType === 4) {
                tmpText += `<replace alias='${info.customText}'>${info.value}</replace>`
              }
              if (
                texts.length > 0 &&
                texts[texts.length - 1].length + tmpText.length <= 150
              ) {
                texts[texts.length - 1] += tmpText
              } else {
                texts.push(tmpText)
              }
            }
            if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
              const obj = this.nestAudioData({ type, item })
              const tmpText = []
              let att = ''
              obj.atts.forEach(info => {
                att += `${info.key}="${info.info.value}" `
              })
              '<prosody ' + `>${obj.text}</prosody>`
              if (obj.text.length + att.length > 150) {
                let tt = ''
                obj.text.split('').forEach((objItem, i) => {
                  tt += objItem
                  if (
                    tt.length === 150 ||
                    (tt.length < 150 && i === obj.text.length - 1)
                  ) {
                    tmpText.push('<prosody ' + att + `>${tt}</prosody>`)
                  }
                })
              } else {
                tmpText.push('<prosody ' + att + `>${obj.text}</prosody>`)
              }
              tmpText.forEach(objItem => {
                if (
                  texts.length > 0 &&
                  texts[texts.length - 1].length + objItem.length <= 150
                ) {
                  texts[texts.length - 1] += objItem
                } else {
                  texts.push(objItem)
                }
              })
            }
            // 敏感词
            if (type === 'sensitive') {
              texts.push(item.innerText)
            }
            if (!type) {
              texts.push(...this.nestUnknownTagsAudio(item))
            }
          } else if (item.nodeType === 3) {
            if (item.data.length > 150) {
              let tt = ''
              item.data.split('').forEach((objItem, i) => {
                tt += objItem
                if (
                  tt.length === 150 ||
                  (tt.length < 150 && i === item.data.length - 1)
                ) {
                  texts.push(tt)
                  tt = ''
                }
              })
            } else {
              texts.push(item.data)
            }
          }
        })
      } else {
        texts.push(item.innerText)
      }
      return texts
    },
    // 处理音频嵌套标签
    nestAudioData({ type, item }) {
      let text = ''
      const atts = []
      if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
        const info = JSON.parse(item.attributes['data-info'].value)
        const label = item.childNodes[0]
        const key = {
          5: 'speed',
          6: 'pitch',
          7: 'volume'
        }[Number(info.type)]
        atts.push({ key, info })
        label.childNodes.forEach(child => {
          if (child.nodeType === 1) {
            const childType = child.attributes?.tags?.value
            if (childType === 'pause-tag') {
              const v = child.attributes['data-value'].value
              const time =
                v === 'weak'
                  ? '0.1'
                  : v === 'medium'
                    ? '0.5'
                    : v === 'strong'
                      ? '1'
                      : v
              if (this.thirdType === 1) {
                text += `<break strength="${v}"></break>`
              } else if (this.thirdType === 2) {
                text += `<break time="${time}s"></break>`
              } else if (this.thirdType === 3) {
                text += `<delay value="${time}" />`
              } else if (this.thirdType === 4) {
                text += `<break>${time}</break>`
              }
            }
            if (childType === 'mute-tag') {
              if (this.thirdType < 6) {
                text += `<break time="${
                  child.attributes['data-value'].value * 1000
                }ms"></break>`
              } else {
                text += `<break>${child.attributes['data-value'].value}</break>`
              }
            }
            if (childType === 'chinese-tag') {
              const info = JSON.parse(child.attributes['data-info'].value)
              if (this.thirdType === 1) {
                text += `<phoneme ph="${info.value}">${info.text}</phoneme>`
              } else if (isHuoShan(this.thirdType)) {
                text += `<phoneme alphabet="py" ph="${info.value}">${info.text}</phoneme>`
              } else if (this.thirdType === 3) {
                text += `<grammar type="pinyin" value="${info.value}">${info.text}</grammar>`
              } else if (this.thirdType === 4) {
                text += `<phoneme ph='${info.value}'>${info.text}</phoneme>`
              }
            }
            if (childType === 'number-tag') {
              const info = JSON.parse(child.attributes['data-info'].value)
              if (is3BeforeAndHuoShan(this.thirdType)) {
                text += `<say-as interpret-as="${
                  ntype[this.thirdType][info.name || info.label]
                }">${info.text}</say-as>`
              } else if (this.thirdType === 3) {
                text += `<grammar type="custom" value="${info.customText}">${info.value}</grammar>`
              } else if (this.thirdType === 4) {
                text += `<replace alias='${info.customText}'>${info.value}</replace>`
              }
            }
            if (
              childType === 'ys-tag' ||
              childType === 'yd-tag' ||
              childType === 'yl-tag'
            ) {
              const childObj = this.nestAudioData({
                type: childType,
                item: child,
                text
              })
              text += childObj.text
              atts.push(...childObj.atts)
            }
          } else {
            text += child.data
          }
        })
      }
      return { text, atts }
    },
    // 处理嵌套标签
    nestData({ type, item }) {
      let text = ''
      const atts = []
      if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
        const info = JSON.parse(item.attributes['data-info'].value)
        const label = item.childNodes[0]
        const key = {
          5: 'speed',
          6: 'pitch',
          7: 'volume'
        }[Number(info.type)]
        atts.push({ key, info })
        label.childNodes.forEach(child => {
          if (child.nodeType === 1) {
            const childType = child.attributes?.tags?.value
            if (childType === 'pause-tag') {
              const v = child.attributes['data-value'].value
              const time =
                v === 'weak'
                  ? '0.1'
                  : v === 'medium'
                    ? '0.5'
                    : v === 'strong'
                      ? '1'
                      : v
              if (this.thirdType === 1) {
                text += `<break strength="${v}"></break>`
              } else if (this.thirdType === 2) {
                text += `<break time="${time}s"></break>`
              } else if (this.thirdType === 3) {
                text += `<delay value="${time}" />`
              } else if (this.thirdType === 4) {
                text += `<break>${time}</break>`
              }
            }
            if (childType === 'mute-tag') {
              if (this.thirdType < 4) {
                text += `<break time="${
                  child.attributes['data-value'].value * 1000
                }ms"></break>`
              } else {
                text += `<break>${child.attributes['data-value'].value}</break>`
              }
            }
            if (childType === 'chinese-tag') {
              const info = JSON.parse(child.attributes['data-info'].value)
              if (this.thirdType === 1) {
                text += `<phoneme ph="${info.value}">${info.text}</phoneme>`
              } else if (isHuoShan(this.thirdType)) {
                text += `<phoneme alphabet="py" ph="${info.value}">${info.text}</phoneme>`
              } else if (this.thirdType === 3) {
                text += `<grammar type="pinyin" value="${info.value}">${info.text}</grammar>`
              } else if (this.thirdType === 4) {
                text += `<phoneme ph='${info.value}'>${info.text}</phoneme>`
              }
            }
            if (childType === 'number-tag') {
              const info = JSON.parse(child.attributes['data-info'].value)
              if (is3BeforeAndHuoShan(this.thirdType)) {
                text += `<say-as interpret-as="${
                  ntype[this.thirdType][info.name || info.label]
                }">${info.text}</say-as>`
              } else if (this.thirdType === 3) {
                text += `<grammar type="custom" value="${info.customText}">${info.value}</grammar>`
              } else if (this.thirdType === 4) {
                text += `<replace alias='${info.customText}'>${info.value}</replace>`
              }
            }
            if (
              childType === 'ys-tag' ||
              childType === 'yd-tag' ||
              childType === 'yl-tag'
            ) {
              const childObj = this.nestData({
                type: childType,
                item: child,
                text
              })
              text += childObj.text
              atts.push(...childObj.atts)
            }
          } else {
            text += child.data
          }
        })
      }
      return { text, atts }
    },
    // 敏感词重置样式
    reductionSensitiveStyle() {
      const el = document.querySelectorAll('[tags="sensitive"]')
      el.forEach(item => {
        item.outerHTML = item.innerText
      })
    },
    // 敏感词标红
    setSensitiveStyle(val) {
      const el = document.getElementById('editor-text').innerHTML
      document.getElementById('editor-text').innerHTML = el.replaceAll(
        val,
        `<span tags="sensitive" style="color:red">${val}</span>`
      )
      // const dom = document.getElementById('editor-text')
      // const children = dom?.childNodes || []
      // if (children.length > 0) {
      //   children.forEach(item => {
      //     if (item.nodeType === 1) {
      //       const type = item.attributes?.tags?.value

      //       if (!type && item.id !== 'nbsp_empty') {
      //         this.mapUnknownStyleRedText(item, val)
      //       }
      //     } else if (item.nodeType === 3) {
      //       const span = document.createElement('span')
      //       span.innerHTML = item.textContent.replaceAll(
      //         val,
      //         `<span tags="sensitive" style="color:red">${val}</span>`
      //       )
      //       item.parentNode.replaceChild(span, item)
      //     }
      //   })
      // } else {
      //   dom.innerHTML = dom.innerHTML.replaceAll(
      //     val,
      //     `<span tags="sensitive" style="color:red">${val}</span>`
      //   )
      // }
    },
    mapUnknownStyleRedText(el, val) {
      const children = el.childNodes || []
      if (children.length > 0) {
        children.forEach((item, index) => {
          if (item.nodeType === 1) {
            const type = item.attributes?.tags?.value
            if (!type && item.id !== 'nbsp_empty') {
              this.mapUnknownStyleRedText(item, val)
            }
          } else if (item.nodeType === 3) {
            const span = document.createElement('span')
            span.innerHTML = item.textContent.replaceAll(
              val,
              `<span tags="sensitive" style="color:red">${val}</span>`
            )
            item.parentNode.replaceChild(span, item)
          }
        })
      } else {
        if (!(el.outerHTML === '<br>')) {
          el.innerHTML = el.innerHTML.replaceAll(
            val,
            `<span tags="sensitive" style="color:red">${val}</span>`
          )
        }
      }
    },
    resetDom() {
      document.getElementById('editor-text').innerHTML = ''
    },
    getHtml() {
      // this.reductionannotationsStyle()
      return document.getElementById('editor-text').innerHTML
    },
    // 获取纯文本
    getText(domParams = undefined) {
      const dom = domParams || document.getElementById('editor-text')
      let text = ''
      const children = dom?.childNodes || []
      console.log(children, 'children')
      if (children.length > 0) {
        children.forEach(item => {
          if (item.nodeType === 1) {
            const type = item.attributes?.tags?.value
            if (type === 'number-tag' || type === 'chinese-tag') {
              text +=
                item.childNodes.length && item.childNodes.length > 1
                  ? item.childNodes[0].innerText
                  : ''
            }
            if (type === 'sensitive' || type === 'annotations') {
              text += item.innerText
            }
            if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
              text += this.mapTags(item)
            }
            if (!type && item.id !== 'nbsp_empty') {
              text += this.mapUnknownText(item)
             
            }if(item.id === 'nbsp_empty'){
              text += item.innerText
            }
          } else if (item.nodeType === 3) {
            text += item.data
          }
        })
      } else {
        text = dom.innerText
      }
      console.log(text.trim(), '获取纯文本text')
      // 去掉头部换行符\n .replace('\n', '')
      if (text.startsWith('\n')) {
        text = text.replace('\n', '')
      }
      return text
    },
    mapUnknownText(el) {
      let text = ''
      const children = el.childNodes || []
      if (children.length > 0) {
        children.forEach((item, index) => {
          if (item.nodeType === 1) {
            const type = item.attributes?.tags?.value
            if (type === 'number-tag' || type === 'chinese-tag') {
              text +=
                item.childNodes.length && item.childNodes.length > 1
                  ? item.childNodes[0].innerText
                  : ''
            }
            if (type === 'sensitive' || type === 'annotations') {
              text += item.innerText
            }
            if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
              text += this.mapTags(item)
            }
            if (!type && item.id !== 'nbsp_empty') {
              text += this.mapUnknownText(item)
            }if(item.id === 'nbsp_empty'){
              text += item.innerText
            }
          } else if (item.nodeType === 3) {
            const regex = /(\r|\n|\s|<br>)$/

            text += (index === 0 && !regex.test(text) ? '\n' : '') + item.data
          }
        })
      } else {
        if (el.outerHTML === '<br>') {
          text += '\n'
        } else {
          text += el.innerText || ''
        }
      }
      return text
    },
    mapTags(item) {
      let text = ''
      const label = item.childNodes[0]
      if (!label?.childNodes) return ''
      label.childNodes?.forEach(child => {
        if (child.nodeType === 1) {
          const type = child.attributes?.tags?.value
          if (type === 'number-tag' || type === 'chinese-icon') {
            text +=
              child.childNodes.length && child.childNodes.length > 1
                ? child.childNodes[0].innerText
                : ''
          }
          if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
            text += this.mapTags(child)
          }
        } else {
          text += child.data
        }
      })
      return text
    },
    insertTag(val) {
      const selection = this.ownSelection
      if (
        !selection ||
        !document
          .getElementById('editor-text')
          .contains(selection.getRangeAt(0).commonAncestorContainer)
      ) {
        return
      }
      const obj = this.configType[Number(val.type)](val)
      const range = selection.getRangeAt(0)
      range.deleteContents()
      const el = document.createElement('span')
      el.setAttribute('tags', obj.tag)
      el.setAttribute('id', obj.id + '_parent')
      el.setAttribute('data-value', obj.value)
      el.setAttribute('data-info', JSON.stringify(obj.info))
      el.innerHTML = obj.html.trim()
      range.insertNode(el)
      selection.removeAllRanges()
      this.$nextTick(() => {
        if (obj.tag === 'pause-tag' || obj.tag === 'mute-tag') {
          return
        }
        // 创建聚焦空白元素
        const emptySpan = document.createElement('span')
        emptySpan.innerHTML = '&nbsp;'
        // const nextParent = document.getElementById(obj.id + '_parent')
        //   .nextSibling.parentNode
        emptySpan.setAttribute('contenteditable', true)
        emptySpan.id = 'nbsp_empty'
        document.getElementById(obj.id + '_parent').after(emptySpan)
        this.$nextTick(() => {
          // 新增元素末尾聚焦
          const selection2 = window.getSelection()
          const range = document.createRange()
          range.setStart(emptySpan, 0)
          range.setEnd(emptySpan, 0)
          selection2.addRange(range)
          selection2.modify('move', 'forward', 'character')
        })
        // }
      })
    },
    mousedown() {
      console.log('mousedown', '鼠标按下')
      document
        .getElementById('editor-text')
        .addEventListener('mousemove', this.mousemove)
    },
    mouseup() {
      // document
      //   .getElementById('editor-text')
      //   .removeEventListener('mousemove', this.mousemove)
      // console.log('mouseleave', '鼠标s开')
    },
    mousemove() {
      const selection = window.getSelection()
      const textSelection = selection.toString()
      this.tagsList = []
      this.tagsHtmlList = []
      if (!textSelection) return
      const range = selection.getRangeAt(0)
      const ancestor = range.cloneContents()
      // eslint-disable-next-line no-unused-vars
      let isPlainText = true
      // eslint-disable-next-line no-unused-vars
      let isTags = false
      if (
        !document
          .getElementById('editor-text')
          .contains(range.commonAncestorContainer)
      ) {
        return
      }
      const txt = textSelection
      // 筛选选中的元素
      const tmpList = []

      // 单行选择判断
      if (
        ancestor.childNodes.length === 1 &&
        (ancestor.childNodes[0].nodeType === 3 ||
          ancestor.childNodes[0].nodeType === 11)
      ) {
        const tag = range.startContainer.parentNode?.attributes
          ? range.startContainer.parentNode?.attributes['tags']?.value
          : ''
        if (tag) {
          isPlainText = false
          isTags = true
          this.tagsList.push(tag)
          // 判断局部语速，语调，音量是否嵌套
          if (tag === 'ys-label' || tag === 'yd-label' || tag === 'yl-label') {
            const nestTag = item => {
              const tagNew = item.attributes
                ? item.attributes['tags']?.value
                : ''
              if (
                tagNew === 'ys-label' ||
                tagNew === 'yd-label' ||
                tagNew === 'yl-label'
              ) {
                this.tagsList.push(tagNew)
                const parentCC = item.parentNode.parentNode
                if (
                  parentCC &&
                  parentCC.attributes &&
                  parentCC.attributes['tags']?.value
                ) {
                  nestTag(parentCC)
                }
              }
            }
            const parentC =
              range.startContainer.parentNode.parentNode.parentNode
            if (
              parentC &&
              parentC.attributes &&
              parentC.attributes['tags']?.value
            ) {
              nestTag(parentC)
            }
          }
        }
        tmpList.push(range.startContainer)
      } else {
        if (!ancestor.attributes || !ancestor.attributes?.tags) {
          ancestor.childNodes.forEach((r, i) => {
            tmpList.push(r)
          })
          // this.tagsHtmlList.push(...ancestor.childNodes)
        } else {
          isPlainText = false
          isTags = true
          tmpList.push(ancestor)
        }

        // 选中元素的集合
        if (tmpList.length < 1) return

        // 选中元素的展平
        const expandSelectHtmlList = []
        const mapChildNode = res => {
          res.forEach(item => {
            const childs = item.childNodes ? item.childNodes : []
            if (childs.length < 1) {
              expandSelectHtmlList.push(item)
            } else {
              mapChildNode(childs)
            }
          })
        }
        mapChildNode(tmpList)
        // 判断选中的元素是否包含标签
        expandSelectHtmlList.forEach(item => {
          const tags = item.parentNode?.attributes
            ? item.parentNode.attributes['tags']?.value
            : ''
          if (tags && tags !== 'sensitive') {
            isPlainText = false
            isTags = true
            this.tagsList.push(tags)
          }
        })
      }
      // 局部特殊显示集合（存入类型） 适用于语速，语调，音量相互嵌套
      const partShow = []
      // 如果不包含标签， 直接使用选中的文本值
      if (isPlainText) {
        this.tagsHtmlList.push(txt)
      } else {
        if (
          this.tagsList.length < 3 &&
          this.tagsList.filter(
            f => f === 'ys-label' || f === 'yd-label' || f === 'yl-label'
          ).length > 0
        ) {
          this.tagsHtmlList.push(txt)
          if (txt === tmpList[0].innerText || txt === tmpList[0].textContent) {
            if (!this.tagsList.find(f => f === 'ys-label')) {
              partShow.push(5)
            }
            if (!this.tagsList.find(f => f === 'yd-label')) {
              partShow.push(6)
            }
            if (!this.tagsList.find(f => f === 'yl-label')) {
              partShow.push(7)
            }
          }
        }
      }
      const params = {
        length: textSelection.replace(/\n/g, '').length,
        text: txt,
        isTags,
        isPlainText,
        isAllText:
          !this.tagsList.filter(
            f =>
              f.includes('chinese-label') ||
              f.includes('chinese-icon') ||
              f.includes('number-icon') ||
              f.includes('number-label')
          ).length > 0,
        partShow,
        isNestedSub:
          !this.tagsList.filter(
            f =>
              f.includes('tags') ||
              f.includes('tag') ||
              f.includes('-label') ||
              f.includes('-icon')
          ).length > 0,
        isFocus: true
      }
      this.$emit('mousemoveChange', params)
      // console.log(params, 'this.tagsList.push(tags)this.tagsList.push(tags)')
    },
    // 键盘事件
    keydownCustom(e) {
      // 回车
      if (e.keyCode === 13 && this.isFocus) {
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        const ancestor = range.commonAncestorContainer
        if (!document.getElementById('editor-text').contains(ancestor)) return

        const tags = ancestor.parentNode.getAttribute('tags')
        if (tags) {
          e.preventDefault()
        }
      }
      if (e.ctrlKey && e.keyCode === 65) {
        setTimeout(() => {
          this.mousemove()
        })
      }

      // Ctrl+Z | command+z
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.keyCode === 90) {
        e.preventDefault()
        this.revoke()
      }

      // Alt + 1|2|3
      if (e.altKey && e.keyCode >= 49 && e.keyCode <= 51) {
        e.preventDefault()
        const tgs = {
          49: {
            customText: undefined,
            name: '短',
            text: '',
            type: '1',
            value: 'weak'
          },
          50: {
            customText: undefined,
            name: '中',
            text: '',
            type: '1',
            value: 'medium'
          },
          51: {
            customText: undefined,
            name: '长',
            text: '',
            type: '1',
            value: 'strong'
          }
        }
        this.insertTag(tgs[e.keyCode])
      }

      // Ctrl+Shift+Z | command+Shift+z
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 90) {
        e.preventDefault()
        this.retracement()
      }
    },
    // 撤销
    revoke() {
      if (this.historyTexts.length === 1) return
      this.delHistoryTexts.push(this.historyTexts[this.historyTexts.length - 1])
      this.historyTexts.pop()
      const last = this.historyTexts[this.historyTexts.length - 1]
      console.log(this.delHistoryTexts, 'this.delHistoryTexts')
      if (last) {
        document.getElementById('editor-text').innerHTML = last
        this.focusOnEnd(document.getElementById('editor-text'))
      }
    },
    // 回撤
    retracement() {
      if (this.delHistoryTexts.length === 0) return
      const last = this.delHistoryTexts[this.delHistoryTexts.length - 1]
      this.delHistoryTexts.pop()
      document.getElementById('editor-text').innerHTML = last
      this.focusOnEnd(document.getElementById('editor-text'))
    },
    paste(e) {
      const clipboardData = e.clipboardData
      // alert(clipboardData.getData('text/plain').replace(/</gm,'《').replace(/>/gm,'》'))
      clipboardData.setData('text/plain', clipboardData.getData('text/plain'))
      e.preventDefault()
      // document.execCommand(
      //   'insertText',
      //   false,
      //   clipboardData.getData('text/plain').replace(/(\r|\s|<br>)$/g, '<br>')
      // )
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      range.deleteContents()
      const el = document.createElement('span')
      el.innerText = clipboardData
        .getData('text/plain')
        .replace(/(\r|\s|<br>)$/g, '\n')
      range.insertNode(el)
      selection.removeAllRanges()
      this.$nextTick(() => {
        this.$emit('mousemoveChange', {
          text: '',
          isTags: false,
          isPlainText: false
        })
        this.focusOnEnd(el)
      })
    },
    // 光标定位到新插入节点
    focusOnEnd(el) {
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(el)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    },
    blur() {
      // this.$emit('mousemoveChange', {
      //   text: '',
      //   isTags: false,
      //   isPlainText: false
      // })
      this.isFocus = false
    },
    globalClick(e) {
      // 判断点击区域是不是在编辑器内
      this.isFocus = document.getElementById('editor-text').contains(e.target)
      const selection = window.getSelection()
      if (this.isFocus) {
        this.ownSelection = selection
        console.log(selection.toString(), 'this.isFocus')
      }
      this.tagsList = []
      this.tagsHtmlList = []
      this.$emit('mousemoveChange', {
        text: '',
        isAllText: false,
        isTags: false,
        isPlainText: false,
        isFocus: this.isFocus
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .editor-placeholder {
    position: absolute;
    top: 24px;
    left: 20px;
    font-size: 14px;
    color: #9b9da0;
    user-select: none;
  }
}
.editor {
  width: 100%;
  height: 88%;
  overflow-y: auto;
  padding: 6px;
  word-break: break-all;
  font-size: 14px;
  color: #000;
  background-color: #fff;
  border-top: none;
  border-radius: 0px 0px 4px 4px;
  padding: 24px 20px 0 20px;
  caret-color: #1778ff !important;
  -webkit-caret-color: #1778ff !important;

  position: relative;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d8d8d8;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
}
::v-deep {
  .emptyStr {
    margin: 0 0.5px;
  }
  .label {
    padding-bottom: 1px;
    margin-right: 1px;
  }
  .icon {
    font-size: 12px;
    border-radius: 3px;
    user-select: none;
    pointer-events: none;
    padding-left: 2px;
    padding-right: 2px;
    white-space: nowrap;
  }
  .pause-icon {
    @extend .icon;
    background-color: #e7f0ff;
    margin: 0 6px;
  }
  .number-label {
    @extend .label;
    border-bottom: 1px solid rgb(255, 152, 0);
  }
  .number-icon {
    @extend .icon;
    background-color: rgb(255, 152, 0);
  }
  .chinese-label {
    @extend .label;
    border-bottom: 1px solid rgb(255, 152, 0);
  }
  .chinese-icon {
    @extend .icon;
    background-color: rgb(255, 152, 0);
  }
  .ys-label {
    @extend .label;
    padding-bottom: 3px;
    border-bottom: 1px solid #21a8c2;
    // .number-label {
    //   user-select: none;
    // }
  }
  .ys-icon {
    @extend .icon;
    background-color: #21a8c2;
  }
  .yd-label {
    @extend .label;
    padding-bottom: 3px;
    border-bottom: 1px solid #00c6a1;
  }
  .yd-icon {
    @extend .icon;
    background-color: #00c6a1;
  }
  .yl-label {
    @extend .label;
    padding-bottom: 3px;
    border-bottom: 1px solid #00d2ff;
  }
  .yl-icon {
    @extend .icon;
    background-color: #00d2ff;
  }
  mark {
    background-color: #ffcea0;
  }
}
</style>

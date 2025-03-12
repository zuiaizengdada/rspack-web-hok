<template>
  <div class="widget-form-container">
    <el-scrollbar style="height:100%">
      <div class="widget-form-box">
        <img class="widget-form-header" src="../assets/images/page_navigationBar.png" alt="" />
        <div class="page-title">{{ data.config.pageName }}</div>
        <draggable
          v-model="data.list"
          class="widget-form-content"
          v-bind="{ group: 'people', ghostClass: 'ghost', animation: 200, handle: '.drag-widget' }"
          @end="handleMoveEnd"
          @add="handleWidgetAdd"
        >
          <transition-group
            name="fade"
            tag="div"
            :style="{
              backgroundColor:backgroundType === 2 ? backgroundVal :'#fff',
              backgroundImage:`url(${backgroundType === 3 ? data.config.imageUrl[0] :''})`
            }"
            :class="{'widget-form-bg':backgroundType === 3 }"
            class="widget-form-list"
          >
            <template v-for="(element, index) in data.list">
              <widget-form-item
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
              />
            </template>
          </transition-group>

        </draggable>
      </div>

    </el-scrollbar>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'

export default {
  components: {
    Draggable,
    WidgetFormItem
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['data', 'select'],
  data() {
    return {
      selectWidget: this.select
    }
  },
  computed: {
    backgroundType() {
      return this.data?.config?.backgroundType ?? 1
    },
    backgroundVal() {
      return this.data?.config?.backgroundVal ?? ''
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  mounted() {
    document.body.ondrop = function (event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex
      // 为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      const current = JSON.parse(JSON.stringify(this.data.list[newIndex]))
      this.$set(this.data.list, newIndex, {
        ...current,
        key,
        // 绑定键值
        model: this.data.list[newIndex].type + '_' + key
      })
      this.selectWidget = this.data.list[newIndex]
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    }
  }
}
</script>


<template>
  <div
    v-if="element && element.key"
    class="widget-view"
    :class="{ active: selectWidget.key == element.key, is_req: element.options.required }"
    :label="element.name"
    @click.stop="(val)=>handleSelectWidget(index,val)"
  >
    <template v-if="element.type == 'picture'">
      <pictureComponents :item="element" />
    </template>

    <template v-if="element.type == 'lecturer'">
      <lecturerComponents :item="element" />
    </template>

    <template v-if="element.type == 'course'">
      <courseComponents :item="element" />
    </template>
    <div
      v-if="selectWidget.key == element.key"
      class="widget-view-action"
    >
      <svg-icon
        icon-class="icon_draggable"
        class="icon_draggable drag-widget"
      />
      <svg-icon
        icon-class="icon_delete"
        class="icon_delete drag-widge"
        @click.stop="handleWidgetDelete(index)"
      />
    </div>

  </div>
</template>

<script>
import pictureComponents from './pictureComponents/index'
import lecturerComponents from './lecturerComponents/index'
import courseComponents from './courseComponents/index'
export default {
  components: {
    pictureComponents,
    lecturerComponents,
    courseComponents
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['element', 'select', 'index', 'data'],
  data() {
    return {
      selectWidget: this.select
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
  mounted() {},
  methods: {
    handleSelectWidget(index, val) {
      this.selectWidget = this.data.list[index]
      console.log(val)
    },
    handleWidgetDelete(index) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
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
      })
    }
  }
}
</script>


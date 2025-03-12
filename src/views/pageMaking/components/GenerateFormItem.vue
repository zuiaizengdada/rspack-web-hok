<template>
  <div :label="widget.name" :prop="widget.model">
    <template v-if="widget.type == 'picture'">
      <pictureComponents />
    </template>
    <template v-if="widget.type == 'lecturer'">
      <lecturerComponents />
    </template>
    <template v-if="widget.type == 'course'">
      <courseComponents />
    </template>
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
  props: {
    widget: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {}
}
</script>

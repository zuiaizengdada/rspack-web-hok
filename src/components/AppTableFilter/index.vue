<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="900px"
    height="340px"
    @success="successFn"
  >
    <div v-loading="loading" class="choose_resource">
      <el-transfer
        v-model="value"
        style="height: 500px"
        class="m-t-20"
        :data="data"
        :titles="['隐藏', '显示']"
        filterable
      />
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false
    }
  },
  watch: {
    // visible: {
    //   handler(val) {
    //     if (val) {
    //       this.init()
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    successFn() {
      // console.log(this.checkList, this.checkListInfo)
      this.success(this.value, this.data)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.choose_resource{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

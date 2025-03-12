<template>
  <AppDialog
    :height="'400px'"
    :width="'694px'"
    :value="visible"
    :btn-footer="false"
    :title="title"
    @close="close()"
  >
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :if-index="true"
      :table-data="list"
      :table-columns="tableColumns"
      :hide-pagination="true"
    />
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
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableColumns: [
        { prop: 'userName', label: '运营者', type: 'text', visible: true },
        { prop: 'deptName', label: '部门', type: 'text', visible: true }
      ]
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div class="update-config-cls">
    <defaultAllocationData ref="defaultAllocationData" />
  </div>
</template>

<script>
import defaultAllocationData from '@/views/system/dataConfiguration/components/defaultAllocationData.vue'
export default {
  name: 'UploadBrod',
  components: {
    defaultAllocationData
  },
  data() {
    return {
      ordersType: 0,
      search: {
        pageIndex: 1,
        pageSize: 10,
        shopId: ''
      }
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
  },
  activated() {

  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    loadData() {
      this.$nextTick(function() {
        this.$refs.defaultAllocationData.loadData(this.search)
      })
    },
    changeOrdersType(dataType) {
      this.ordersType = dataType
    }
  }
}
</script>

    <style lang="scss" scoped>
    .update-config-cls {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background-color: #fff;
        .roi-cls {
            margin-right: 20px;
        }
        .row-cls {
            margin-top: 10px;
        }
    }
    </style>


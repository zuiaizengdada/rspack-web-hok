<template>
  <el-select
    v-model="address"
    placeholder="标记位置，更容易被同城的人看到～"
    class="w-full"
    filterable
    remote
    reserve-keyword
    clearable
    :remote-method="remoteMethod"
    @change="changeAddress"
  >
    <el-option
      v-for="item in addressList"
      :key="item.poi_id"
      :label="item.poi_name"
      :value="item.poi_id"
    />
  </el-select>
</template>
<script>
export default {
  props: {
    addressList: {
      type: Array,
      default: () => {
        return []
      }
    },
    addressId: {
      // type 可能是string也可能是number
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      address: ''
    }
  },
  watch: {
    addressId: {
      handler() {
        console.log('pppppppppppp')
        this.address = this.addressId
      }
    }
  },
  methods: {
    remoteMethod(keyword) {
      this.$emit('changeList', keyword)
    },
    changeAddress(e) {
      this.$emit('changeAddress', e)
    }
  }
}
</script>

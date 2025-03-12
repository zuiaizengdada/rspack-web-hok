<template>
  <!-- 查看学员手机号 -->
  <div class="watchPhoneNumber">
    <span v-if="phoneAreaCode">
      (+{{ phoneAreaCode }})
    </span>
    <span class="phoneNumber">
      {{ phoneNumber }}
    </span>
    <i v-if="!ifReal && phoneNumber" class="pointer" :class="loading ? 'el-icon-loading' : 'el-icon-view'" @click="onClick" />
  </div>
</template>

<script>
import { getPhoneDetail } from '@/api/user/member'
export default {
  components: {
  },
  props: {
    phoneAreaCode: {
      type: [String, Number],
      default: ''
    },
    defaultValue: {
      type: [String, Number],
      default: ''
    },
    userId: {
      type: [String, Number],
      default: ''
    },
    onhandleClick: {
      type: [Function, null],
      default: null
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      ifReal: false,
      phoneNumber: ''
    }
  },
  computed: {},
  watch: {
    defaultValue: {
      handler(val) {
        this.ifReal = false
        this.phoneNumber = this.filterPhone(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    onClick() {
      console.log(this.onhandleClick)
      if (this.onhandleClick) {
        this.loading = true
        return this.onhandleClick(this.params).then((res) => {
          res.data && (this.phoneNumber = res.data)
          this.ifReal = true
          this.loading = false
          this.$emit('success')
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.getRealPhoneNumber()
      }
    },
    // 点击获取真实手机号(根据userId)
    getRealPhoneNumber() {
      if (this.userId) {
        this.loading = true
        getPhoneDetail(this.userId).then(res => {
          res.data && (this.phoneNumber = res.data)
          this.ifReal = true
          this.loading = false
          this.$emit('success')
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.ifReal = true
        this.loading = false
        this.phoneNumber = this.defaultValue
      }
    },
    filterPhone(val) {
      if (!val) {
        return ''
      }
      return val.replace(/([\w]{3})[\w\W]+([\w]{4})$/, '$1****$2')
    }
  }
}
</script>

<style lang='scss' scoped>
.phoneNumber {
  margin-right: 4px;
}
.pointer {
  color: #2C82FF;
}
</style>

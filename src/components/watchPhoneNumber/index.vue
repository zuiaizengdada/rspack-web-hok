<template>
  <!-- 查看学员手机号 -->
  <div class="watchPhoneNumber">
    <span v-if="phoneAreaCode && phoneNumber">+{{ phoneAreaCode }}&nbsp;</span>
    <span class="phoneNumber">
      {{ phoneNumber }}
    </span>
    <i
      v-if="!ifReal && phoneNumber"
      class="pointer"
      :class="loading ? 'el-icon-loading' : 'el-icon-view'"
      @click.stop="onClick"
    />
  </div>
</template>

<script>
import { getPhoneDetail, getInfoByUserId } from '@/api/user/member'
export default {
  components: {},
  props: {
    getPhoneQuery: {
      type: [Function, null],
      default: null
    },
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
    ifSystem: {
      type: Boolean,
      default: false
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
    },
    regType: {
      type: Number,
      default: 0
    },
    copy: {
      type: Boolean,
      default: true
    },
    getApi: {
      type: [Function, null],
      default: null
    },
    // 是否需要前端加星号
    webFilter: {
      type: Boolean,
      default: false
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
        this.phoneNumber = this.webFilter ? this.filterPhone(val) : val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    onClick(event) {
      debugger
      if (this.onhandleClick) {
        this.loading = true
        return this.onhandleClick(this.params)
          .then(res => {
            res.data && (this.phoneNumber = res.data)
            this.ifReal = true
            this.loading = false
            this.$emit('success')
            this.copy && this.clipboardSuccess(this.phoneNumber, event)
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.getRealPhoneNumber(event)
      }
    },
    // 点击获取真实手机号(根据userId)
    getRealPhoneNumber(event) {
      if (this.userId) {
        this.loading = true
        console.log(this.getPhoneQuery, this.copy)
        let apiFn = this.getPhoneQuery || getPhoneDetail
        let params = this.userId
        if (this.ifSystem) {
          apiFn = getInfoByUserId
        } else if (this.getApi) {
          apiFn = this.getApi
          params = this.params
        }
        apiFn(params)
          .then(res => {
            if (typeof res.data === 'object') {
              this.phoneNumber = res.data.phoneNumber
            } else {
              res.data && (this.phoneNumber = res.data)
            }
            this.copy && this.clipboardSuccess(this.phoneNumber)
            this.ifReal = true
            this.loading = false
            this.$emit('success')
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.ifReal = true
        this.loading = false
        this.phoneNumber = this.defaultValue
        this.copy && this.clipboardSuccess(this.phoneNumber, event)
        this.$emit('success')
      }
    },
    filterPhone(val) {
      if (!val) {
        return ''
      }
      if (this.regType === 0) {
        return val.replace(/([\w]{3})[\w\W]+([\w]{4})$/, '$1****$2')
      } else {
        return '******'
      }
    },
    clipboardSuccess(str) {
      const textArea = document.createElement('textarea')
      textArea.value = str
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.phoneNumber {
  margin-right: 4px;
}
.pointer {
  color: #333333;
  &:hover {
    color: #2c82ff;
  }
}
</style>

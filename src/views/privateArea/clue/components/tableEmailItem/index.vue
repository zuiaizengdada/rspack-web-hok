<!-- setPhone 是否可编辑
phoneAuthority  可编辑按钮权限 -->
<template>
  <!-- 查看学员手机号 -->
  <div class="watchPhoneNumber">
    <div v-if="!isSave">
      <span class="phoneNumber">
        {{ email }}
      </span>
      <i
        v-if="!isReal && email"
        class="pointer"
        :class="loading ? 'el-icon-loading' : 'el-icon-view'"
        @click="onClick"
      />
    </div>
    <el-input-number
      v-else
      v-model="newEmail"
      controls-position="right"
      :min="1"
      :step-strictly="true"
      :controls="false"
    />
    <i
      v-if="setEmail && emailAuthority && !isSave"
      v-permission="[emailAuthority, permsList]"
      class="el-icon-edit pointer c_0F71FF edit"
      @click="handleEditEmail"
    />
    <i
      v-if="setEmail && !emailAuthority && !isSave"
      class="el-icon-edit pointer c_0F71FF edit"
      @click="handleEditEmail"
    />
    <div>
      <div v-if="setEmail && isSave" class="edit" @click="handleSave">保存</div>
      <div v-if="setEmail && isSave" class="edit" @click="isSave = false">
        取消
      </div>
    </div>
  </div>
</template>

<script>
import getApiList from './getApiList'
import { updateLivePhone } from '@/api/global.js'
import { copy } from '@/utils/index'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    setEmail: {
      type: Boolean,
      default: false
    },
    getEmailQuery: {
      type: [Function, null],
      default: null
    },
    mailAuthority: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    getApiList: {
      type: [Function, null],
      default: () => {}
    },
    userKey: {
      type: [String, Number],
      default: 'userId'
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    copy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newEmail: undefined,
      permsList: this.$route.meta.permsList || [],
      loading: false,
      isReal: false,
      isSave: false,
      email: '',
      realEmail: ''
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.email = this.value
        if (val !== this.realEmail) {
          this.reset()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    async handleSave() {
      if (!this.newEmail) return this.$message.warning('请输入邮箱号！')
      try {
        const { code, meg } = await updateLivePhone({
          clueId: this.rowData.id,
          newLivePhone: this.newEmail
        })
        if (code !== 1) this.$message.warning(meg)
        if (code === 1) {
          this.$message.success('修改成功！')
          this.$emit('change', this.newEmail)
          this.isSave = false
          this.isReal = true
          this.realEmail = this.newEmail
          this.loading = false
          this.newEmail = undefined
        }
      } catch {
        console.log()
      }
    },
    handleEditEmail() {
      this.newEmail = undefined
      this.isSave = true
    },
    async onClick() {
      this.loading = true
      try {
        const { data } = await getApiList[this.type](this.rowData, this.userKey)
        this.$emit('change', this.value)
        this.email = data
        if (this.copy) {
          copy(data)
        }
        this.isReal = true
        this.realEmail = data
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    reset() {
      this.isReal = false
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.watchPhoneNumber {
  display: flex;
  align-items: center;
}
.phoneNumber {
  margin-right: 4px;
}
.edit {
  margin-left: 10px;
  cursor: pointer;
  color: #2c82ff;
}
.pointer {
  color: #2c82ff;
}
</style>

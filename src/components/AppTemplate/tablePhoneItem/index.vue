<!-- setPhone 是否可编辑
phoneAuthority  可编辑按钮权限 -->
<template>
  <!-- 查看学员手机号 -->
  <div class="watchPhoneNumber">
    <!-- <div v-if="phoneAreaCode&&!isSave">+{{ phoneAreaCode }} &nbsp;</div> -->
    <div v-if="copyPhoneAreaCode && value && !isSave">
      (+{{ copyPhoneAreaCode }}) &nbsp;
    </div>
    <div v-if="!isSave">
      <span class="phoneNumber">
        {{ newValue }}
      </span>
      <i
        v-if="!isReal && newValue"
        class="pointer"
        :class="loading ? 'el-icon-loading' : 'el-icon-view'"
        @click="onClick"
      />
    </div>
    <el-input
      v-else
      v-model="newPhone"
      size="small"
      :maxlength="phoneMaxlength(newPhoneAreaCode)"
      style="width: 270px"
      clearable
    >
      <el-select
        slot="prepend"
        v-model="newPhoneAreaCode"
        filterable
        placeholder="请选择"
        style="width: 100px"
      >
        <el-option-group
          v-for="group in smsAreaList"
          :key="group.label"
          filterable
          :label="group.label"
        >
          <el-option
            v-for="item in group.options"
            :key="item.areaCode"
            :label="`+${item.areaCode} ${item.areaChineseName}`"
            :value="item.areaCode"
          >
            <span style="float: left">{{ item.areaChineseName }}</span>
            <span
              style="float: right; color: #8492a6; font-size: 13px"
            >+{{ item.areaCode }}</span>
          </el-option>
        </el-option-group>
      </el-select>
    </el-input>
    <i
      v-if="setPhone && phoneAuthority && !isSave"
      v-permission="[phoneAuthority, permsList]"
      class="el-icon-edit pointer c_0F71FF edit"
      @click="handleEditPhone"
    />
    <i
      v-if="setPhone && !phoneAuthority && !isSave"
      class="el-icon-edit pointer c_0F71FF edit"
      @click="handleEditPhone"
    />
    <div>
      <div v-if="setPhone && isSave" class="edit" @click="handleSave">保存</div>
      <div v-if="setPhone && isSave" class="edit" @click="isSave = false">
        取消
      </div>
    </div>
  </div>
</template>

<script>
import getApiList from './getApiList'
import { updateLivePhone } from '@/api/global.js'
import { copy } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    setPhone: {
      type: Boolean,
      default: false
    },
    phoneAreaCode: {
      type: String,
      default: ''
    },
    getPhoneQuery: {
      type: [Function, null],
      default: null
    },
    phoneAuthority: {
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
    rowData: {
      type: Object,
      default: () => {}
    },
    copy: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['smsAreaList'])
  },
  data() {
    return {
      copyPhoneAreaCode: '',
      newValue: '',
      newPhoneAreaCode: '',
      newPhone: undefined,
      permsList: this.$route.meta.permsList || [],
      loading: false,
      isReal: false,
      isSave: false,
      phone: '',
      realPhone: ''
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.newValue = val
        if (val !== this.realPhone) {
          this.reset()
        }
      },
      immediate: true
    },
    phoneAreaCode: {
      deep: true,
      handler(val) {
        this.copyPhoneAreaCode = this.phoneAreaCode
      },
      immediate: true
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    verifyMaxPhone(code) {
      const smsAreaList = this.smsAreaList.reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.options
        ],
        []
      )
      const data = smsAreaList.find(item => item.areaCode === code)
      return data
    },
    verifyPhone(phone, areaCode) {
      const smsAreaList = this.smsAreaList.reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.options
        ],
        []
      )
      const isRegex = smsAreaList.find(
        item => item.areaCode === areaCode
      )?.regex
      if (!isRegex) return true
      return new RegExp(isRegex).test(phone)
    },
    phoneMaxlength(code) {
      const maxObj = this.verifyMaxPhone(code)
      return maxObj?.length || 15
    },
    async handleSave() {
      if (!this.newPhone) return this.$message.warning('请输入手机号！')
      const verifyPhone = this.verifyPhone(
        this.newPhone,
        this.newPhoneAreaCode
      )
      if (!verifyPhone) return this.$message.warning('请输入完整的手机号!')
      try {
        const { code, meg } = await updateLivePhone({
          clueId: this.rowData.id,
          newLivePhone: this.newPhone,
          watchLivePhoneAreaCode: this.newPhoneAreaCode
        })
        if (code !== 1) this.$message.warning(meg)
        if (code === 1) {
          this.$message.success('修改成功！')
          this.copyPhoneAreaCode = this.newPhoneAreaCode
          this.$emit('change', this.newPhone)
          this.isSave = false
          this.isReal = true
          this.realPhone = this.newPhone
          this.loading = false
          this.newPhone = undefined
        }
      } catch {
        console.log()
      }
    },
    handleEditPhone() {
      this.newPhone = undefined
      this.newPhoneAreaCode = this.copyPhoneAreaCode
      this.isSave = true
    },
    async onClick() {
      this.loading = true
      try {
        const { data } = await getApiList[this.type](this.rowData)
        // this.$emit('change')
        this.newValue = data
        if (this.copy) {
          copy(data)
        }
        this.isReal = true
        this.realPhone = data
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

<template>
  <div>
    <el-input
      v-if="type === 'keword'"
      v-model="value1"
      maxlength="20"
      show-word-limit
      style="width:245px"
      placeholder="请输入内容"
      @input="handleChange"
    />
    <el-input
      v-else-if="type === 'short_thing'"
      v-model="value1"
      maxlength="5"
      show-word-limit
      style="width:245px"
      placeholder="请输入内容"
      @input="handleChange"
    />
    <el-input-number
      v-else-if="type === 'number'"
      v-model="value1"
      :controls="false"
      @input="handleChange"
    />
    <el-input
      v-else-if="type === 'letter'"
      v-model="value1"
      maxlength="32"
      show-word-limit
      style="width:245px"
      placeholder="请输入内容"
      @input="handleLetterValidator"
    />
    <el-input
      v-else-if="type === 'symbol'"
      v-model="value1"
      maxlength="5"
      show-word-limit
      style="width:245px"
      placeholder="请输入内容"
      @input="handleSymbolValidator"
    />
    <el-input
      v-else-if="type === 'character_string'"
      v-model="value1"
      maxlength="32"
      show-word-limit
      style="width:245px"
      placeholder="请输入内容"
      @input="handleCharacterValidator"
    />
    <el-date-picker
      v-else-if="type === 'time'"
      v-model="value1"
      type="datetime"
      value-format="yyyy 年 MM 月 dd 日 HH:mm"
      format="yyyy 年 MM 月 dd 日 HH:mm"
      placeholder="选择日期时间"
    />
    <el-input
      v-else-if="type === 'phone_number'"
      v-model="value1"
      maxlength="17"
      show-word-limit
      style="width:245px"
      placeholder="请输入内容"
      @input="handlePhoneValidator"
    />
    <el-input
      v-else-if="type === 'phrase'"
      v-model="value1"
      maxlength="5"
      show-word-limit
      style="width:245px"
      placeholder="请输入内容"
      @input="handlePhraseValidator"
    />
    <el-input
      v-else-if="type === 'car_number'"
      v-model="value1"
      maxlength="8"
      show-word-limit
      style="width:245px"
      placeholder="请输入内容"
      @input="handleCarValidator"
    />
    <el-input-number
      v-else-if="type === 'amount'"
      v-model="value1"
      :controls="false"
      @input="handleChange"
    />
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    label: {
      type: String,
      default: 'keword'
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    type() {
      // 20个以内字符
      if (this.label.indexOf('thing') !== -1) {
        return 'keword'
      }
      // 5个以内字符
      if (this.label.indexOf('short_thing') !== -1) {
        return 'short_thing'
      }
      // 32个以内数字
      if (this.label.indexOf('number') !== -1) {
        return 'number'
      }
      // 32个以内字母
      if (this.label.indexOf('letter') !== -1) {
        return 'letter'
      }
      // 5个以内符号
      if (this.label.indexOf('symbol') !== -1) {
        return 'symbol'
      }
      // 32以内数字、字母或符号
      if (this.label.indexOf('character_string') !== -1) {
        return 'character_string'
      }
      // 时间格式
      if (this.label.indexOf('time') !== -1) {
        return 'time'
      }
      // 5以内汉字
      if (this.label.indexOf('phrase') !== -1) {
        return 'phrase'
      }
      // 17位以内数字、符号
      if (this.label.indexOf('phone_number') !== -1) {
        return 'phone_number'
      }
      // 8位以内不能输入符号
      if (this.label.indexOf('car_number') !== -1) {
        return 'car_number'
      }
      // 11位以内数字
      if (this.label.indexOf('amount') !== -1) {
        return 'amount'
      }
      return 'keword'
    },
    value1: {
      get() {
        return this.value
      },
      set() {
      }
    }
  },
  methods: {
    handleChange(val) {
      this.$emit('change', val)
    },
    handleLetterValidator(val) {
      const value = val.replace(/[^a-zA-Z]/ig, '')
      this.$emit('change', value)
    },
    handleSymbolValidator(val) {
      const reg = /[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/ig
      const value = val.replace(reg, '')
      this.$emit('change', value)
    },
    handleCharacterValidator(val) {
      const reg = /[\u4e00-\u9fa5]/ig
      const value = val.replace(reg, '')
      this.$emit('change', value)
    },
    handlePhoneValidator(val) {
      const reg = /[\u4e00-\u9fa5a-zA-Z]/ig
      const value = val.replace(reg, '')
      this.$emit('change', value)
    },
    handlePhraseValidator(val) {
      const reg = /[^\u4e00-\u9fa5]/ig
      const value = val.replace(reg, '')
      this.$emit('change', value)
    },
    handleCarValidator(val) {
      const reg = /[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/ig
      const value = val.replace(reg, '')
      this.$emit('change', value)
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <el-radio-group v-model="model" @input="handleInputRadio" :disabled="modelDisabled">
      <el-radio :label="1">所有人可进入</el-radio>
      <el-radio :label="2">指定人员可进入</el-radio>
    </el-radio-group>
    <settings-user v-if="model===2" style="margin-top:14px;" />

  </div>
</template>
<script>

import SettingsUser from './liveRoomSettingsUser.vue'
export default {
  components: {
    SettingsUser
  },
  data() {
    return {
      model: 1,
      modelDisabled:false
    }
  },
  methods: {
    handleInputRadio(val) {
      this.$emit('change', val)
    }
  }

}
</script>

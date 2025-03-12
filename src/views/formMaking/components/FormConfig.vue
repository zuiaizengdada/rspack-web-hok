
<template>
  <div class="form-config-container">
    <el-form label-position="top">
      <el-form-item label="问卷名称" required>
        <el-input v-model="data.questionnaireName" />
      </el-form-item>
      <el-form-item label="有效期类型" required>
        <el-radio-group v-model="data.validType">
          <el-radio-button :label="1">长期有效</el-radio-button>
          <el-radio-button :label="2">按时间</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="data.validType === 2" label="有效期" required>
        <el-date-picker
          v-model="value"
          style="width: 360px"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </el-form-item>
      <!-- <el-form-item label="表单标签宽度">
        <el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10" />
      </el-form-item> -->

      <!-- <el-form-item label="组件尺寸">
        <el-radio-group v-model="data.size">
          <el-radio-button label="medium">medium</el-radio-button>
          <el-radio-button label="small">small</el-radio-button>
          <el-radio-button label="mini">mini</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: []
    }
  },
  methods: {
    handleDateChange(val) {
      this.data.startTime = val[0]
      this.data.endTime = val[1]
    }
  }
}
</script>

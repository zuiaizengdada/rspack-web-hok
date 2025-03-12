<template>
  <div class="evaluateInfo-container">
    <el-form class="evaluateInfo-form" label-width="110px">
      <el-form-item label="优点及不足" class="form-item">
        <div>{{ info.advantages }}</div>
      </el-form-item>
      <el-form-item label="兴趣爱好" class="form-item">
        <div>{{ info.interests }}</div>
      </el-form-item>
      <el-form-item label="工作目标" class="form-item">
        <div>{{ info.workTarget }}</div>
      </el-form-item>
      <el-form-item label="刑事记录" class="form-item">
        <div>{{ hasType.get(info.criminalRecord) }}</div>
      </el-form-item>
      <el-form-item label="健康状况" class="form-item">
        <div v-if="[1, 2].includes(info.healthStatus)">
          {{ healthStatusType.get(info.healthStatus) }}
        </div>
        <div v-else>{{ info.healthStatusRemark }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  healthStatusType,
  hasType
} from '@/views/businessAdmin/talentFile/options'

export default {
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          advantages: '',
          interests: '',
          workTarget: '',
          criminalRecord: '',
          healthStatus: ''
        }
      }
    },
    detailBaseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      healthStatusType,
      hasType
    }
  }
}
</script>

<style lang="scss" scoped>
.evaluateInfo-container {
  opacity: 1;
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  font-family: '微软雅黑';
  .form-item {
    margin-bottom: 0px;
  }
}
::v-deep .el-form-item__label {
  color: #666;
  font-weight: 400;
  font-family: '微软雅黑';
}
</style>

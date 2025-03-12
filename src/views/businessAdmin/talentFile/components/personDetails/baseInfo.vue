<template>
  <div class="baseInfo-container">
    <el-form class="baseInfo-form" label-width="110px" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="性别" class="form-item">
            <div>{{ sexType.get(info.sex) }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="年龄" class="form-item">
            <div>{{ info.age }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="已婚状态" class="form-item">
            <div>{{ maritalStatusType.get(info.maritalStatus) }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="是否怀孕"
            class="form-item"
            v-if="info.sex !== 0"
          >
            <div>{{ sureType.get(info.pregnant) }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="出生日期" class="form-item">
            <div>{{ getTime(info.birthday, '-', '-', '') }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="籍贯" class="form-item">
            <div>{{ (info.provinceName || '') + (info.cityName || '') }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="民族" class="form-item">
            <div>{{ info.nation }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="子女人数" class="form-item">
            <div>{{ info.childrenNumber }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="紧急联系人" class="form-item">
            <div>{{ info.emergencyContact }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="与本人关系" class="form-item">
            <div>
              {{ relationshipType.get(info.emergencyContactRelationship) }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话" class="form-item">
            <div>{{ info.emergencyContactPhone }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="来源" class="form-item">
            <div>{{ sourceMap.get(info.source) }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="身份证号" class="form-item">
            <div>{{ info.idCard }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="身份证地址" class="form-item">
            <div>{{ info.idCardAddress }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="首次工作日期" class="form-item">
            <div>{{ getTime(info.firstWorkDate, '-', '-', '') }}</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  sexType,
  sureType,
  sourceMap,
  maritalStatusType,
  relationshipType
} from '@/views/businessAdmin/talentFile/options'
import moment from 'moment'
export default {
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          sex: '',
          age: '',
          maritalStatus: '',
          pregnant: '',
          birthday: '',
          provinceName: '',
          cityName: '',
          nation: '',
          childrenNumber: '',
          emergencyContact: '',
          emergencyContactRelationship: '',
          emergencyContactPhone: '',
          source: '',
          idCard: '',
          idCardAddress: '',
          firstWorkDate: ''
        }
      }
    }
  },
  data() {
    return {
      sexType,
      sureType,
      maritalStatusType,
      relationshipType,
      sourceMap
    }
  },
  methods: {
    getTime(time, x, y, z) {
      return time ? moment(time).format(`YYYY${x}MM${y}DD${z || ''}`) : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.baseInfo-container {
  height: 148px;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  margin-bottom: 16px;
  .form-item {
    margin-bottom: 0px;
  }
}
.baseInfo-form {
  height: 100%;
}
::v-deep .el-form-item__label {
  color: #666;
  font-weight: 400;
  font-family: '微软雅黑';
}
</style>

<template>
  <div class="list-container">
    <div class="list-label">
      <span>{{ current.name }}</span>
      <i class="el-icon-remove-outline list-name-icon" @click="handleDelItem" />
    </div>

    <div v-for="(list, i) in current.items" :key="i" class="list-content">
      <el-form ref="ruleForm" :model="list" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="type">
              <el-select v-model="list.type" size="small" placeholder="请选择" @change="handleChange(i)">
                <el-option
                  v-for="(item, index) in type"
                  :key="item"
                  :disabled="i === Object.keys(type).length - 1 && current.items[0].type === +index"
                  :label="item"
                  :value="+index"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="remindType">
              <el-select v-model="list.remindType" size="small" placeholder="请选择">
                <el-option v-for="(item, index) in timeType" :key="item" :label="item" :value="+index" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">共提醒</el-col>
          <el-col :span="4">
            <el-form-item prop="remindNum">
              <el-select v-model="list.remindNum" class="select-second" size="small" placeholder="请选择">
                <el-option v-for="(item, index) in secondType" :key="item" :label="item" :value="+index" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <div v-if="current.items.length < Object.keys(type).length" class="list-box">
              <i class="el-icon-circle-plus-outline list-icon" @click="handleClickAdd" />
            </div>
          </el-col>
          <el-col :span="2">
            <div v-if="current.items.length !== 1" class="list-box">
              <i class="el-icon-remove-outline list-icon" @click="handleClickDel(i)" />
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
const type = {
  1: '产品对应不上提醒',
  2: '订单解密上限提醒'
}
const timeType = {
  0: '每分钟1次',
  60: '每小时1次',
  1440: '每天1次',
  10080: '每周1次',
  302400: '每月1次'
}
const secondType = {
  1: '1次',
  2: '2次',
  3: '3次',
  4: '4次',
  5: '5次',
  6: '6次',
  7: '7次',
  8: '8次',
  9: '9次',
  10: '10次',
  20: '20次'
}
export default {
  props: {
    current: {
      type: Object,
      default: () => {}
    },
    listIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      type,
      timeType,
      secondType,
      rules: {
        type: [{ required: true, message: '请输入提醒类型', trigger: 'change' }],
        remindType: [{ required: true, message: '请输入提醒频率', trigger: 'change' }],
        remindNum: [{ required: true, message: '请输入提醒次数', trigger: 'change' }]
      }
    }
  },
  methods: {
    handleClickAdd() {
      this.$emit('add', this.current)
    },
    handleClickDel(i) {
      this.$emit('delItem', { current: this.current, index: i })
    },
    handleChange(i) {
      if (this.current.items.length === Object.keys(type).length && i === 0) {
        this.current.items[1].type = ''
      }
    },
    handleDelItem() {
      this.$emit('del', this.listIndex)
    },
    validate() {
      return this.$refs.ruleForm.map((i) => i.validate)
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  margin-top: 20px;
  .list-label {
    display: flex;
    align-items: center;
    .list-name-icon {
      margin-left: 10px;
      color: red;
      cursor: pointer;
    }
  }

  .list-content {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .select-time {
      width: 140px;
    }
    .select-second {
      width: 100px;
    }
    .list-icon {
      font-size: 24px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .list-box {
    display: flex;
    align-items: center;
    height: 32px;
  }
}
</style>

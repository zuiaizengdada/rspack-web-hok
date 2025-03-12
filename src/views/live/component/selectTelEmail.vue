<template>
  <div class="selectTelEmail">
    <el-select v-model="value.label" placeholder="请选择" :size="size" class="input-with-select input-with-select-chang" @change="onLabelChange">
      <el-option v-for="item in optionsTime" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <template v-if="value.label === 'tel'">
      <el-input v-model.trim="value.value[value.label]" :style="{width: width}" :size="size" clearable class="input-with-time filter_teacherSelect" :placeholder="optionsTime[0].placeholder" @keyup.enter.native="searchFn" @clear="onInputClear" />
    </template>
    <template v-else-if="value.label === 'Email'">
      <el-input v-model.trim="value.value[value.label]" :style="{width: width}" :size="size" clearable class="input-with-time filter_teacherSelect" :placeholder="optionsTime[1].placeholder" @keyup.enter.native="searchFn" @clear="onInputClear" />
    </template>
    <template v-else-if="value.label === 'userName'">
      <AppSelect
        class="w-200 input-with-time filter_teacherSelect"
        :get-api-fn="getLiveRoomUserInfoByName"
        search-key="nickName"
        :value="value.value.userName.userId || ''"
        :label="value.value.userName.nickName || ''"
        :props="{
          label: 'nickName',
          value: 'userId'
        }"
        @selected="selectedStudentUserId"
      />
    </template>
  </div>
</template>

<script>
import { getLiveRoomUserInfoByName } from '@/api/liveRoom/index.js'
import AppSelect from '@/components/AppSelect'
export default {
  components: {
    AppSelect
  },
  props: {
    width: {
      type: [String, Number],
      default: '200px'
    },
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: Object,
      default: () => {
        return {
          value: {
            tel: '',
            Email: '',
            userName: {
              userId: '',
              nickName: ''
            }
          },
          label: ''
        }
      }
    },
    options: {
      type: Array,
      default: () => {
        return ['tel', 'Email']
      }
    },
    sourceList: {
      type: Array,
      default: () => {
        return [
          { label: '手机号码', value: 'tel', placeholder: '请输入手机号', origin: '' },
          { label: '邮箱', value: 'Email', placeholder: '请输入邮箱', origin: '' },
          { label: '学员昵称', value: 'userName', placeholder: '请选择', origin: { userId: '', nickName: '' } }
        ]
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    optionsTime() {
      const arr = []
      this.options.map((pre, index) => {
        const obj = this.sourceList.find(e => e.value === pre)
        obj && arr.push(obj)
      })
      return arr
    },
    origin() {
      if (this.options.length > 0) {
        return this.options[0]
      } else {
        return ''
      }
    }
  },
  mounted() {},
  methods: {
    getLiveRoomUserInfoByName(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        nickName: params.nickName
      }
      return getLiveRoomUserInfoByName(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    onLabelChange(res) {
      console.log(res, 'res', this.getDefaultValue())
      const value = {
        value: this.getDefaultValue(),
        label: res || this.origin
      }
      this.$emit('input', value)
      this.$emit('onChange', value)
      this.$emit('clearValidate')
    },
    onInputChange() {},
    onInputClear() {
      this.$emit('onChange')
    },
    searchFn() {
      console.log('回车')
      this.$emit('onChange')
    },
    // 获取默认的value值
    getDefaultValue() {
      const value = {}
      this.options.map((pre, index) => {
        const obj = this.sourceList.find(e => e.value === pre)
        if (obj) {
          value[pre] = obj.origin
        }
      })
      return value
    },
    selectedStudentUserId(e) {
      this.value.value.userName.userId = e.userId
      this.value.value.userName.nickName = e.nickName
      // this.searchFn()
      this.$emit('input', this.value)
      this.$emit('onChange')
    }
  }
}
</script>

<style lang='scss' scoped>
.selectTelEmail {
    display: inline-block;
}

.input-with-select {
  width: 108px;
  // height: 32px;
  // font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  border-radius: 4px 0px 0px 4px;
}
.input-with-select-chang {
  ::v-deep  .el-input__inner {
    border: none;
    border-radius: 3px 0px 0px 3px;
    border: 1px solid #D8DCE6;
    border-right: none;
  }
}

.input-with-time {
  width: 228px;
  border: none;
  border-radius: 0px 3px 3px 0px;
  // border: 1px solid #D8DCE6;
}
.filter_teacherSelect {
  ::v-deep {
    .el-input__inner {
      // border-radius: 0px 3px 3px 0px;
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>

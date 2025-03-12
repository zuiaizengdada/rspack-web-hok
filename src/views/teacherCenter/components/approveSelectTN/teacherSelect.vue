<!-- @author zhengjie -->
<template>
  <el-select
    v-model="val"
    filterable
    remote
    clearable
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"
    v-on="$listeners"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { teacherQueryByNameAudit } from '@/api/tearchCenter/index'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入IP姓名'
    },
    attribute: {
      type: String,
      default: 'teacherId'
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [],
      loading: false
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  created() {
    this.remoteMethod()
  },
  methods: {
    remoteMethod(queryString) {
      const params = {
        teacherName: queryString,
        pageIndex: 1,
        pageSize: 999
      }
      teacherQueryByNameAudit(params)
        .then((res) => {
          this.options = res.data.items.map((v) => {
            return { label: v.teacherName, value: v[this.attribute] }
          })
        })
        .catch(() => {
          this.options = []
        })
    },
    handleChange() {
      this.$emit('select')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  // padding: 10px;
  .icon-list {
    padding: 10px;
    box-sizing: border-box;
    height: 178px;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
    .radioGroup {
      width: 100%;
      display: flex;
      flex-direction: column;
      .radio {
        width: 100%;
        height: 40px;
        border-radius: 3px;
        padding: 9px 8px;
        background: #ffffff;
        border-radius: 3px;
      }
      .active {
        background: #cee2ff;
      }
    }
  }
  .footer {
    width: 100%;
    height: 38px;
    display: flex;
    align-items: center;
    padding-left: 17px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    margin-top: 1px;
    box-shadow: 0px -2px 5px 0px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
}
::v-deep {
  .tearchInput {
    width: 200px;
    .el-input__inner {
      cursor: pointer;
      background-color: #fff;
      color: #000;
    }
  }
}
.el-icon-circle-close {
  cursor: pointer!important;
}
</style>

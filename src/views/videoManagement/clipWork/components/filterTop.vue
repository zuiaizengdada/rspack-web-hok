<template>
  <div class="filterTop">
    <!-- 筛选组件 -->
    <template>
      <el-select v-model="optValue" size="mini" style="width: 120px;height: 32px;" placeholder="请选择IP" @change="changeSelect">
        <el-option
          v-for="item in optArray"
          :key="item.key"
          :label="item.lable"
          :value="item.key"
        />
      </el-select>
      <el-select v-if="!show" v-model="teacherId" size="mini" style="width: 230px; margin-right: 10px;height: 32px;" filterable placeholder="请选择IP" clearable @change="onTeacherSelect">
        <el-option
          v-for="item in tearchArray"
          :key="item.teacherId"
          :label="item.teacherName"
          :value="item.teacherId"
        />
      </el-select>
      <el-input
        v-else
        ref="myInput"
        v-model="search.keyWord"
        size="mini"
        placeholder="请输入关键词搜索"
        :class="{show: show}"
        class="myinput"
        clearable
        @input="(val) => keyWordChange(val)"
        @clear="clearKeyword"
      />
      <!-- <TeacherSelect
        ref="teacherSelect"
        class="teacherSelect"
        :default-tearch-id="search.teacher.teacherId"
        :value="search.teacher.teacherName"
        placeholder="请选择录制IP"
        @selected="onTeacherSelect"
      /> -->
    </template>

    <div class="searchIcon">
      <!-- <svg-icon class="pointer" icon-class="searchIcon" :style="{'margin-right': show ? '10px' : '0px'}" @click="show = !show" /> -->

    </div>
  </div>
</template>

<script>
import { teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  components: {
  },
  data() {
    return {
      teacherId: '',
      optValue: 1,
      tearchArray: [],
      search: {
        teacher: {
          teacherId: '',
          teacherName: ''
        },
        keyWord: ''
      },
      optArray: [{ lable: 'IP', key: 1 }, { lable: '工程名', key: 2 }],
      show: false
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.$refs.myInput && this.$refs.myInput.focus()
      }
    }
  },
  mounted() {
    this.loadTeacherData()
  },
  methods: {
    keyWordChange(val) {
      this.$uweb && this.$uweb.setAction('Event_clipWork_myShared_searchKeyWord')
      this.$emit('keyWordChange', val)
    },
    changeSelect(val) {
      if (val === 1) {
        this.search.keyWord = ''
        this.$emit('keyWordChange', this.search.keyWord)
        this.show = false
      } else {
        this.teacherId = ''
        this.onTeacherSelect('')
        this.show = true
      }
    },
    loadTeacherData() {
      const params = {
        name: ''
      }
      teacherQueryByName(params)
        .then((res) => {
          this.tearchArray = res.data
        })
        .catch(() => {
        })
    },
    onTeacherSelect(val) {
      this.$uweb && this.$uweb.setAction('Event_clipWork_myShared_searchLecturer')
      console.log('valLLLLLLLLL:', val)
      if (val === '') {
        const item = {
          teacherId: '',
          teacherName: ''
        }
        this.search.teacher = item
        this.$emit('onTeacherSelect', item)
      } else {
        this.tearchArray.some(item => {
          if (item.teacherId === val) {
            this.search.teacher = item
            this.$emit('onTeacherSelect', item)
          }
        })
      }
    },
    clear() {
      this.search = {
        teacher: {
          teacherId: '',
          teacherName: ''
        },
        keyWord: ''
      }
      this.optValue = 1
      this.teacherId = ''
      this.show = false
      this.$emit('clear', this.search.teacher)
    },
    clearKeyword() {
      this.search.keyWord = ''
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-input--medium .el-input__inner {
    height: 32px;
  }
  .el-input--medium .el-input__icon {
    line-height: 32px;
  }
}
.filterTop {
  margin-top: 14px;
  padding-top: 10px;
  margin-bottom: 3px;
  padding-bottom: 7px;
  display: flex;
  // align-items: center;
  width: 100%;
  // overflow: hidden;
  .teacherSelect {
    width: 226px;
  }
  .searchIcon {
    flex: 1 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    .el-icon-search {
      margin-right: 10px;
      cursor: pointer;
    }
    .myinput {
      transition: width .2s;
      width: 0;
      overflow: hidden;
    }
    .show {
      width: 220px;
    }
  }
}
::v-deep {
  .tearchInput {
    width: 100%;
  }
}
</style>

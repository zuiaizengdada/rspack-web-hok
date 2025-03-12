<template>
  <div class="top_search">
    <el-select
      v-model="teacherId"
      size="mini"
      style="width: 100px; margin-right: 10px;"
      :remote-method="tearchFilter"
      remote
      clearable
      filterable
      placeholder="请选择IP"
      @blur="()=>tearchFilter('')"
      @change="handleChangeTeacher"
    >
      <el-option-group
        v-for="group in filteredGroups(tearchArray)"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
        </el-option>
      </el-option-group>
    </el-select>
    <el-select v-model="sceneId" placeholder="选择交付场景" style="width: 120px;margin-right: 10px; " size="mini" filterable :remote-method="getSenceOptions" clearable @change="sceneSearch">
      <el-option v-for="item in senceOptions" :key="item.id" :label="item.sceneName" :value="item.id" />
    </el-select>
    <el-input
      ref="searchInput"
      v-model="input3"
      style="flex: 1;"
      min="2"
      max="30"
      size="mini"
      :placeholder="`请输入${select === '1'?'工程名':'字幕'}，最少输入2个字，最多输入30个字`"
      class="input-with-select"
      clearable
      @keyup.enter.native="handleSearch"
      @clear="clearSearch"
      @input="handleInput"
    >
      <el-select slot="prepend" v-model="select" style="width: 90px;" placeholder="请选择">
        <el-option label="工程名" value="1" />
        <el-option label="字幕" value="2" />
      </el-select>
      <el-button slot="append" :disabled="input3.length === 0" type="primary" @click="handleSearch">搜索</el-button>
    </el-input>
  </div>
</template>

<script>
import { searchDeliveryData } from '@/api/product/setting'
import { loadUserData, changeTeacher } from '@/utils/videoMange'
import { filteredGroups } from '@/utils/videoMange'

export default {
  props: {
    type: {
      type: [String, Number],
      default: '1'
    }
  },
  data() {
    return {
      config: {
        teacherId: '',
        subtitle: '',
        name: ''
      },
      filteredGroups,
      teacherId: '',
      sceneId: '',
      senceOptions: [],
      tearchArray: [],
      tearchList: [],
      select: '1',
      input3: ''
    }
  },
  created() {
    this.loadTeacherData()
    this.getSenceOptions('')
    // searchInput聚焦
    this.$nextTick(() => {
      this.$refs.searchInput.focus()
    })
  },
  methods: {
    tearchFilter(query = '') {
      console.log('失去焦点', query)
      setTimeout(() => {
        const arr = this.tearchList.filter((item) => {
          return item.label.includes(query) || item.value.includes(query)
        })
        this.tearchArray[0].isHidden = query.length > 0
        if (arr.length > 300) {
          this.tearchArray[1].options = arr.slice(0, 300)
        } else {
          this.tearchArray[1].options = arr
        }
      }, 300)
    },
    clearTeacher() {
      console.log('清空所有讲师')
      this.tearchArray = []
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('clipWorkTearch', 1)
      this.tearchArray = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async handleChangeTeacher(val) {
      if (this.teacherId) {
        const res = await changeTeacher(this.tearchList, this.tearchArray, 'clipWorkTearch', this.teacherId)
        console.log(res, '选择了IP')
        this.tearchArray = res
      }
      this.$emit('search', {
        teacherId: this.teacherId,
        select: this.select,
        sceneId: this.sceneId,
        input3: this.input3
      })
    },
    async getSenceOptions(query) {
      const { data } = await searchDeliveryData({ sceneName: query, ...{ pageIndex: 1, pageSize: 100 } })
      this.senceOptions = data.items.filter(item => {
        return item.status === 1
      })
      console.log(data, '交付场景')
    },
    onTeacherSelect(val) {
      this.$emit('search', {
        teacherId: this.teacherId,
        select: this.select,
        sceneId: this.sceneId,
        input3: this.input3
      })
    },
    sceneSearch(val) {
      this.$emit('search', {
        teacherId: this.teacherId,
        select: this.select,
        input3: this.input3,
        sceneId: this.sceneId
      })
    },
    // 最少输入2个字，最多输入30个字
    handleSearch() {
      if (this.input3.length < 2) {
        this.$message.error('最少输入2个字')
        return
      }
      if (this.input3.length > 30) {
        this.$message.error('最多输入30个字')
        return
      }
      this.$emit('search', {
        teacherId: this.teacherId,
        select: this.select,
        sceneId: this.sceneId,
        input3: this.input3
      })
    },
    clearSearch() {
      this.$emit('search', {
        teacherId: this.teacherId,
        select: this.select,
        sceneId: this.sceneId,
        input3: this.input3
      })
    },
    // 名称不能包含下列特殊字符： / : * ? " < > |，且长度不超过30个字符，超过删除
    handleInput(val) {
      this.input3 = val.replace(/[\/:*?？"<>|]/g, '')
      if (val.length > 30) {
        this.input3 = val.substring(0, 30)
        this.$message.error('最多输入30个字')
      }
    },
    clearTopSearch() {
      this.teacherId = ''
      this.select = '1'
      this.input3 = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.top_search {
  display: flex;
  align-items: center;
}
::v-deep .input-with-select .el-input-group__prepend{
  background-color: #fff;
  // border-right: 1px solid #dcdfe6;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
::v-deep .el-input-group__append{
  background-color: #0C6FFF;
  border: 1px solid #0C6FFF;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #fff;
}
</style>

<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTop-row">
      <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
        <el-form-item label="课件名称">
          <el-input
            v-model.trim="search.coursewareName"
            class="w-200"
            clearable
            placeholder="请输入课件名称"
            @clear="sureSearch"
            @keyup.enter.native="sureSearch"
          />
        </el-form-item>
        <el-form-item label="课件关键词">
          <el-input
            v-model.trim="search.coursewareKeyword"
            class="w-200"
            clearable
            placeholder="请输入课件关键词"
            @clear="sureSearch"
            @keyup.enter.native="sureSearch"
          />
        </el-form-item>
        <el-form-item label="IP姓名">
          <el-select
            v-model="search.teacherId"
            filterable
            clearable
            placeholder="请选择"
            class="w-200"
            @change="sureSearch"
          >
            <el-option
              v-for="item in teacherArray"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课件版本">
          <el-select
            v-model="search.coursewareVersion"
            placeholder="请选择"
            clearable
            class="w-200"
            @change="sureSearch"
          >
            <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用场景">
          <el-select v-model="search.applySceneId" placeholder="请选择" clearable class="w-200" @change="sureSearch">
            <el-option v-for="item in usePlace" :key="item.id" :label="item.sceneName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="font-size: 14px;" type="primary" @click="sureSearch">查询</el-button>
          <el-button style="font-size: 14px;" @click="clear()">重置</el-button>
        </el-form-item>
        <el-form-item class="right-float">
          <el-button v-permission="['web:courseManage:add', permsList]" type="primary" plain class="right-tools" @click="insertCourse">
            <i class="el-icon-plus" />
            新增课件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="line-h" />
  </div>
</template>

<script>
import { searchDeliveryData } from '@/api/product/setting'
import { teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  name: 'FilterTop',

  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      orderStatus: [
        { label: '原版', value: 0 },
        { label: '修改版', value: 1 },
        { label: '最终版', value: 2 }
      ],
      usePlace: [],
      teacherArray: [],
      addOrEditObject: {
        addFlag: 1, // 1为新增
        showFlag: true,
        title: '新增',
        data: {}
      }
    }
  },
  computed: {},
  mounted() {
    this.loadSceneList()
    this.loadTearchList()
  },
  created() {},
  methods: {
    loadTearchList() {
      const params = {
        name: ''
      }
      teacherQueryByName(params).then((res) => {
        if (res.success) {
          this.teacherArray = res.data
        }
      })
    },
    loadSceneList() {
      const param = {
        pageIndex: 1,
        pageSize: 1000,
        sceneName: ''
      }
      searchDeliveryData(param).then((res) => {
        if (res.success) {
          this.usePlace = res.data.items
        }
      })
    },
    sureSearch() {
      this.search.pageIndex = 1
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        pageIndex: 1,
        pageSize: 10,
        applySceneId: '',
        coursewareKeyword: '',
        coursewareName: '',
        coursewareVersion: '',
        teacherId: ''
      }
      this.$emit('search', res)
    },
    insertCourse() {
      this.$router.push('/productManagement/courseInsert')
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  width: 100%;
  position: relative;
}
.filter-module {
  width: 100%;
  ::v-deep .el-form-item__label {
    text-align: left;
  }
}
.line-h {
  width: 100%;
  height: 1px;
  margin-top: 10px;
  background: #e7e7e7;
}

.btn_ground {
  display: flex;
  margin-left: 8px;
  .btn {
    padding: 0 16px;
    color: #333;
    margin-right: 8px;
    margin-bottom: 0;
    float: left;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    border-color: #2a75ed;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
.filterTop-row {
  width: 100%;
}
.tools-block {
  width: 100%;
  height: 40px;
}
.tools-search {
  float: right;
}
.right-float {
  float: right;
  margin-right: 0px;
}
.right-tools {
  float: right;
  border: 1px solid #0c6fff;
  color: #0c6fff;
  background: none !important;
  font-size: 14px;
}

.right-tools:hover {
  background: #0c6fff !important;
}
.el-icon-plus {
  font-weight: bold;
}
</style>

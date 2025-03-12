<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form
        ref="form"
        class="filter-module"
        :model="search"
        label-width="80px"
        size="small"
        :inline="true"
      >
        <el-form-item label="菜单搜索">
          <el-select
            v-model="search.menu.label"
            placeholder="请选择"
            clearable
            class="w-120"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model.trim="search.menu.value"
            class="w-250 m-l-20"
            clearable
            @clear="sureSearch"
            @keyup.enter.native="sureSearch"
          />
        </el-form-item>
        <!-- <el-form-item label="菜单类型">
          <el-select v-model="search.menuType" clearable @change="sureSearch">
            <el-option label="目录" value="M" />
            <el-option label="菜单" value="C" />
            <el-option label="按钮" value="F" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="时间搜索">
            <el-select v-model="search.time.label" placeholder="请选择" class="w-120">
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-model="search.time.value"
              class="w-250 m-l-20"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
            />
          </el-form-item> -->
        <el-form-item label="显示状态">
          <el-select
            v-model="search.visible"
            placeholder="请选择"
            class="w-200"
            clearable
            @change="sureSearch"
          >
            <el-option label="显示" :value="0" />
            <el-option label="隐藏" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单状态">
          <el-select
            v-model="search.status"
            placeholder="请选择"
            class="w-200"
            clearable
            @change="sureSearch"
          >
            <el-option label="正常" :value="0" />
            <el-option label="停用" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="sureSearch">
            查询
          </el-button>
          <el-button style="margin-left: 20px" size="small" @click="clear()">
            清空
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      options: [
        { label: '菜单名称', value: 'menuName' },
        // { label: '菜单ID', value: 'menuId' },
        // { label: '父菜单ID', value: 'parentId' },
        { label: '路由地址', value: 'path' },
        { label: '权限标识', value: 'perms' }
      ],
      timeOptions: [
        { label: '创建时间', value: 'createTime' },
        { label: '更新时间', value: 'updateTime' }
      ],
      searchOpen: false
    }
  },
  created() {},
  methods: {
    sureSearch() {
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        menu: { label: 'menuName', value: '' },
        // time: { label: 'createTime', value: ['', ''] },
        // status: '',
        visible: '',
        menuType: '',
        loading: false
      }
      this.$emit('search', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  width: 100%;
  display: flex;
  position: relative;
  .filterTopLeft {
    flex: 1 0 0;
  }
  .fiterTopTagger {
    position: absolute;
    bottom: 0;
    left: 50%;
  }
}
.filter-module {
  padding: 16px;
  width: 100%;
  // min-width: 1122px;
  // background-color: #f5f7fa;
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
</style>

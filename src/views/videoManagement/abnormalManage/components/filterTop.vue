<template>
  <div class="search">
    <el-form :inline="true" :model="accountForm" class="form-container" size="small">
      <el-form-item v-if="roleObject.role === 1" label="部门">
        <el-cascader v-model="accountForm.deptArray" :options="deptTreeArray" :props="{ checkStrictly: true }" clearable @change="visibleChangeD($event)" @visible-change="visibleChangeD($event)" />
      </el-form-item>
      <el-form-item v-if="roleObject.role === 1" label="运营者">
        <el-select v-model="accountForm.operatorId" filterable placeholder="请选择" clearable @change="getListForSearch">
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
            <span style="float: left">{{ item.nickName }}</span>
            <span v-if="item.status === 1" style="float: right; color: #f53f3f; font-size: 13px">已离职</span></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IP老师">
        <el-select
          v-model="accountForm.teacherId"
          clearable
          filterable
          remote
          :remote-method="tearchFilter"
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
      </el-form-item>
      <el-form-item label="账号状态">
        <el-select v-model="accountForm.exceptionAccountType" filterable placeholder="请选择" clearable @change="getListForSearch">
          <el-option
            v-for="item in loginArray"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="平台">
        <el-select v-model="accountForm.platformId" filterable placeholder="请选择" clearable @change="getListForSearch">
          <el-option
            v-for="item in platformArray"
            :key="item.platformId"
            :label="item.platformName"
            :value="item.platformId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账号名称">
        <el-input v-model="accountForm.accountName" placeholder="请输入账号名称" />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="accountForm.phone" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListForSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item style="float: right; margin-right: 0px;">
        <div class="search_right">
          <el-popover
            placement="bottom-end"
            width="150"
            trigger="click"
          >
            <p slot="reference" style="color:#0C6FFF;font-size:14px; width: 93px; text-align: right; cursor: pointer;" type="text" size="small">自定义表头 <img :src="iconShezhi" class="mr-1" style="margin-top:7px;float: left" /></p>

            <el-checkbox v-model="allColumnsSelected" :disabled="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
              全选
            </el-checkbox>
            <el-checkbox
              v-for="item in config.tableColumns"
              :key="item.label"
              v-model="item.visible"
              v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
              :disabled="item.disable"
              @change="handleCheckedTableColumnsChange(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-popover>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { filteredGroups } from '@/utils/videoMange'
import { filtersMoneyByW } from '@/filters/index'
export default {
  props: {
    accountForm: {
      type: Object,
      default: () => {
        return {
          deptArray: [],
          operatorId: '',
          teacherId: '',
          exceptionAccountType: '',
          groupId: '',
          platformId: null,
          accountName: '',
          sortType: 0,
          phone: ''
        }
      }
    },
    roleObject: {
      type: Object,
      default: () => {
        return {
          role: 0
        }
      }
    },
    config: {
      type: Object,
      default: () => {
        return {
          tableColumns: [
            { prop: 'name', width: 200, label: '账号', type: 'slot', visible: true, disable: true },
            { prop: 'platformId', width: 120, label: '平台', type: 'slot', visible: true, disable: true },
            { prop: 'accountExceptionStatus', width: 100, label: '账号状态', type: 'slot', visible: true },
            { prop: 'fans', width: 100, label: '粉丝数', type: 'slot', visible: true, render: (row) => {
              return filtersMoneyByW(row.fans)
            } },
            { prop: 'teacherName', label: 'IP老师', type: 'text', visible: true },
            { prop: 'operatorName', label: '运营者', type: 'text', visible: true },
            { prop: 'deptName', label: '部门', type: 'text', visible: true },
            { prop: 'authorId', label: '账号ID', type: 'text', visible: true },
            { prop: 'authorId', label: '账号UID', type: 'text', visible: true },
            { prop: 'phone', label: '电话号码', type: 'text', visible: true },
            { prop: 'action', label: '操作', width: 190, type: 'slot', visible: true, disable: true }
          ]
        }
      }
    },
    allColumnsSelected: {
      type: Boolean,
      default: false
    },
    allColumnsSelectedIndeterminate: {
      type: Boolean,
      default: false
    },
    tearchArray: {
      type: Array,
      default: () => []
    },
    userArray: {
      type: Array,
      default: () => []
    },
    deptTreeArray: {
      type: Array,
      default: () => []
    },
    platformArray: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      iconShezhi,
      filteredGroups,
      loginArray: [{ label: '已注销', value: 1 }, { label: '移交老师', value: 2 }]
    }
  },
  methods: {
    getListForSearch() {
      this.$emit('getListForSearch', this.accountForm)
    },
    visibleChangeD(events) {
      console.log('events: ', events)
      if (!events) {
        this.$emit('loadUserNoPage')
        this.$emit('getListForSearch', this.accountForm)
      } else {
        this.$emit('getListForSearch', this.accountForm)
      }
    },
    clear() {
      this.$emit('clear')
    },
    handleChangeTeacher() {
      this.$emit('handleChangeTeacher', this.accountForm)
    },
    async tearchFilter(query = '') {
      setTimeout(async() => {
        this.$emit('tearchFilter', query)
      }, 300)
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('accountManage_tabledata', JSON.stringify(this.config.tableColumns))
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
margin-top: 18px;
  margin-left: 20px;
  margin-right: 20px;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .form-container{
    width: 100%;
    .form-item{
      flex: 1;
      min-width: 400px;
      .el-form-item__content{
         display: flex;
      }
    }
  }
  .search_box{
    display: flex;
    height: 33px;
    width: 100%;
    .search_right {
      margin-left: 20px;
      flex: 1 0 0;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }

}
</style>

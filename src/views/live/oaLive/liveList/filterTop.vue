<template>
  <div class="filter-module">
    <!-- 顶部筛选栏 -->
    <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true">
      <el-row>
        <el-form-item label="机构名称">
          <el-select v-model="search.tenantId" size="small" class="w-200" placeholder="请选择" clearable filterable @change="handleClickSearch">
            <el-option v-for="item in orgOption" :key="item.organizationId" :label="item.name" :value="item.organizationId" />
          </el-select>
        </el-form-item>

        <el-form-item label="直播间ID">
          <el-input v-model.trim="search.liveRoomCode" class="w-200" @keyup.enter.native="handleClickSearch" />
        </el-form-item>
        <el-form-item label="直播名称">
          <el-input v-model.trim="search.liveRoomName" class="w-200" @keyup.enter.native="handleClickSearch" />
        </el-form-item>
        <el-form-item label="直播模式">
          <el-select v-model="search.liveModel" clearable class="w-200" placeholder="请选择" style="width: 200px" @change="onhandleTearchChange">
            <!-- <el-option v-for="(item, key) in liveModeOption" :key="key" :value="item.value" :label="item.label" /> -->
            <el-option label="真人直播" value="PERSON_LIVE" />
            <el-option label="数字直播" value="AI_LIVE" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="search.liveModel" label="讲师">
          <el-select v-model="search.liveModel" placeholder="请选择" class="input-with-select input-with-select-chang" @change="onhandleTearchChange">
            <el-option label="真人讲师" value="PERSON_LIVE" />
            <el-option label="视频讲师" value="AI_LIVE" />
          </el-select>
          <el-select v-if="search.liveModel === 'PERSON_LIVE'" v-model="search.realityTeacherUserId" class="w-200 filter_teacherSelect" filterable placeholder="请选择讲师" clearable @change="handleClickSearch">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
          <AppSelect
            v-else-if="search.liveModel === 'AI_LIVE'"
            class="filter_teacherSelect"
            :get-api-fn="getTeacherList"
            search-key="teacherName"
            :value="search.teacherId"
            :label="search.teacherName"
            :props="{
              label: 'teacherName',
              value: 'teacherId'
            }"
            @selected="selectedTeacher"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="创建人">
          <el-select v-model="search.createUserId" class="w-200" filterable placeholder="请选择创建人" clearable @change="handleClickSearch">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="直播状态">
          <el-select v-model="search.status" class="w-200" placeholder="请选择" style="width: 200px" clearable @change="handleClickSearch">
            <el-option v-for="(item, key) in liveStateOption" :key="key" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <div class="order-time-box">
            <el-select v-model="search.time.label" placeholder="请选择" class="input-with-select input-with-select-chang">
              <el-option v-for="item in optionsTime" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-date-picker
              v-model="search.time.value"
              class="input-with-time"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
              @change="handleClickSearch"
            />
          </div>
        </el-form-item>
        <el-form-item label="直播标签">
          <el-select v-model="search.type" clearable class="w-200" placeholder="请选择" style="width: 200px" @change="$emit('onSearch')">
            <el-option label="正式" :value="1" />
            <el-option label="测试" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="直播类型">
          <el-select v-model="search.feesType" clearable class="w-200" placeholder="请选择" style="width: 200px" @change="$emit('onSearch')">
            <el-option label="免费" :value="1" />
            <el-option label="付费" :value="2" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row class="m-b-20">
        <el-button size="small" type="primary" @click="handleClickSearch">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
        <!-- <el-button size="small" class="fr" type="primary" @click="$emit('onhandleAdd')">新增直播间</el-button> -->
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { liveModeOption, liveStateOption } from '../../columns'
import { getTeacherList } from '@/api/tearchCenter/index'
import { userNoPage } from '@/api/addressBookApi'
import { getOrgList } from '@/api/liveRoom/setting.js'
import AppSelect from '@/components/AppSelect/index'
export default {
  components: {
    AppSelect
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          tenantId: '',
          type: '',
          liveRoomCode: '',
          liveRoomName: '',
          realityTeacherUserId: '',
          createUserId: '',
          liveModel: '',
          feesType: '',
          status: '',
          time: { value: ['', ''], label: 0 }
        }
      }
    }
  },
  data() {
    return {
      liveModeOption,
      liveStateOption,
      optionsTime: [
        { label: '开播时间', value: 1 },
        { label: '创建时间', value: 2 }
      ],
      userArray: [],
      orgOption: []
    }
  },
  created() {
    this.loading = true
    this.getOrgList()
    this.loadUserNoPage()
  },
  mounted() {},
  methods: {
    // 获取机构列表
    getOrgList() {
      return getOrgList().then(res => {
        this.orgOption = res.data
        return res
      })
    },
    handleClickSearch() {
      this.$emit('onSearch')
    },
    clear() {
      this.$emit('onClear')
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    getTeacherList(params) {
      console.log(params)
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherName: params.teacherName,
        serviceEnterprise: '',
        domainId: '',
        cooperateStatus: '',
        assessStatus: '',
        searchDateStart: '',
        searchDateEnd: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        recommendName: '',
        createUserName: '',
        assessFlag: ''
      }
      return getTeacherList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectedTeacher(res) {
      console.log(res)
      this.search.teacherId = res.teacherId
      this.search.teacherName = res.teacherName
      this.$emit('onSearch')
    },
    onhandleTearchChange() {
      this.search.teacherId = ''
      this.search.teacherName = ''
      this.search.realityTeacherUserId = ''
      this.$emit('onSearch')
    }
  }
}
</script>

<style lang='scss' scoped>
.filter-module {
  padding-top: 20px;
  border-bottom: 1px solid #E7E7E7;
  margin-bottom: 20px;
  .order-time-box {
    display: flex;
  }
  .input-with-select {
    width: 108px;
    height: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    border-radius: 3px 0px 0px 3px;
  }
  .input-with-select-chang {
    ::v-deep  .el-input__inner {
      border: none;
      border-radius: 3px 0px 0px 3px;
      border: 1px solid #D8DCE6;
      border-right: none;
    }
  }
}
::v-deep .el-input__inner{
  height: 32px;
}
::v-deep .ss-material-box-header-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
.input-with-time {
  width: 228px;
  border: none;
  border-radius: 0px 3px 3px 0px;
  border: 1px solid #D8DCE6;
}
.filter_teacherSelect {
  ::v-deep {
    .el-input__inner {
      border-radius: 0px 3px 3px 0px;
    }
  }
}
</style>

<template>
  <MPageLayout
    ref="MPageLayout"
    type="tablePage"
    :slot-arr="slotArr"
    :current-page="config.currentPage"
    :page-sizes="config.pageSizes"
    :page-size="config.pageSize"
    :total="config.total"
    :table-data="config.tableData"
    :table-columns="config.tableColumns"
    :loading="loading"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
    <template slot="search">
      <div class="filterHeader">
        <span class="formLabel">员工姓名</span>
        <el-select v-model="search.userId" size="small" class="w-200 m-r-10" filterable placeholder="请选择" clearable @change="searchFn">
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
        <span class="formLabel">手机号码</span>
        <el-input v-model.trim="search.phone" size="small" placeholder="请输入" style="width: 200px" class="m-r-10" clearable @input="delNumber" @keyup.enter.native="searchFn" @clear="searchFn" />
        <el-button size="small" type="primary" @click="searchFn">查询</el-button>
      </div>
    </template>
    <template slot="action" slot-scope="{ row }">
      <el-button type="text" @click="onhandleEdit(row)">编辑</el-button>
    </template>
    <template slot="headImgUrl" slot-scope="{ row }">
      <AppAvatar :avatar="row.headImgUrl" :name="row.liveRoomAlias || row.teacherName" width="30" :no-name="true" />
    </template>
    <template slot="teacherTel" slot-scope="{ row }">
      <watchPhoneNumber :default-value="row.teacherTel" :params="row" :user-id="row.teacherId" :get-api="operationLogsWrite" />
    </template>

  </MPageLayout>
</template>
<script>
export default {
  data() {
    return {
      slotArr: [],
      config: {
        currentPage: 1,
        pageSizes: 10,
        pageSize: [],
        total: 0,
        tableData: [],
        tableColumns: [
          { prop: 'videoName', label: '视频名称', type: 'slot', 'min-width': '80px' },
          { prop: 'teacherName', label: '关联讲师', type: 'text', 'min-width': '120px' },
          { prop: 'videoSource', label: '视频来源', type: 'text', 'min-width': '120px' },
          { prop: 'code', label: '视频分辨率', type: 'slot', 'min-width': '120px' },
          { prop: 'duration', label: '视频时长', type: 'slot', 'width': '120px', fixed: 'right' },

          { prop: 'format', label: '视频格式', type: 'slot', 'min-width': '80px' },
          { prop: 'covertStatus', label: '视频转码状态', type: 'text', 'min-width': '120px' },
          { prop: 'mediaProcessTaskStatus', label: '媒体处理状态', type: 'text', 'min-width': '120px' },
          { prop: 'status', label: '使用状态', type: 'slot', 'min-width': '120px' },

          { prop: 'deptName', label: '上传者部门', type: 'slot', 'min-width': '80px' },
          { prop: 'createUserName', label: '上传人', type: 'text', 'min-width': '120px' },
          { prop: 'createTime', label: '上传时间', type: 'text', 'min-width': '120px' },
          { prop: 'connectScriptCount', label: '关联脚本数', type: 'slot', 'min-width': '120px' },

          { prop: 'connectLiveCount', label: '被引用次数', type: 'text', 'min-width': '120px' },
          { prop: 'action', label: '操作', type: 'slot', 'min-width': '120px' }
        ]
      }
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>

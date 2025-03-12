<template>
  <div class="page_wrap1">
    <div class="search">
      <el-form :inline="true" :model="search" class="form-container" size="small">
        <el-form-item label="IP姓名">
          <!-- <el-input v-model="search.name" style="width: 194px" /> -->
          <teacherInput
            v-model="search.teacherId"
            :config="{api: teacherDraftQueryByName,nameKey: 'teacherName',isOrgTransferDraft:type ==='transfer'}"
            @clear="searchFn"
            @select="searchFn()"
            @keyup.enter.native="searchFn"
          />
        </el-form-item>
        <el-form-item label="所属领域">
          <el-select v-model="search.domainId" clearable @change="searchFn()" @clear="searchFn">
            <el-option
              v-for="(item, index) in areaOption"
              :key="index"
              :label="item.domainName"
              :value="item.domainId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="createTimeValue"
            type="daterange"
            style="width:228px"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="handleCreateChange"
            @blur="currentTime = ''"
          />
        </el-form-item>
        <el-form-item class="form-item">
          <div class="search_box">
            <el-button type="primary" :loading="loading" @click="searchFn()">查询</el-button>
            <el-button :loading="loading" @click="clear">重置</el-button>
            <div class="search_right">
              <el-button
                v-if="permsList.includes('web:teachFileList:add')"
                :loading="loading"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="gotoAdd"
              >新增IP</el-button>
              <el-button
                v-if="permsList.includes('web:teachFileList:import')"
                class="fr m-l-10"
                size="small"
                @click="openUpdate"
              >导入IP</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>

    </div>
    <!-- 师资档案 -->
    <MPageLayout
      ref="MPageLayout"
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
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-if="permsList.includes('web:teachFileDraftList:detail')"
          type="text"
          @click="gotoDetail(row)"
        >详情</el-button>
        <el-button
          v-if="permsList.includes('web:teachFileDraftList:edit')"
          type="text"
          @click="gotoEdit(row)"
        >编辑</el-button>
        <el-button
          v-if="permsList.includes('web:teachFileDraftList:del')"
          type="text"
          style="color:#F53F3F"
          @click="handleDel(row)"
        >删除</el-button>
      </template>
      <template slot="photoUrl" slot-scope="{ row }">
        <div class="photoUrl">
          <ImagePreviewer
            :preview-src-list="[row.photoUrl]"
            fit="contain"
            :src="row.photoUrl"
            style="width: 100%; height: 100%"
            :scale-width="70"
            :scale-height="80"
            error-slot
          >
            <img
              slot="error"
              src="@/assets/image/tupianjiazaishibai.png"
              alt=""
              style="width: 100%; height: 100%"
            />
          </ImagePreviewer>
        </div>
      </template>
      <template slot="experience" slot-scope="{ row }">
        <el-tooltip effect="dark" placement="top" width="400">
          <div slot="content" v-html="row.experience ? row.experience.replace(/\n/g, '<br />') : ''" />
          <span class="experience">
            {{ row.experience }}
          </span>
        </el-tooltip>
      </template>
    </MPageLayout>
    <assessDialog ref="assessDialog" />
    <update ref="update" />
  </div>
</template>

<script>
import teacherInput from '../../components/teacherSelect/index'
import { ASSESS_TYPES, ASSESS_RESULT_All } from '../../enum'
import { mapGetters } from 'vuex'
import { teacherDraftList, teacherDraftDel, teacherDraftQueryByName } from '@/api/tearchCenter/index'
import assessDialog from '../assessDialog'
import update from './update'
import { getDict } from '@/utils/index'
export default {
  components: {
    teacherInput,
    assessDialog,
    update
  },
  props: {
    type: {
      type: String,
      default: 'draft'
    }
  },
  data() {
    return {
      teacherDraftQueryByName,
      COOPERATION_TYPE: [], // 合作状态
      ASSESS_TYPES: [...ASSESS_TYPES, { label: '无需评估', value: 4 }], // 评估状态
      ASSESS_RESULT_All,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'photoUrl', 'domains', 'experience'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'teacherId', label: 'IP草稿ID', type: 'text' },
          { prop: 'teacherName', label: 'IP姓名', type: 'text' },
          { prop: 'photoUrl', label: 'IP照片', type: 'slot' },
          { prop: 'domains', label: '所属领域', type: 'text', 'show-overflow-tooltip': true, slotFn: (row) => row.domains?.map(i => i.domainName)?.join('、') },
          { prop: 'experience', label: 'IP资质', type: 'slot' },
          {
            prop: 'createUserName',
            label: this.type === 'draft' ? '创建人' : '转出机构',
            type: 'text',
            width: 140,
            slotFn: (row) => {
              return this.type === 'draft' ? row.createUserName : row.transferFromOrgName
            }
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text',
            width: 140,
            align: 'center'
          },
          { prop: 'action', label: '操作', width: 180, type: 'slot' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        teacherId: '', // IP姓名
        domainId: '', // 所属领域
        createTimeBegin: '',
        createTimeEnd: ''
      },
      createTimeValue: [],
      currentTime: '',
      pickerOptions: {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            // 一年以内
            const one = 365 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            const minTime = this.currentTime - one
            const maxTime = this.currentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      loading: false,
      permsList: []
    }
  },
  computed: {
    ...mapGetters(['areaOption', 'permission_routes'])
  },
  activated() {
    this.init()
  },
  mounted() {
    this.init()
  },
  methods: {
    // 获取领域数据
    async getAreaList() {
      this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
      await this.$store.dispatch('option/getAreaOption')
    },
    init() {
      this.permission_routes.forEach(i => {
        if (i.path === '/teacherCenter') {
          i.children.forEach(j => {
            if (j.path === 'teachFile') {
              j.children.forEach(z => {
                if (z.path === 'draftList') {
                  this.permsList = z.meta.permsList
                }
              })
            }
          })
        }
      })
      if (this.$route.query.query) {
        this.search = {
          teacherId: '', // IP姓名
          domainId: '' // 所属领域
        }
      }
      this.getAreaList()
      this.getList()
    },
    handleCreateChange(val) {
      if (val && val.length) {
        this.search.createTimeBegin = val[0]
        this.search.createTimeEnd = val[1]
      } else {
        this.search.createTimeBegin = undefined
        this.search.createTimeEnd = undefined
      }
      this.searchFn()
    },
    // 搜索查询
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 多选触发
    handleSelectionChange() {},
    // 点击跳转详情页面
    gotoDetail(row) {
      this.$router.push(`/teacherCenter/teachFile/detail/${row.teacherId}?draft=true`)
    },
    handleDel(row) {
      this.$delModal({
        tips: `确定删除该老师档案？`,
        success: () => {
          this.loading = true
          teacherDraftDel(row.teacherId)
            .then((res) => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 跳转新增IP页面
    gotoAdd() {
      this.$router.push(`/teacherCenter/teachFile/add?draft=true`)
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        teacherId: this.search.teacherId, // IP姓名
        domainId: this.search.domainId, // 所属领域编码
        createTimeBegin: this.search.createTimeBegin,
        createTimeEnd: this.search.createTimeEnd,
        isOrgTransferDraft: this.type && this.type === 'transfer'
      }
      teacherDraftList(params)
        .then((res) => {
          this.loading = false
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.$refs.MPageLayout.doLayout()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 清空筛选数据
    clear() {
      this.search = {
        teacherId: '', // IP姓名
        domainId: '' // 所属领域
      }
      this.searchFn()
    },
    // 点击跳转编辑页面
    gotoEdit(row) {
      this.$router.push(`/teacherCenter/teachFile/edit/${row.teacherId}?draft=true`)
    },
    openUpdate() {
      this.$refs.update.open()
    },
    // 显示所属领域
    showDomains(row) {
      let str = ''
      row.map((v) => {
        str += v.domainName + ' '
      })
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap1 ::v-deep{
  // height: 100%;
  height: calc(100vh - 164px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-top: 10px;
  .search {
    margin-left: 20px;
    margin-right: 20px;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .form-container{
      display: flex;
      flex-wrap: wrap;
      .form-item{
        flex: 1;
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
  .tablePage{
    height: 600px;
  }
}
.photoUrl {
  width: 70px;
  height: 80px;
  border-radius: 4px;
  background: rgb(250, 250, 250);
}
.experience {
  width: 135px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

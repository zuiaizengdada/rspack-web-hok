<template>
  <!-- 跟进池 -->
  <div class="pageWrap">
    <div v-loading="loading" class="myTable">
      <el-table
        :data="list"
        style="width: 100%"
        height="100%"
        :header-cell-style="{ background: '#f5f5f5' }"
        @sort-change="sortChange"
      >
        <!-- <el-table-column prop="teacherId" label="IPID" /> -->
        <el-table-column prop="photoUrl" label="IP头像">
          <template slot-scope="{ row }">
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
        </el-table-column>
        <el-table-column prop="teacherName" label="IP姓名" />
        <el-table-column prop="domains" label="所属领域" width="160px">
          <template slot-scope="{ row }">
            {{ row.domains | renderDomain }}
          </template>
        </el-table-column>
        <el-table-column prop="experience" label="IP资质" width="130px">
          <template slot-scope="{ row }">
            <template v-if="row.experience && row.experience.length > 15">
              <el-tooltip class="item" effect="dark" :content="row.experience" placement="top" popper-class="mw_400">
                <div>
                  {{
                    row.experience.length > 10
                      ? `${row.experience.slice(0, 10)}...`
                      : row.experience.slice(0, 10)
                  }}
                </div>
              </el-tooltip>
            </template>
            <span v-else>{{ row.experience }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" width="80px" />
        <el-table-column prop="orgName" label="创建人所属机构" width="130px" align="center" />
        <el-table-column prop="createTime" label="创建日期" align="center">
          <template slot-scope="{ row }">
            {{
              parseTime(
                new Date(row.createTime).getTime(),
                '{y}-{m}-{d} {h}:{i}:{s}'
              ) || '—'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="assessStatus" label="评估状态" align="center">
          <template slot-scope="{ row }">
            {{ row.assessStatus | getOptionsValue(ASSESS_TYPES) }}
          </template>
        </el-table-column>
        <el-table-column prop="assessResult" label="评估结果" align="center" sortable="custom">
          <template slot-scope="{row}">
            <el-button
              v-if="row.overallRating !== null && row.overallRating !== undefined && +row.assessStatus === 3"
              type="text"
            >
              {{ (row.overallRating / 100) + '分' }}
            </el-button>
            <span v-else>{{ getOptionsValue(+row.mergeResult, ASSESS_RESULT_OTHER) || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cooperateStatus" label="合作状态" align="center">
          <template slot-scope="{ row }">
            {{ row.cooperateStatus | getOptionsValue(COOPERATION_TYPE) }}
          </template>
        </el-table-column>
        <el-table-column prop="followUserName" label="跟进人" align="center" width="80px" />
        <el-table-column
          prop="followOrgName"
          label="跟进人所属机构"
          width="130px"
          align="center"
        />
        <el-table-column
          prop="followTime"
          label="最后跟进时间"
          align="center"
        >
          <template slot-scope="{ row }">
            {{
              parseTime(
                new Date(row.followTime).getTime(),
                '{y}-{m}-{d} {h}:{i}:{s}'
              ) || '—'
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="action"
          label="操作"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="gotoDetail(row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        :current-page="search.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ASSESS_TYPES, ASSESS_RESULT_OTHER } from '../enum'
import { getDict } from '@/utils/index'
import { parseTime } from '@/utils/index'
import { getOptionsValue } from '@/filters'
export default {
  components: {},
  filters: {
    renderDomain(arr) {
      if (!arr || !arr.length) {
        return ''
      }
      return arr.map(i => i.domainName).join('、')
    }
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          cooperateStatus: '', // 跟进状态
          followerId: '', // 跟进人Id
          followerName: '', // 跟进人姓名
          teacherRealName: '', // 老师真实姓名
          tenantId: '', // 跟进人所属机构id
          pageIndex: 1,
          pageSize: 10,
          assessResultOrderByDesc: undefined
        }
      }
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      COOPERATION_TYPE: [],
      ASSESS_RESULT_OTHER,
      ASSESS_TYPES: [...ASSESS_TYPES, { label: '无需评估', value: 4 }] // 评估状态
    }
  },
  async mounted() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
  },
  methods: {
    parseTime,
    getOptionsValue,
    sortChange({ prop, order }) {
      if (prop === 'assessResult') {
        this.search.assessResultOrderByDesc = order === 'descending'
        this.$emit('search', this.search)
      }
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.search.pageIndex = 1
      this.$emit('search', this.search)
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val
      this.$emit('search', this.search)
    },
    // 点击跳转详情页面
    gotoDetail(row) {
      this.$router.push(`/teacherCenter/newTeacherSharing/newDetail/${row.teacherId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.pageWrap {
  height: 100%;
  .myTable {
    @include responsive-height(200px);
    flex: 1 0 0;
    padding: 20px 20px 0;
  }
  .pagination {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
  }
}
.photoUrl {
  width: 70px;
  height: 80px;
  border-radius: 4px;
  background: rgb(250, 250, 250);
}
.text{
  max-width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

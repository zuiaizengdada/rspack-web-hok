<template>
  <!-- 公海池 -->
  <div class="pageWrap">
    <div v-loading="loading" class="myTable">
      <el-table
        :data="list"
        style="width: 100%"
        height="100%"
        :header-cell-style="{ background: '#f5f5f5' }"
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
        <el-table-column prop="teacherRealName" label="IP真实姓名" />
        <el-table-column prop="domains" label="所属领域">
          <template slot-scope="{ row }">
            {{ row.domains | renderDomain }}
          </template>
        </el-table-column>
        <el-table-column prop="experience" label="IP资质" />
        <el-table-column prop="followUserName" label="跟进人" align="center" />
        <el-table-column
          prop="followUserTenantName"
          label="跟进人所属机构"
          align="center"
        />
        <el-table-column
          prop="finalFollowTime"
          label="最后跟进时间"
          align="center"
        >
          <template slot-scope="{ row }">
            {{
              parseTime(
                new Date(row.finalFollowTime).getTime(),
                '{y}-{m}-{d} {h}:{i}:{s}'
              ) || '—'
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="finalFollowStatus"
          label="最后跟进状态"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.finalFollowStatus | getOptionsValue(COOPERATION_TYPE) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="{ row }">
            <el-button type="text" @click="onhandleFollowDetail(row)">
              查看跟进记录
            </el-button>
            <el-button type="text" @click="onhandleGet(row)">领取</el-button>
            <!-- <el-button type="text" @click="onhandleClaimRecord">领取记录</el-button> -->
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
import Dialog from './Dialog/index.js'
import Drawer from './Drawer/index.js'
import { getDict } from '@/utils/index'
import { parseTime } from '@/utils/index'
import { getTeacherCheck } from '@/api/tearchCenter/tearchSharing.js'
import { getTeacher } from '@/api/tearchCenter/tearchSharing'
export default {
  filters: {
    renderDomain(arr) {
      if (!arr || !arr.length) {
        return ''
      }
      return arr.map(i => i.domainName).join('、')
    }
  },
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          poolType: 1, // 池子类型 1-跟进池 2-共享池
          cooperateStatus: '', // 跟进状态
          followerId: '', // 跟进人Id
          followerName: '', // 跟进人姓名
          teacherRealName: '', // 老师真实姓名
          tenantId: '', // 跟进人所属机构id
          pageIndex: 1,
          pageSize: 10
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
      COOPERATION_TYPE: []
    }
  },
  async mounted() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
  },
  methods: {
    parseTime,
    handleSizeChange(val) {
      this.search.pageSize = val
      this.search.pageIndex = 1
      this.$emit('search', this.search)
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val
      this.$emit('search', this.search)
    },
    // 点击查看跟进记录
    onhandleFollowDetail(row) {
      Drawer.open({
        visible: true,
        type: 'DrawerDetail',
        teacherId: row.teacherId,
        row: row,
        activeName: 'followDetail',
        success: () => {
          this.onhandleGet(row)
          // Drawer.close()
          // console.log(this.search, 'this.search')
          // this.$emit('search', this.search)
        }
      })
    },
    // 点击领取按钮
    onhandleGet(row) {
      console.log(row)
      const data = {
        sharingTeacherId: row.teacherId
      }
      getTeacherCheck(data).then(res => {
        if (res.data) {
          this.$delModal({
            sureBtnText: '确认领取',
            sureBtnBgColor: '#0C6FFF',
            tips: `该IP已存在本机构的师资档案中，请确认领取！`,
            success: () => {
              Drawer.close()
              // Dialog.open({
              //   visible: true,
              //   type: 'GetDialog',
              //   row: row,
              //   teacherId: row.teacherId,
              //   success: () => {
              //     console.log(this.search, 'this.search')
              //     this.$emit('search', this.search)
              //   }
              // })
              const data = {
                sharingTeacherId: row.teacherId
              }
              getTeacher(data).then(res => {
                this.$emit('search', this.search)
              })
            }
          })
        } else {
          Drawer.close()
          Dialog.open({
            visible: true,
            type: 'GetDialog',
            row: row,
            teacherId: row.teacherId,
            success: () => {
              console.log(this.search, 'this.search')
              this.$emit('search', this.search)
            }
          })
        }
      })
    },
    // 点击领取记录按钮
    onhandleClaimRecord(row) {
      Drawer.open({
        visible: true,
        type: 'DrawerDetail',
        teacherId: row.teacherId,
        row: row,
        activeName: 'claimRecord',
        success: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.pageWrap {
  height: 100%;
  /* display: flex;
  flex-direction: column; */
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
</style>

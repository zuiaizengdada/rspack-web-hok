<template>
  <!-- 计划看播用户 -->
  <div class="planWatchusers">
    <div class="planWatchusersHeader">
      <div class="planWatchusersTab">
        <div
          v-for="item in tabList"
          :key="item.value"
          :class="{ active: item.value === activeTab }"
          class="planWatchusersTabItem"
          @click="activeTab = item.value"
        >
          {{ item.label }}
        </div>
      </div>
      <div>
        <el-button
          v-if="isTaskLinks"
          size="small"
          type="primary"
          :loading="loading"
          @click="onhandleRelatedTasks"
        >
          关联任务线索
        </el-button>
        <el-button
          v-if="isExcel"
          size="small"
          type="primary"
          @click="onhandleAdd"
        >
          新增
        </el-button>
        <el-button
          v-if="isAdd"
          class="btn_primary"
          size="small"
          @click="onhandleExcel"
        >
          导入Excel
        </el-button>
      </div>
    </div>
    <div class="planWatchusersContent">
      <components
        :is="activeTab"
        ref="planWatchusersContent"
        :user-array="userArray"
      />
    </div>
  </div>
</template>

<script>
import relatedTaskClues from './relatedTaskClues'
import clueImportUsers from './clueImportUsers'
import Dialog from '@/views/live/Dialog/index.js'
import Dialog2 from '@/views/live/liveRoomV2/Dialog/index.js'
import { relationTaskEdit } from '@/api/liveRoom/index.js'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    relatedTaskClues,
    clueImportUsers
  },
  props: {
    userArray: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      activeTab: '',
      liveRoomId: this.$route.params.id,
      tabList: [
        // { label: '关联任务线索', value: 'relatedTaskClues' },
        // { label: '导入用户', value: 'clueImportUsers' }
      ]
      // permsList: []
    }
  },
  inject: ['permsList'],
  computed: {
    ...mapGetters(['smsAreaList', 'mailSuffixesList', 'permission_routes']),
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    }),
    isAdd() {
      return (
        this.permsList.includes('btn:liveRoomV2:viewerProfile:addUser') &&
        this.activeTab === 'clueImportUsers'
      )
    },
    isExcel() {
      return (
        this.permsList.includes(
          'btn:liveRoomV2:viewerProfile:importExcelUser'
        ) && this.activeTab === 'clueImportUsers'
      )
    },
    isTaskLinks() {
      return (
        this.permsList.includes('btn:liveRoomV2:viewerProfile:taskLinks') &&
        this.activeTab === 'relatedTaskClues'
      )
    }
  },
  watch: {
    tabList: {
      handler(val) {
        if (val.length > 0) {
          this.activeTab = val[0].value
        }
      },
      deep: true,
      immediate: true
    },
    permsList: {
      handler(val) {
        if (val.length > 0) {
          this.setTabList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setTabList() {
      if (
        this.permsList.includes('menu:liveRoomV2:viewerProfile:taskLinksPage')
      ) {
        this.tabList.push({ label: '关联任务线索', value: 'relatedTaskClues' })
      }
      if (this.permsList.includes('menu:liveRoomV2:viewerProfile:userPage')) {
        this.tabList.push({ label: '导入用户', value: 'clueImportUsers' })
      }
      this.type = this.permsList.includes(
        'menu:liveRoomV2:viewerProfile:taskLinksPage'
      )
        ? 'relatedTaskClues'
        : 'clueImportUsers'
    },
    // 点击关联任务
    onhandleRelatedTasks() {
      const ls =
        this.liveRoomDetail.taskList?.map(m => ({ ...m, id: m.taskId })) || []
      Dialog.open({
        type: 'SelectTask',
        selectList: ls,
        success: res => {
          console.log(res, 'res')
          Dialog.close()
          this.loading = true
          const data = {
            liveRoomId: this.liveRoomId,
            taskList: res
          }
          relationTaskEdit(data)
            .then(() => {
              return this.$store.dispatch(
                'im/getLiveRoomDetail',
                this.$route.params.id
              )
            })
            .then(() => {
              this.loading = false
              this.$refs.planWatchusersContent &&
                this.$refs.planWatchusersContent.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击新增
    onhandleAdd() {
      Dialog2.open({
        type: 'LiveRoomSettingsAddUser',
        liveRoomId: this.$route.params.id,
        smsAreaList: this.smsAreaList,
        mailSuffixesList: this.mailSuffixesList,
        success: res => {
          // Dialog2.close()
          this.$message.success('新增成功')
          this.$refs.planWatchusersContent &&
            this.$refs.planWatchusersContent.searchFn()
        }
      })
    },
    // 点击导入Excel
    onhandleExcel() {
      Dialog2.open({
        type: 'ExportLiveRoomSettings',
        liveRoomId: this.$route.params.id,
        selectList: [],
        success: res => {
          Dialog2.close()
          this.$message.success('导入成功')
          this.$refs.planWatchusersContent &&
            this.$refs.planWatchusersContent.searchFn()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.planWatchusers {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 15px 0;
  .planWatchusersHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .planWatchusersTab {
      background: #f0f0f0;
      display: flex;
      padding: 2.61px 3.36px 3.36px;
      border-radius: 4px;
      .planWatchusersTabItem {
        width: 130px;
        height: 26px;
        line-height: 26px;
        color: #000000;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        text-align: center;
        cursor: pointer;
      }
      .active {
        color: #0c6fff;
        background: #fff;
        border-radius: 2px;
      }
    }
  }
  .planWatchusersContent {
    flex: 1 0 0;
  }
}
</style>

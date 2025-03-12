<template>
  <!-- 计划看播用户 -->
  <div v-if="types.length" class="plan-wrapper">
    <div class="flex flex-between flex-middle">
      <div class="change-type">
        <div
          v-for="item in types"
          :key="item.active"
          :class="{ active: item.active === type }"
          @click="changeType(item.active)"
        >
          {{ item.name }}
        </div>
      </div>
      <div>
        <template v-if="type === '1'">
          <el-button
            v-if="isTaskLinks"
            type="primary"
            size="small"
            @click="clickType"
          >
            关联任务线索
          </el-button>
        </template>
        <template v-if="type === '2'">
          <el-button
            v-if="isAdd"
            type="primary"
            size="small"
            @click="onhandleAdd"
          >
            新增
          </el-button>
          <el-button
            v-if="isExcel"
            type="primary"
            size="small"
            @click="clickType"
          >
            导入Excel
          </el-button>
        </template>
      </div>
    </div>
    <div style="margin-top: 20px">
      <relatedTaskClues v-if="type === '1'" ref="relatedTaskCluesRef" />
      <exportUser v-else ref="exportUserRef" />
    </div>
  </div>
</template>

<script>
import relatedTaskClues from './components/relatedTaskClues'
import exportUser from './components/exportUser'
import Dialog from '@/views/smartSales/privateLive/room/components/Dialog/index.js'
import { relationTaskEdit, getLiveRoomInfo } from '@/api/liveRoom/index'
import { mapGetters } from 'vuex'
export default {
  components: { relatedTaskClues, exportUser },
  data() {
    return {
      type: '-1',
      liveRoomDetail: {},
      permsList: [],
      types: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'smsAreaList',
      'mailSuffixesList',
      'permission_routes'
    ]),
    isAdd() {
      return this.permsList.includes('btn:liveDetail:viewerProfile:add')
    },
    isExcel() {
      return this.permsList.includes('btn:liveDetail:viewerProfile:excel')
    },
    isTaskLinks() {
      return this.permsList.includes('btn:liveDetail:viewerProfile:taskLinks')
    }
  },
  created() {
    this.permsList = this.getPermsList()
    this.setTypes()
    this.getDetail()
  },
  methods: {
    // 获取直播详情 配置权限
    getPermsList(key) {
      let permsList = []
      const obj = this.permission_routes.find(v => v.path === '/privateLive')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'room/detail/:id')
        if (o) {
          permsList = o.meta.permsList || []
        }
      }
      this.type = permsList.includes(
        'menu:liveDetail:viewerProfile:taskLinksPage'
      )
        ? '1'
        : '2'
      return permsList
    },
    setTypes() {
      if (
        this.permsList.includes('menu:liveDetail:viewerProfile:taskLinksPage')
      ) {
        this.types.push({
          name: '关联任务线索',
          active: '1'
        })
      }
      if (this.permsList.includes('menu:liveDetail:viewerProfile:userPage')) {
        this.types.push({
          name: '导入用户',
          active: '2'
        })
      }
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        const params = {
          liveRoomId: this.$route.params.id
        }
        getLiveRoomInfo(params)
          .then(res => {
            this.liveRoomDetail = { ...res.data }
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 点击新增
    onhandleAdd() {
      Dialog.open({
        liveRoomId: this.$route.params.id,
        type: 'LiveRoomSettingsAddUser',
        smsAreaList: this.smsAreaList,
        mailSuffixesList: this.mailSuffixesList,
        selectList: [],
        success: res => {
          if (res) {
            Dialog.close()
          }
          this.$message.success('新增成功')
          this.$refs.exportUserRef.searchFn()
        }
      })
    },
    // 点击导入Excel
    onhandleExcel() {
      Dialog.open({
        type: 'ExportLiveRoomSettings',
        liveRoomId: this.$route.params.id,
        selectList: [],
        success: res => {
          Dialog.close()
          this.$message.success('导入成功')
          this.$refs.exportUserRef.searchFn()
        }
      })
    },
    clickType() {
      if (this.type === '1') {
        const ls =
          this.liveRoomDetail.taskList?.map(m => ({ ...m, id: m.taskId })) || []
        Dialog.open({
          type: 'SelectTask',
          selectList: ls,
          success: res => {
            Dialog.close()
            const list = res.map(m => ({
              taskCreateId: m.taskCreateId,
              taskId: m.taskId,
              taskName: m.taskName
            }))
            relationTaskEdit({
              liveRoomId: this.$route.params.id,
              taskList: list
            }).then(() => {
              this.getDetail().then(() => {
                this.$refs.relatedTaskCluesRef.searchFn()
              })
            })
          }
        })
      } else {
        this.onhandleExcel()
      }
    },
    changeType(val) {
      if (val === this.type) return
      this.type = val
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-wrapper {
  width: 100%;
  .change-type {
    display: flex;
    align-items: center;
    width: auto;
    padding: 3px;
    height: 32px;
    border-radius: 4px;
    background: #f0f0f0;
    cursor: pointer;
    user-select: none;
    div {
      /* width: 50%; */
      text-align: center;
      color: #000;
      font-size: 14px !important;
      width: 130px;
    }
    .active {
      padding-top: 2px;
      height: 26px;
      border-radius: 4px;
      color: #0c6fff;
      background: #fff;
    }
  }
}
</style>

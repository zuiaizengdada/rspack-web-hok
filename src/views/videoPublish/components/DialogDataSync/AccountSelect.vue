<!-- 选择检测成功账号 -->
<template>
  <div class="account-select">
    <div class="flex flex-between flex-middle">
      <span class="flex">
        <el-radio-group v-model="syncType" @change="changeSelect">
          <el-radio :label="1">今日未同步账号</el-radio>
          <el-radio :label="2">全部账号</el-radio>
        </el-radio-group>
      </span>
      <span>
        <span
          v-if="synchronizingNums"
          class="synchronizingNums"
        >正在同步（{{ synchronizingNums }}）</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            :loading="loading"
            :disabled="!checkedNum"
            style="margin-left: 12px"
            @click="syncData(multipleSelection)"
          >同步数据 {{ checkedNum > 0 ? `(${checkedNum})` : '' }}</el-button>
        </span>
      </span>
    </div>
    <el-table
      v-if="flag"
      ref="multipleTable"
      class="custom-table overflowOuto"
      :data="accountList"
      style="width: 100%"
      :header-cell-style="{ background: '#F3F3F3' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectableMethod"
      />
      <el-table-column
        v-for="item in columns"
        :key="item.label"
        :label="item.label"
        :prop="item.prop"
      >
        <template slot-scope="scope">
          <span v-if="item.prop === 'name'" class="flex flex-middle">
            <img :src="scope.row.avatar" alt="" class="avatarImg" />
            <span style="margin-left: 12px">{{ scope.row[item.prop] }}</span>
          </span>
          <span v-else-if="item.prop === 'platformId'">
            {{ platformList[scope.row.platformId] }}
          </span>
          <span v-else-if="item.prop === 'isExpire'">
            <span v-if="!scope.row.isExpire" style="color: #00b42a">
              已授权
            </span>
            <span v-else style="color: #f53f3f">
              未授权
              <el-button
                type="primary"
                plain
                size="mini"
                :loading="scope.row.loading"
                @click="toLgoinNow(scope.row)"
              >立即授权</el-button>
            </span>
          </span>
          <span
            v-else-if="item.prop === 'syncStatus'"
            :class="`syncStatus${scope.row.syncStatus}`"
          >
            <i v-if="scope.row.syncStatus === 1" class="el-icon-loading" />
            {{ syncStatusMap[scope.row.syncStatus] }}
            <el-button
              v-if="
                (scope.row.syncStatus === 3 || scope.row.syncStatus === 4) &&
                  !scope.row.isExpire
              "
              type="primary"
              plain
              size="mini"
              @click="syncData([scope.row])"
            >立即同步</el-button>
          </span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { columns } from './columns'
import { platformList } from '@/utils/enum'
import { mapGetters } from 'vuex'
import {
  getPlatformLogin,
  checkLogin,
  updateLoginStatus,
  insertSyncStatus,
  qrySyncStatus
} from '@/api/videoManagement/accountManage'
import { qryLoginMerchant, updateSyncTime } from '../../publish/api/index'
import { isGreaterThan, isUseNewClient, isNewClient } from '@/utils/index'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns,
      platformList,
      syncStatusMap: {
        1: '同步中',
        2: '已同步',
        3: '未同步',
        4: '同步失败'
      },
      multipleSelection: [],
      envList: {
        development: 'https://dev.cloud.hokkj.cn',
        staging: 'https://dev.cloud.hokkj.cn',
        test: 'https://test.cloud.hokkj.cn',
        beta: 'https://beta.cloud.hokkj.cn',
        production: 'https://cloud.hokkj.cn'
      },
      synchronizingNums: 0,
      isAllSelect: false,
      syncType: 1,
      isIndeterminate: false,
      accountList: [],
      flag: true,
      merchantData: {},
      timer: null,
      loading: false,
      behaviorTime: 0,
      behaviorTimer: null,
      checkedNum: 0
    }
  },
  computed: {
    ...mapGetters([
      'isNewSocketVideoPublish',
      'allChannelSwitch',
      'syncDataConfig',
      'fuxiVersion'
    ])
  },
  watch: {
    list(val) {
      this.initList(val)
    }
  },
  methods: {
    isGreaterThan,
    // 初始化数组
    initList(val) {
      // 新加一个loading字段
      val.forEach(item => {
        item.loading = false
      })
      this.accountList = Object.assign([], val)
      console.log(this.accountList, 'this.accountList')
      // isExpire为true的数据排到前面
      this.accountList.sort((a, b) => {
        return b.isExpire - a.isExpire
      })
      this.synchronizingNums = val.filter(item => item.syncStatus === 1).length
      this.getLoginMerchant()
      this.qrySyncStatus(val)
      setTimeout(() => {
        this.changeSelect(1)
      }, 100)
    },
    // 定时查询列表所有同步中账号同步状态
    async qrySyncStatus(val) {
      const list = val.filter(item => item.syncStatus === 1)
      this.synchronizingNums = list.length
      if (list.length) {
        const res = await qrySyncStatus({
          platformAccountIds: list.map(item => item.platformAccountId)
        })
        if (res.success) {
          this.accountList.forEach(item => {
            res.data.forEach(item2 => {
              if (item.platformAccountId === item2.platformAccountId) {
                item.syncStatus = item2.status
                item.lastSyncDateTime = item2.lastSyncDateTime
              }
            })
          })
          this.synchronizingNums = this.accountList.filter(
            item => item.syncStatus === 1
          ).length
          if (!this.synchronizingNums) {
            this.changeSelect(this.syncType)
          }
          this.timer = setTimeout(() => {
            this.qrySyncStatus(this.accountList)
          }, 10000)
        }
      }
    },
    clearQrySyncStatus() {
      clearTimeout(this.timer)
    },
    async getLoginMerchant() {
      const res = await qryLoginMerchant()
      this.merchantData = res.data
    },
    async updateSyncTimeApi(data) {
      const { accountId, platformId } = data
      await updateSyncTime({ accountId, platformId })
    },
    handleSelectionChange(val) {
      console.log(val, '选中的数据')
      this.multipleSelection = val
      this.checkedNum = val.length
    },
    updataLoading(id) {
      this.accountList.forEach(item => {
        if (item.platformAccountId === id) {
          item.loading = !item.loading
        }
      })
    },
    toLgoinNow(row) {
      const isSocket = this.isNewSocketVideoPublish
      this.updataLoading(row.platformAccountId)
      if (isSocket) {
        getPlatformLogin().then(async res => {
          console.log(res, '用户登录之前获取merchantToken')
          if (res.success) {
            let loginResponse = ''
            const merchantToken = res.data.merchantToken
            // 登录账号
            const params = {
              accountId: res.data.accountId,
              merchantId: res.data.merchantId,
              platformId: row.platformId,
              merchantToken,
              cookie: null,
              newVersion: this.allChannelSwitch[row.platformId],
              authorizationModel: true
            }
            this.$store.dispatch('videoManage/saveErrorInfo', {
              platformAccountId: row.platformAccountId,
              requestParam: row.cookie,
              planId: row.platformId,
              apiUrl: 'account-login',
              errorInfo: '登录之前的日志记录'
            })
            const checkObj = { ...row, remark: '登录自媒体账号' }
            const cookieRes = await this.$store.dispatch('videoManage/checkCookie', checkObj)
            if (cookieRes) {
              row.cookie = cookieRes
              this.updataList(row)
              return
            }
            this.updataLoading(row.platformAccountId)
            try {
              isUseNewClient(row.platformId, 'account-login', row.platformAccountId, '登录自媒体账号').emit(
                'account-login',
                JSON.stringify(params),
                response => {
                  loginResponse = JSON.parse(response)
                  console.log('loginReeeeeeeee:', loginResponse)
                  if (loginResponse.code === 200) {
                    const userInfo = loginResponse.data?.userInfo ? JSON.parse(loginResponse.data?.userInfo) : null
                    const short_id = userInfo?.unique_id || userInfo?.short_id
                    const paramsSecord = {
                      authorId: loginResponse.data.authorId,
                      platformAccountId: row.platformAccountId
                    }
                    this.$store.dispatch('videoManage/saveErrorInfo', {
                      platformAccountId: row.platformAccountId,
                      requestParam: loginResponse.data.cookie,
                      planId: row.platformId,
                      apiUrl: 'account-login',
                      errorInfo: '登录之后的日志记录'
                    })
                    checkLogin(paramsSecord).then(res => {
                      if (res.success) {
                        const paramsd = {
                          loginStatus: 2,
                          cookie: loginResponse.data.cookie,
                          platformAccountId: row.platformAccountId,
                          remark: '登录自媒体账号',
                          uniqueId: short_id,
                          type: 1
                        }
                        row.cookie = loginResponse.data.cookie
                        this.updataList(row)
                        updateLoginStatus(paramsd).then(res => {
                          if (res.success) {
                            this.$message.success('登录成功！')
                            this.$store.dispatch(
                              'videoManage/syncAccountData',
                              row.platformAccountId
                            )
                          }
                        })
                      }
                    })
                  } else {
                    this.$message.error(loginResponse.message)
                  }
                }
              )
            } catch (err) {
              console.log(err, '错误')
            }
          }
        })
      }
    },
    updataList(row) {
      this.flag = false
      this.accountList.forEach(item => {
        if (
          item.platformAccountId === row.platformAccountId
        ) {
          item.cookie = row.cookie
          item.isExpire = false
        }
      })
      this.$nextTick(() => {
        this.flag = true
        setTimeout(() => {
          this.changeSelect(1)
        }, 100)
      })
    },
    // 改变选中
    changeSelect(val) {
      this.$refs.multipleTable.clearSelection()
      if (val === 1) {
        const arr = this.accountList.filter(
          item =>
            !item.isExpire && (item.syncStatus === 3 || item.syncStatus === 4)
        )
        arr.forEach((item, index) => {
          this.$refs.multipleTable.toggleRowSelection(item)
        })
      } else {
        const arr = this.accountList.filter(item => !item.isExpire)
        arr.forEach((item, index) => {
          this.$refs.multipleTable.toggleRowSelection(item)
        })
      }
      this.checkedNum = this.$refs.multipleTable.selection.length
    },
    selectableMethod(row) {
      // 选中或者取消
      return !row.isExpire
    },
    // 同步配置需要模拟点击渠道数据
    synConfigData(configList) {
      // 模拟用户行为
      this.syncDataConfig.forEach(item => {
        configList.forEach(item1 => {
          if (item.platformId === item1.platformId) {
            item1.urls = item.urls
            item1.step = 0
          }
        })
      })
      // 如果五秒钟内没有返回则默认走完了所有模拟
      this.behaviorTimer = setInterval(() => {
        this.behaviorTime++
        if (this.behaviorTime >= 5) {
          clearInterval(this.behaviorTimer)
          this.behaviorTime = 0
          console.log(configList, '结束了的数据')
          this.syncDataOneByOne(configList)
        }
      }, 1000)
      // 轮流调用urls里面的接口 第一个有返回之后再调用第二个
      configList.forEach(item => {
        console.log(item, 'item555555555555555')
        this.emitBehavior(item, configList)
      })
    },
    async emitBehavior(data, configList) {
      console.log(data, 'chufaleyici')
      const obj = {
        platformId: data.platformId,
        accountId: data.accountId,
        cookie: data.cookie,
        merchantToken: this.merchantData.merchantToken,
        url: data.urls ? data.urls[data.step] : '',
        callbackUrl: isNewClient(data.platformId) ? this.envList[process.env.NODE_ENV] + '/cloud/edata-wemedia/open/callbackUpdateCookie' : ''
      }
      console.log(obj, '模拟用户行为参数。。。')
      isUseNewClient(obj.platformId, 'keep-online-sync', obj.platformAccountId, '模拟用户行为').emit(
        'keep-online-sync',
        JSON.stringify(obj),
        response => {
          const newData = response.data
          console.log(response, '模拟用户行为返回。。。')
          this.behaviorTime = 0
          // 根据账号id找到对应的账号 把step+1
          configList.forEach(item => {
            if (item.accountId === String(newData.authorId)) {
              item.step++
              if (item?.step <= item?.urls?.length - 1) {
                this.emitBehavior(item, configList)
              }
            }
          })
          // 所有账号的步骤都走完了 继续下一步
          const isComplete = configList.every(item => {
            console.log(item, '当前第几步')
            return item.step === item.urls.length
          })
          if (isComplete) {
            clearInterval(this.behaviorTimer)
            console.log(configList, '结束了的数据isComplete')
            this.syncDataOneByOne(configList)
          }
        }
      )
      // window.videoPublishSocket.on('keep-online-complete', async data => {
      //   console.log(JSON.parse(data), 'keep-online-complete')
      // })
    },
    // 间隔30s同步一个数据
    async syncDataOneByOne(list) {
      list.forEach((item, index) => {
        setTimeout(() => {
          this.syncDataformYixiaoer([item])
        }, index * 30000)
      })
    },
    // 传出选中账号数据同步数据
    async syncData(list) {
      console.log(list, '选中的数据')
      // 根据配置读取哪些渠道需要模拟点击
      const configList = []
      const newList = []
      const otherList = []
      this.syncDataConfig.forEach(item => {
        configList.push(item.platformId)
      })
      const platformAccountIds = []

      list.forEach(item => {
        platformAccountIds.push(item.platformAccountId)
        // this.accountList列表中这条数据改为同步中
        this.accountList.forEach(item2 => {
          if (item2.platformAccountId === item.platformAccountId) {
            item2.syncStatus = 1
          }
        })
        // 读取配置是否需要模拟请求 且不是用的新版客户端
        if (configList.includes(item.platformId) && isNewClient(item.platformId)) {
          newList.push(item)
        } else {
          otherList.push(item)
        }
      })
      await insertSyncStatus({
        platformAccountIds: platformAccountIds,
        version: this.fuxiVersion
      })
      if (this.isGreaterThan(this.fuxiVersion, '1.3.2')) {
        if (newList.length) {
          this.synConfigData(newList)
        }
      } else {
        otherList.push(...list)
      }
      this.syncDataformYixiaoer(otherList)
    },
    async syncDataformYixiaoer(list) {
      const syncAccountInfo = []
      const newSyncAccountInfo = []
      list.forEach(item => {
        const { platformId, cookie, platformAccountId } = item
        const obj = {
          accountId: platformAccountId,
          time: new Date().getTime(),
          platformId,
          cookie,
          syncAction: [
            'SyncAccountReportListData',
            'SyncAccountData',
            'SyncAccountNotificationList',
            'SyncAccountContentList'
          ],
          newVersion: this.allChannelSwitch[platformId],
          token: this.merchantData.merchantToken,
          callbackUrl:
            this.envList[process.env.NODE_ENV] +
            '/cloud/edata-wemedia/callBack/syncData',
          startTime: item.startDate,
          endTime: item.endDate
        }
        if (isNewClient(platformId)) {
          newSyncAccountInfo.push(obj)
          this.$store.dispatch('settings/insertApiStat', {
            apiUrl: 'platforms-data-sync',
            remark: '平台数据同步',
            platformAccountId: platformAccountId,
            type: 2
          })
        }
        // else {
        //   syncAccountInfo.push(obj)
        //   this.$store.dispatch('settings/insertApiStat', {
        //     apiUrl: 'platforms-data-sync',
        //     remark: '平台数据同步',
        //     platformAccountId: platformAccountId
        //   })
        // }
      })
      console.log(newSyncAccountInfo, syncAccountInfo, '新版客户端数据同步参数')
      // if (syncAccountInfo.length) {
      //   window.videoPublishSocket.emit(
      //     'platforms-data-sync',
      //     JSON.stringify(syncAccountInfo),
      //     response => {
      //       console.log(response, '数据回传参数返回值')
      //     }
      //   )
      // }
      if (newSyncAccountInfo.length) {
        window.videoPublishNewSocket.emit(
          'platforms-data-sync',
          JSON.stringify(newSyncAccountInfo),
          response => {
            console.log(response, '数据回传参数返回值')
          }
        )
      }
      this.qrySyncStatus(this.accountList)
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-table {
  margin-top: 20px;
  max-height: 500px;
}
.synchronizingNums {
  font-size: 14px;
  font-weight: 400;
  color: #0c6fff;
}
.avatarImg {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #f0f0f0;
}
.syncStatus1 {
  color: #ff7d00;
}
.syncStatus3 {
  color: #f53f3f;
}
.syncStatus2 {
  color: #00b42a;
}
.syncStatus4 {
  color: #f53f3f;
}
.account-select {
  height: 100%;
  padding: 14px 22px;
  box-sizing: border-box;
}
</style>

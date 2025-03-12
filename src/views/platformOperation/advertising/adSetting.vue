<template>
  <MCard class="PageWrap">
    <MBreadRow :title="['平台广告管理', '平台广告设置']" @onClick="onBreadRowClick" />
    <settingDetail :data="detail" />
    <div class="adSetting">
      <div class="adSettingLeft">
        <list ref="list" :loading="loading" :current="current" :data="listData" :if-add="ifAdd" @onhandleAdd="onHandleAdd" @onClick="onHandleSwitch" @dragged="onHandleDragged" />
      </div>
      <div class="adSettingRight">
        <div class="adSettingContent overflowOuto">
          <contentDetail
            ref="contentDetail"
            :terminal-ad-number="TerminalAdNumber"
            :detail="detail"
            :if-add="ifAdd"
            :loading="loading"
            :save-before-fn="saveBeforeFn"
            :current="current"
            @save="onHandleSave"
            @remove="onHandleRemove"
            @refreshList="refreshList"
          />
        </div>
      </div>
    </div>
  </MCard>
</template>

<script>
import settingDetail from './component/settingDetail.vue'
import list from './component/list.vue'
import contentDetail from './component/content.vue'
import { adInfoList, getManagerDetail } from '@/api/platform/advertising'
export default {
  components: {
    settingDetail,
    list,
    contentDetail
  },
  data() {
    return {
      detail: {
        id: '',
        name: '',
        type: '',
        maxNum: '',
        fileFormat: [],
        fileSize: '',
        remark: ''
      },
      ifAdd: true, // 是否新增
      loading: true,
      listData: [],
      // 记录终端已有广告数量
      TerminalAdNumber: {
        mobileTerminal: 0,
        appTerminal: 0,
        douAppleTerminal: 0,
        wxAppleTerminal: 0
      },
      current: '' // 当前操作对象id
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.TerminalAdNumber = { mobileTerminal: 0, appTerminal: 0, douAppleTerminal: 0, wxAppleTerminal: 0 }
      this.loading = true
      Promise.all([this.getDetail(), this.getList()]).then(res => {
        if (this.listData.length > 0) {
          this.listData.forEach(v => {
            for (const key in this.TerminalAdNumber) {
              v[key] === 1 && this.TerminalAdNumber[key]++
            }
          })
        }
        console.log(this.TerminalAdNumber, 'this.TerminalAdNumber')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 顶部点击跳转
    onBreadRowClick(row) {
      row === 0 && (this.$router.replace({ path: '/platformAd/list' }))
    },
    // 获取广告位详情数据
    getDetail() {
      const params = {
        id: this.$route.params.id
      }
      return getManagerDetail(params).then(res => {
        this.detail = {
          ...res.data
        }
      })
    },
    // 获取广告列表数据
    getList() {
      const params = {
        id: this.$route.params.id
      }
      return adInfoList(params).then(res => {
        this.listData = res.data
        if (res.data.length === 0) {
          this.ifAdd = true
        } else {
          if (!this.current) {
            this.$refs.list.onhandleClick(this.listData[0])
          } else {
            const obj = this.listData.find(v => v.id === this.current)
            obj && this.$refs.list.onhandleClick(obj)
          }
        }
      })
    },
    // 列表拖拽触发
    onHandleDragged() {
      this.getList()
    },
    // 列表点击切换触发
    onHandleSwitch(item) {
      // 判断表单是否有改变
      if (this.$refs.contentDetail.ifChange()) {
        this.$delModal({
          width: '505px',
          tips: `
            <div style="font-size: 16px;color: #333333;line-height: 24px;">当前信息未保存</div>
            <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">离开页面将会丢失所有修改数据</div>
          `,
          success: () => {
            this.ifAdd = false
            this.current = item.id
            this.$refs.contentDetail.init(this.ifAdd, item.id)
          }
        })
      } else {
        this.ifAdd = false
        this.current = item.id
        this.$refs.contentDetail.init(this.ifAdd, item.id)
      }
    },
    // 点击编辑保存触发
    onHandleSave(id) {
      this.ifAdd = false
      if (id) {
        this.current = id
        this.init()
      } else {
        this.init()
      }
    },
    // 点击新增按钮触发
    onHandleAdd() {
      // 判断表单是否有改变
      if (this.$refs.contentDetail.ifChange()) {
        this.$delModal({
          width: '505px',
          tips: `
            <div style="font-size: 16px;color: #333333;line-height: 24px;">当前信息未保存</div>
            <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">离开页面将会丢失所有修改数据</div>
          `,
          success: () => {
            this.ifAdd = true
            this.current = ''
            this.$refs.contentDetail.init(this.ifAdd)
          }
        })
      } else {
        this.ifAdd = true
        this.current = ''
        this.$refs.contentDetail.init(this.ifAdd)
      }
    },
    // 点击移除触发
    onHandleRemove() {
      console.log('点击移除触发')
      this.current = ''
      this.init()
    },
    // 点击保存之前校验(校验终端是否为固定时间)
    saveBeforeFn(obj) {
      const terminalArr = []
      function pushArr(key) {
        !terminalArr.includes(key) && terminalArr.push(key)
      }
      return new Promise((resolve, reject) => {
        if (obj.longTerm === 0) {
          const TerminalObj = {
            mobileTerminal: {
              longTerm: 0, // 统计长期
              fixTime: 0 // 统计固定时间
            },
            appTerminal: {
              longTerm: 0, // 统计长期
              fixTime: 0 // 统计固定时间
            },
            douAppleTerminal: {
              longTerm: 0, // 统计长期
              fixTime: 0 // 统计固定时间
            },
            wxAppleTerminal: {
              longTerm: 0, // 统计长期
              fixTime: 0 // 统计固定时间
            }
          }
          const TerminalText = { mobileTerminal: '移动网页', appTerminal: 'APP', douAppleTerminal: '抖音小程序', wxAppleTerminal: '微信小程序' }
          const arr = JSON.parse(JSON.stringify(this.listData))
          if (!obj.id) {
            arr.push(obj)
          } else {
            const index = arr.findIndex(v => v.id === obj.id)
            arr[index] = obj
          }

          const TerminalObjArr = arr.reduce((pre, next) => {
            if (next.longTerm === 0) {
              // 固定时间
              for (const key in pre) {
                next[key] === 1 && pre[key].fixTime++
              }
            } else if (next.longTerm === 1) {
              // 长期有效
              for (const key in pre) {
                next[key] === 1 && pre[key].longTerm++
              }
            }
            return pre
          }, TerminalObj)

          for (const key in TerminalObjArr) {
            if (TerminalObjArr[key].longTerm === 0 && TerminalObjArr[key].fixTime > 0 && obj[key] === 1) {
              pushArr(TerminalText[key])
            }
          }

          if (terminalArr.length > 0) {
            this.$delModal({
              width: '505px',
              iconClassName: 'c_FF7D00',
              tips: `
                <div style="font-size: 16px;color: #333333;line-height: 24px;">显示终端（${terminalArr.join('/')}）不含长期有效的广告</div>
                <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">此广告位可能存在一段时间内无广告的情况，请及时关注广告管理！</div>
              `,
              sureBtnBgColor: '#0C6FFF',
              success: () => {
                return resolve()
              },
              fail: () => {
                return reject()
              }
            })
          } else {
            return resolve()
          }
          // return reject()
        } else {
          return resolve()
        }
      })
    },
    // 刷新列表数据
    refreshList() {
      const params = {
        id: this.$route.params.id
      }
      return adInfoList(params).then(res => {
        this.listData = res.data
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.PageWrap {
  height: calc(100vh - 190px);
  display: flex;
  flex-direction: column;
  padding: 20px 0 0;
  .adSetting {
    flex:  1 0 0;
    display: flex;
    .adSettingLeft {
      padding-left: 20px;
      width: 270px;
      border-right: 1px solid #EFF2F6;
    }
    .adSettingRight {
      flex: 1 0 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .adSettingContent {
        flex: 1 0 0;
      }
    }
  }
}
</style>

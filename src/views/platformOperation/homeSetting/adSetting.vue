<template>
  <div class="adSetting">
    <div class="adSettingLeft">
      <list
        ref="list"
        :title="title"
        :loading="loading"
        :current="current"
        :data="listData"
        :if-add="ifAdd"
        @onhandleAdd="onHandleAdd"
        @onClick="onHandleSwitch"
        @dragged="onHandleDragged"
      />
    </div>
    <div class="adSettingRight">
      <div class="adSettingContent overflowOuto">
        <contentDetail
          ref="contentDetail"
          :detail="detail"
          :if-add="ifAdd"
          :loading="loading"
          :save-before-fn="saveBeforeFn"
          :current="current"
          :current-type="currentType"
          :list-data="listData"
          @save="onHandleSave"
          @remove="onHandleRemove"
          @refreshList="refreshList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import list from './component/list.vue'
import contentDetail from './component/content.vue'
import { adInfoList } from '@/api/platform/advertising'
import eventBus from '@/utils/eventBus'
export default {
  components: {
    list,
    contentDetail
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    currentType: {
      type: String,
      default: ''
    }
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
      loading: false,
      listData: [],
      current: '' // 当前操作对象id
    }
  },
  watch: {
    currentType: {
      async handler(val) {
        try {
          console.log('type改变')
          this.current = ''
          if (val === 'navView') {
            await this.$store.dispatch('homePageSetting/get_navViewList', 2)
          } else if (val === 'banner') {
            await this.$store.dispatch('homePageSetting/get_navViewList', 1)
          }
          this.init()
        } catch (err) {
          console.log(err)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    init() {
      // this.current = ''
      console.log('初始化', '111')
      this.loading = true
      this.getDetail()
      this.refreshList()
      this.loading = false
    },
    // 获取广告位详情数据
    getDetail() {
      this.detail = {
        id: '',
        name: '',
        type: '',
        maxNum: '',
        fileFormat: [],
        fileSize: 5 * 1024,
        remark: '1、上传jpg,png图片，只能上传1张 \n 2、单张图片不能大于5M'
      }
      // const params = {
      //   id: this.$route.params.id
      // }
      // return getManagerDetail(params).then(res => {
      //   this.detail = {
      //     ...res.data
      //   }
      // })
    },
    // 获取左侧列表数据
    async getList() {
      if (this.currentType === 'banner') {
        const res = await adInfoList({ id: 23 })
        this.listData = res.data
      } else if (this.currentType === 'navView') {
        const res = await adInfoList({ id: 22 })
        this.listData = res.data
      } else {
        this.listData = []
      }
      console.log(this.listData, 'this.listData')
      this.$nextTick(() => {
        if (this.listData.length === 0) {
          this.ifAdd = true
          this.$refs.contentDetail.init(this.ifAdd)
        } else {
          console.log(this.current, 'current')
          if (!this.current) {
            this.$refs.list && this.$refs.list.onhandleClick(this.listData[0])
          } else {
            const obj = this.listData.find(v => v.id === this.current)
            obj && this.$refs.list && this.$refs.list.onhandleClick(obj)
          }
        }
      })
      // })
    },
    // 列表拖拽触发
    onHandleDragged() {
      this.refreshList()
    },
    // 列表点击切换触发
    onHandleSwitch(item) {
      console.log(item, 'item')
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
      this.refreshList()
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
          const TerminalText = {
            mobileTerminal: '移动网页',
            appTerminal: 'APP',
            douAppleTerminal: '抖音小程序',
            wxAppleTerminal: '微信小程序'
          }
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
            if (
              TerminalObjArr[key].longTerm === 0 &&
              TerminalObjArr[key].fixTime > 0 &&
              obj[key] === 1
            ) {
              pushArr(TerminalText[key])
            }
          }

          if (terminalArr.length > 0) {
            this.$delModal({
              width: '505px',
              iconClassName: 'c_FF7D00',
              tips: `
                <div style="font-size: 16px;color: #333333;line-height: 24px;">显示终端（${terminalArr.join(
    '/'
  )}）不含长期有效的设置</div>
                <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">此区域可能存在一段时间内数据的情况，请及时关注！</div>
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
    async refreshList() {
      // const params = {
      //   id: this.$route.params.id
      // }
      // return adInfoList(params).then(res => {
      //   this.listData = res.data
      // })
      console.log('刷新列表数据')
      if (this.currentType === 'navView') {
        eventBus.$emit('refreshNavView')
      } else if (this.currentType === 'banner') {
        eventBus.$emit('refreshBanner')
        // await this.$store.dispatch('homePageSetting/get_navViewList', 1)
      }
      this.getList()
      // this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.adSetting {
  flex: 1 0 0;
  display: flex;
  height: 100%;
  .adSettingLeft {
    padding-left: 20px;
    width: 268px;
    border-right: 1px solid #eff2f6;
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
</style>

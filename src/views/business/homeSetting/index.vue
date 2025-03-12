<template>
  <MCard v-loading="loading" class="page_wrap">
    <div class="haderTitle">首页配置</div>
    <div class="page_wrap_content">
      <div class="page_view">
        <homeView :current="current" :list="list" @onClick="onClick" />
        <div class="tips">此为预览效果，实际显示请在具体终端查看</div>
      </div>
      <div class="page_editComponent">
        <div class="page_editComponent_content">
          <div class="page_editComponent_content_view">
            <components :is="current.currentCompoent" ref="pageEdit" :title="current.name" :current-type="current.type" />
          </div>
        </div>
      </div>
    </div>
  </MCard>
</template>

<script>
import adSetting from './adSetting.vue'
import goodsSetting from './goodsSetting.vue'
import recommendOne from './component/recommendOne.vue'
import recommend from './component/recommend.vue'
import homeView from './homeView.vue'
import { getHomepageGrouping } from '@/api/business/homeSetting/index.js'
import axios from 'axios'
export default {
  components: {
    homeView,
    adSetting,
    goodsSetting,
    recommendOne,
    recommend
  },
  data() {
    return {
      loading: false,
      current: { name: '轮播图', currentCompoent: 'adSetting', type: 'banner', minHeight: '62px', loading: false },
      list: [
        { name: '金刚区', currentCompoent: 'adSetting', type: 'navView', minHeight: '55px', loading: false },
        { name: '我的已购', currentCompoent: '', type: 'myShoping', minHeight: '48px', loading: false },
        { name: '轮播图', currentCompoent: 'adSetting', type: 'banner', minHeight: '62px', loading: false },
        { name: '爆款推荐', currentCompoent: 'recommendOne', type: 'recommend', minHeight: '88px', loading: false },
        { name: '猜你喜欢', currentCompoent: 'recommend', type: 'like', minHeight: '100px', loading: false }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      this.getHomepageGrouping().then(async () => {
        await this.getBannerDetail()
        await this.getNavDetail()
        this.$store.dispatch('homePageSetting/getLikeList')
        console.log(this.$store)
        this.$store.commit('homePageSetting/SET_refreshActive', 1)
        this.$refs.pageEdit && this.$refs.pageEdit.init()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onClick(res) {
      if (res.type === 'myShoping') return
      if (res.currentCompoent === 'adSetting') {
        if (this.$refs.pageEdit && this.$refs.pageEdit.$refs.contentDetail && this.$refs.pageEdit.$refs.contentDetail.ifChange()) {
          this.$delModal({
            width: '505px',
            tips: `
            <div style="font-size: 16px;color: #333333;line-height: 24px;">当前信息未保存</div>
            <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">离开页面将会丢失所有修改数据</div>
          `,
            success: () => {
              this.$refs.pageEdit.$refs.contentDetail.init(true)
              this.current = res
            }
          })
        } else {
          this.current = res
        }
      } else {
        this.current = res
      }
    },
    // 获取轮播图详情
    async getBannerDetail() {
      this.list[2].loaidng = true
      await this.$store.dispatch('homePageSetting/get_navViewList', 1)
      this.list[2].loaidng = false
    },
    // 获取金刚区详情
    async getNavDetail() {
      this.list[0].loaidng = true
      await this.$store.dispatch('homePageSetting/get_navViewList', 2)
      this.list[0].loaidng = false
    },
    // 获取爆款推荐和猜你喜欢的groupId
    getHomepageGrouping() {
      return axios.all([
        getHomepageGrouping(1),
        getHomepageGrouping(2)
      ]).then(res => {
        this.$store.commit('homePageSetting/SET_groupId', { key: 'recommend', data: res[0].data.groupingId })
        this.$store.commit('homePageSetting/SET_groupId', { key: 'like', data: res[1].data.groupingId })
        this.$store.commit('homePageSetting/SET_groupId', { key: 'recommendId', data: res[0].data.id })
        this.$store.commit('homePageSetting/SET_groupId', { key: 'likeId', data: res[1].data.id })
        this.$nextTick(() => {
          return res
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0;
    height: calc(100vh - 160px);
    .haderTitle {
      height: 64px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 16px;
      color: #333333;
      line-height: 64px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      padding-left: 20px;
      border-bottom: 1px solid #EFF2F6;
    }
    .page_wrap_content {
      display: flex;
      padding: 20px;
      flex: 1 0 0;
      .page_view {
          width: 262px;
          min-width: 262px;
          max-width: 262px;
          position: relative;
          box-sizing: border-box;
          margin-right: 20px;
          .tips {
            margin-top: 20px;
            margin-left: 10px;
            color: rgb(245, 63, 63);
            font-size: 14px;
          }
      }
      .page_editComponent {
          overflow: hidden;
          flex: 1 0 0;
          display: flex;
          flex-direction: column;
          border: 1px solid #EFF2F6;
          border-radius: 4px;
          .page_editComponent_header {
              height: 50px;
              line-height: 50px;
              padding-left: 20px;
              color: #000;
              border-bottom: 1px solid #EFF2F6;
              background: #EFF2F6;
              font-weight: bolder;
          }
          .page_editComponent_content {
            flex: 1 0 0;
            // overflow: auto;
            .page_editComponent_content_view {
              height: 100%;
            }
          }
      }
    }
}
</style>

<!--
 * @Author: Aming 17666130388@163.com
 * @Date: 2023-05-23 19:09:00
 * @LastEditors: Aming 17666130388@163.com
 * @LastEditTime: 2023-05-24 15:39:06
 * @FilePath: \h5-hokd:\huoke\web-hok\src\views\live\liveVideo\components\detailsDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-loading="loading"
    title="详情"
    :visible.sync="config.visible"
    class="warpDialog"
    width="1214px"
  >
    <div class="contentWarp">
      <div id="msg" />
      <div>
        <p class="headName">{{ initData.videoName }}</p>
        <div>
          <p>视频讲师：</p>
          <p>{{ initData.teacherName }}</p>
        </div>
        <div>
          <p>视频来源：</p>
          <p>{{ $getdictName('VIDEO_SOURCE', initData.videoSource) }}</p>
        </div>
        <div>
          <p>视频时长：</p>
          <p>{{ secondIsLiveDuration(initData.duration) }}</p>
        </div>
        <div>
          <p>视频格式：</p>
          <p>{{ initData.format }}</p>
        </div>
        <div>
          <p>视频分辨率度：</p>
          <p>{{ initData.width }}*{{ initData.height }}</p>
        </div>
        <div>
          <p>转码状态：</p>
          <p>
            <AppTag v-if="initData.covertStatus === 1" bg-color="#FFF2E6">
              <template slot="icon">
                <img src="@/assets/image/time.png" alt="" srcset="" />
              </template>
              <template slot="text">
                <span style="color: #ff7d00">{{
                  $getdictName('CORERT_STATUS', initData.covertStatus)
                }}</span>
              </template>
            </AppTag>
            <AppTag v-if="initData.covertStatus === 2" bg-color="#E6F7EA">
              <template slot="icon">
                <i class="el-icon-success" style="color: #00b42a" />
              </template>
              <template slot="text">
                <span style="color: #00b42a">{{
                  $getdictName('CORERT_STATUS', initData.covertStatus)
                }}</span>
              </template>
            </AppTag>
            <AppTag v-if="initData.covertStatus === 3" bg-color="#FEECEC">
              <template slot="icon">
                <i class="el-icon-error" style="color: #f53f3f" />
              </template>
              <template slot="text">
                <span style="color: #f53f3f">{{
                  $getdictName('CORERT_STATUS', initData.covertStatus)
                }}</span>
              </template>
            </AppTag>
          </p>
        </div>
        <div class="startType">
          <p>使用状态：</p>
          <p :class="{colorRed:initData.status===2}" />
          <p>{{ $getdictName('VIDEO_TYPE_SOURCE', initData.status) }}</p>
        </div>
        <div v-if="initData.labels.length" class="tagBox">
          <p>视频标签：</p>
          <p>
            <el-tag v-for="(item, index) in initData.labels" :key="index">{{
              item.label
            }}</el-tag>
          </p>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getVideoDetail } from '@/api/liveVideo'
import AppTag from '@/components/AppTag'
import { secondIsLiveDuration } from '@/utils'
export default {
  components: {
    AppTag
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        visible: false,
        data: {}
      })
    }
  },
  data: () => ({
    secondIsLiveDuration,
    loading: false,
    visible: true,
    initData: { labels: [] }
  }),
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.getVideoDetail()
        } else {
          this.destroy()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    initVideo() {
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        this.playerSdk = new VePlayer({
          id: 'msg',
          width: 788,
          height: 591,
          lang: 'zh',
          autoplayMuted: false,
          url:
            this.initData.url,
          controls: {
            autoHide: false
          },
          autoplay: false,
          sdkErrorPlugin: {
            errorImg: false
          },
          playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
          ignores: ['sdkUnmutePlugin', 'DanmuPlugin']
        })
      })
    },
    async getVideoDetail() {
      this.loading = true
      try {
        const res = await getVideoDetail(this.config.data.id)
        console.log(res)
        if (res.code === 1) this.initData = res.data
        this.initVideo()
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    handleClose() {
      this.$emit('update:config', { ...this.config, visible: false })
    },
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.contentWarp {
  display: flex;
  > div:nth-of-type(1) {
    flex: 1;
    margin-right: 20px;
    // background: #1E1F1E;
    border-radius: 8px;
    overflow: hidden;
  }
  > div:nth-of-type(2) {
    width: 366px;
    height: 592px;
    background: #fafcff;
    border-radius: 8px;
    padding: 20px 16px;
    > .headName {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 24px;
    }
    > div {
      margin-top: 20px;
      display: flex;
      font-size: 14px;
      font-weight: 400;
      align-items: center;
      > p:nth-of-type(1) {
        color: #777777;
      }
      > p:nth-of-type(2) {
        color: #333333;
      }
    }
  }
  .startType > p:nth-of-type(3) {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    display: flex;
    align-items: center;
  }
  .startType> p:nth-of-type(2){
      padding:3px;
      background:#00B42A;
      border-radius: 50%;
      margin-right: 4px;
    }
  .colorRed{
    background:red !important;
  }
  .tagBox {
    display: flex;
    align-items: flex-start !important;
    > p:nth-of-type(1) {
      width: 70px;
    }
    > p:nth-of-type(2) {
      flex: 1;
      > .el-tag {
        margin-right: 3px;
        margin-bottom: 3px;
      }
    }
  }
}
</style>

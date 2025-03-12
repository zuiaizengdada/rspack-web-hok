<template>
  <div class="pageWrap">
    <MCard>
      <div class="headerTop">
        <span class="headerTopMainTitle" @click="gotoCloudDesktop">云桌面管理</span>
        <i class="el-icon-arrow-right headerTopIconTitle" />
        <span class="headerTopTitle">详情</span>
      </div>
      <div class="detailContent">
        <MTitle>云桌面基本信息</MTitle>
        <div class="baseInfo">
          <el-descriptions v-loading="loading" :column="3" size="medium" class="detailForm">
            <template v-for="(item) in detail">
              <template v-if="item.show">
                <el-descriptions-item :key="item.key" :span="item.span" :label="item.label" label-class-name="my-label" content-class-name="my-content">
                  <template v-if="item.key === 'ecsPassword'">
                    <watchPhoneNumber :default-value="item.value" :reg-type="1" />
                  </template>
                  <template v-else-if="item.key === 'ecsStatus'">
                    <div :class="`status${item.value}`">
                      {{ {1: '已开机', 2: '已关机', 3: '已释放'}[item.value] }}
                    </div>
                  </template>
                  <template v-else>
                    <AppIconClipboard v-if="item.copy && item.value" :src="item.render ? item.render(item.value) : item.value">
                      {{ item.render ? item.render(item.value) : item.value }}
                    </AppIconClipboard>
                    <div v-else class="detailFormValue">
                      {{ item.render ? item.render(item.value) : item.value }}
                    </div>
                  </template>
                </el-descriptions-item>
              </template>
            </template>
          </el-descriptions>
        </div>
        <userDetailList />
      </div>
    </MCard>
  </div>
</template>

<script>
import watchPhoneNumber from '@/components/watchPhoneNumber'
import AppIconClipboard from '@/components/AppIconClipboard'
import userDetailList from './userDetailList.vue'
import { getCloudPcDetailBasic } from '@/api/videoManagement/cloudDesktop'
import { parseTime } from '@/utils/index'
export default {
  components: {
    watchPhoneNumber,
    userDetailList,
    AppIconClipboard
  },
  data() {
    return {
      detail: [
        { label: '云桌面IP', value: '', show: true, span: 1, key: 'eip', copy: true },
        { label: '云桌面账号', value: '', show: true, span: 1, key: 'ecsUserName', copy: true },
        { label: '云桌面密码', value: '', show: true, span: 1, key: 'ecsPassword' },
        { label: '获课账号', value: '', show: true, span: 1, key: 'phoneNumber', copy: true },
        { label: '姓名', value: '', show: true, span: 1, key: 'nickName' },
        { label: '部门', value: '', show: true, span: 1, key: 'dept' },
        { label: '状态', value: '', show: true, span: 1, key: 'ecsStatus' },
        { label: '使用时长', value: '', show: true, span: 1, key: 'useTime' },
        { label: '使用次数', value: '', show: true, span: 1, key: 'useCount' },
        { label: '最近使用时间', value: '', show: true, span: 1, key: 'lastUseTime' },
        { label: '创建时间', value: '', show: true, span: 2, key: 'createTime' }
      ],
      detailFrom: {},
      loading: false
    }
  },
  mounted() {
    console.log(this.$route)
    this.getBaseInfo()
  },
  methods: {
    // 获取云桌面详情-基本信息
    getBaseInfo() {
      this.loading = true
      const params = {
        userEcsId: this.$route.params.id
      }
      getCloudPcDetailBasic(params).then(res => {
        console.log(res)
        this.detailFrom = res.data
        this.detail.map(v => {
          if (v.key === 'useCount') {
            v.value = res.data.useCount ? res.data.useCount : 0
          } else if (v.key === 'createTime') {
            v.value = res.data.createTime ? parseTime(new Date(res.data.createTime).getTime()) : ''
          } else if (v.key === 'lastUseTime') {
            v.value = res.data.lastUseTime ? parseTime(new Date(res.data.lastUseTime).getTime()) : ''
          } else if (v.key === 'useTime') {
            v.value = this.filterTime(res.data.useTime)
          } else {
            v.value = res.data[v.key]
          }
        })
        console.log(this.detail)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    gotoCloudDesktop() {
      this.$router.replace({ path: '/cloudDesktop' })
    },
    filterTime(value) {
      if (!value || typeof value !== 'number') {
        return '0秒'
      } else {
        const result = parseInt(value)
        const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
        const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
        const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
        return h + '时' + m + '分' + s + '秒'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  height: calc(100vh - 90px);
  min-width: 1200px;
  .headerTop {
    margin: 0 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #EFF2F6;
    .headerTopMainTitle {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #777777;
      line-height: 24px;
      cursor: pointer;
    }
    .headerTopIconTitle {
      margin-left: 8px;
      margin-right: 8px;
      color: #A9A9A9;
    }
    .headerTopTitle {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      line-height: 24px;
    }
  }
  .detailContent {
    height: calc(100% - 45px);
    padding: 20px 20px 0;
    display: flex;
    flex-direction: column;
    .baseInfo {
      margin-top: 10px;
      margin-bottom: 36px;
      .detailForm {
        padding: 16px 12px;
        background: #F7FBFF;
        border-radius: 8px;
        .status1 {
          width: 56px;
          height: 24px;
          background: #E6F7EA;
          border-radius: 12px;
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: #00B42A;
          text-align: center;
          line-height: 24px;
        }
        .status2 {
          width: 56px;
          height: 24px;
          background: #FFF2E6;
          border-radius: 12px;
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: #FF7D00;
          text-align: center;
          line-height: 24px;
        }
        .status3 {
          width: 56px;
          height: 24px;
          background: #FEECEC;
          border-radius: 12px;
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: #F53F3F;
          text-align: center;
          line-height: 24px;
        }
      }
    }
  }
}
::v-deep {
  .el-descriptions__body {
    background-color: transparent;
    .my-label {
      width: 112px;
      text-align: right;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
    }
    .my-content {
      padding-top: 1px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
      display: flex;
      flex-wrap: wrap;
    }
    .el-descriptions-item__label:not(.is-bordered-label) {
      margin-right: 8px;
    }
  }
  .el-descriptions--medium:not(.is-bordered) .el-descriptions-item__cell {
    padding-bottom: 20px;
  }
}
</style>

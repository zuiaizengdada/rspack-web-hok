<template>
  <!-- 回放设置  -->
  <div>
    <el-form
      ref="form"
      class="playback-setting-nw"
      size="small"
      :model="form"
      label-width="90px"
      label-position="left"
    >
      <el-form-item label="回放功能">
        <!--  :disabled="disabledFn" -->
        <el-switch
          :value="form.playbackSwitch"
          @click.stop.native="playbackSet('playbackSwitch', false)"
        />
        <!-- <el-link
          v-if="detail.liveModel === 'PERSON_LIVE'"
          type="danger"
          :underline="false"
          style="margin-left: 12px"
        >
          注：只有直播结束后才能开启回放。
        </el-link> -->
      </el-form-item>
      <el-form-item v-if="form.playbackSwitch" label="开放对象">
        <el-radio-group
          v-model="form.authorizedPersonnel"
          @input="playbackSet('authorizedPersonnel')"
        >
          <el-radio :label="2" :disabled="disabledFn"> 所有人员 </el-radio>
          <el-radio :label="1" :disabled="disabledFn">
            所有进过直播间的人
          </el-radio>
          <el-radio :label="3" :disabled="disabledFn">指定人员</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="form.authorizedPersonnel === 3 && form.playbackSwitch"
        prop="authorizedPersonnel"
      >
        <playbackSettingUser />
      </el-form-item>
      <el-form-item v-if="form.playbackSwitch" label="回放有效期">
        <div class="flex flex-middle">
          <el-radio-group
            v-model="form.validityType"
            @input="playbackSet('validityType')"
          >
            <el-radio :label="1" style="width: 83.86px"> 一年 </el-radio>
            <el-radio :label="2"> 限时 </el-radio>
          </el-radio-group>
          <el-date-picker
            v-model="form.expirationDate"
            type="date"
            style="margin-left: 10px; width: 250px"
            prefix-icon="el-icon-date"
            placeholder="选择日期时间"
            @change="expirationDateChange"
          />
          <span class="tips">
            到期后，学员无法观看回放内容，但仍可以进直播间查看聊天内容。
          </span>
        </div>
      </el-form-item>
    </el-form>
    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      is-left-bottom-slot
      :is-pages="isPages"
      @selection-change="handleSelectionChange"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:recordingType="{ scope }">
        <span v-if="detail.liveModel === 'PERSON_LIVE'">
          {{ $getdictName('RECORDINGTYPE', scope.row.recordingType) }}
        </span>
        <span v-else>{{
          $getdictName('VIDEO_SOURCE', scope.row.recordingType)
        }}</span>
      </template>
      <template v-slot:recordingTime="{ scope }">
        {{ filterTime(scope.row.recordingTime) }}
      </template>
      <template v-slot:transcodeStatus="{ scope }">
        <!-- 转码状态 -->
        <div class="liveType" :class="`liveType${scope.row.transcodeStatus}`">
          <div
            v-if="[0, 1, 2].includes(scope.row.transcodeStatus)"
            style="display: flex; align-items: center"
          >
            <svg-icon
              class-name="liveTypeicon"
              :icon-class="
                { 0: 'audit_wait', 1: 'audit_success', 2: 'audit_fail' }[
                  scope.row.transcodeStatus
                ]
              "
            />
            {{
              { 0: '转码中', 1: '转码成功', 2: '转码失败' }[
                scope.row.transcodeStatus
              ]
            }}
          </div>
        </div>
      </template>
      <template v-slot:recordingDuration="{ scope }">
        {{ scope.row.recordingDuration | filtersDuration }}
      </template>
      <template v-slot:codeRate="{ scope }">
        {{ scope.row.codeRate === '0' ? '——' : scope.row.codeRate || '——' }}
      </template>
      <template v-slot:frameRate="{ scope }">
        {{ scope.row.frameRate || '——' }}
      </template>

      <template v-slot:operate="{ scope }">
        <el-button type="text" @click="onhandleDown(scope.row)">下载</el-button>
        <el-button type="text" @click="onhandlePlay(scope.row)">预览</el-button>
        <el-button
          v-if="scope.row.transcodeStatus === 2"
          type="text"
          style="color: #f53f3f"
          @click="delPlaybackRecord(scope.row)"
        >
          删除
        </el-button>
      </template>
      <template #footer>
        <el-button
          v-if="detail.liveModel === 'PERSON_LIVE'"
          type="primary"
          size="small"
          @click="onhandleVideoProject"
        >
          视频处理
        </el-button>
      </template>
    </ZBTable>
  </div>
</template>

<script>
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns } from './columns'
import { videoprojectprojectProjectGenerate } from '@/api/liveRoom/index'
import {
  getDownLoadUrl,
  delPlaybackRecord,
  getPlaybackRecordDigAjax
} from '@/api/liveRoom/index.js'
import { liveOperationType } from '../../../../columns.js'
import { getFileType } from '@/utils/index.js'
import AppVideo from '@/components/AppVideo'
import moment from 'moment'
import {
  getLiveRoomInfo,
  playbackSetAjax,
  getPlaybackSetDetailAjax,
  getPlaybackRecordPage,
  playbackSet2
} from '@/api/liveRoom/index'
import playbackSettingUser from './playbackSettingUser'
import { Decrypt } from './utils/secrt.js'
export default {
  filters: {
    filtersDuration(val) {
      if (!val) {
        return ''
      }
      const result = parseInt(val)
      const h =
        Math.floor(result / 3600) < 10
          ? '0' + Math.floor(result / 3600)
          : Math.floor(result / 3600)
      const m =
        Math.floor((result / 60) % 60) < 10
          ? '0' + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60)
      return h + '时' + m + '分'
    }
  },
  components: { ZBTable, playbackSettingUser },
  data() {
    return {
      columns,
      form: {},
      orderStatusList: [
        {
          value: 1,
          label: '已跟进'
        }
      ],
      multipleSelection: [],
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      detail: {},
      loading: false,
      isPages: false
    }
  },
  computed: {
    disabledFn() {
      if (this.detail.liveModel === 'AI_LIVE') {
        return false
      }
      if (this.detail.liveModel === 'PERSON_LIVE') {
        const list = this.$refs.zbTableRef?.tableData || []
        return (
          this.detail.status === 9 &&
          list.length > 0 &&
          list[0].transcodeStatus !== 1
        )
      }
      return false
    }
  },
  mounted() {
    this.getDetail()
    this.getPlaybackSetDetail()
  },
  methods: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn()
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    getList() {
      let params = {
        liveRoomId: this.$route.params.id,
        ...this.tableConfig
      }
      console.log(this.detail, 'this.detailthis.detail')
      if (this.detail.liveModel === 'AI_LIVE') {
        const { videoId } = this.detail?.liveRoomIntelligentInfo
        params = { videoId }
      }
      console.log(params, 'paramsparamsparams')
      return new Promise((resolve, reject) => {
        const apiFn =
          this.detail.liveModel === 'PERSON_LIVE'
            ? getPlaybackRecordPage
            : getPlaybackRecordDigAjax
        apiFn(params)
          .then(res => {
            if (this.detail.liveModel === 'PERSON_LIVE') {
              res.data.items.map((v, index) => {
                v.sort =
                  (this.tableConfig.pageIndex - 1) * this.tableConfig.pageSize +
                  index
                v.downLoading = false
              })
            } else {
              res.data = [res.data]
            }
            resolve(res)
          })
          .catch(() => {
            reject()
          })
      })
    },
    //
    expirationDateChange() {
      if (this.form.validityType === 2) { this.playbackSet('expirationDate') }
    },
    // 获取回放详情
    getPlaybackSetDetail() {
      this.loading = true
      getPlaybackSetDetailAjax({ liveRoomId: this.$route.params.id })
        .then(res => {
          if (res.code === 1) {
            this.form = { ...res.data }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 设置回放
    playbackSet(type) {
      console.log(this.detail, '直播间详情')
      // if (flag && this.detail.liveModel === 'PERSON_LIVE' && this.detail.status !== 9) {
      //   return
      // }
      if (type === 'playbackSwitch') {
        this.$delModal({
          tips: `${
            !this.form.playbackSwitch
              ? '请确认是否开启回放！'
              : '请确认是否关闭回放！'
          }`,
          success: () => {
            this.loading = true
            const {
              playbackSwitch,
              authorizedPersonnel,
              validityType,
              expirationDate
            } = this.form
            const data = {
              ...(type === 'playbackSwitch' && {
                playbackSwitch: !playbackSwitch
              }),
              ...(type === 'authorizedPersonnel' && { authorizedPersonnel }),
              ...((type === 'validityType' || type === 'expirationDate') && {
                validityType
              }),
              ...((type === 'validityType' || type === 'expirationDate') &&
                validityType === 2 &&
                expirationDate && {
                expirationDateStr: moment(expirationDate).format(
                  'YYYY-MM-DD 23:59:59'
                )
              }),
              liveRoomId: this.$route.params.id
            }
            // const apiFn =
            //   this.detail.liveModel === 'PERSON_LIVE'
            //     ? playbackSetAjax
            //     : playbackSet2
            playbackSet2(data)
              .then(res => {
                if (res.code === 1) {
                  if (this.detail.feesType === 2) {
                    this.form.authorizedPersonnel = 3
                    this.playbackSet('authorizedPersonnel')
                  } else {
                    this.$message({
                      message: '设置成功',
                      type: 'success',
                      duration: 1500
                    })
                    this.loading = false
                    this.getPlaybackSetDetail()
                  }
                }
              })
              .catch(() => {
                this.loading = false
                this.getPlaybackSetDetail()
              })
          },
          fail: () => {
            // this.form.playbackSwitch = !this.form.playbackSwitch
          }
        })
      } else {
        this.loading = true
        const {
          playbackSwitch,
          authorizedPersonnel,
          validityType,
          expirationDate
        } = this.form
        const data = {
          ...(type === 'playbackSwitch' && { playbackSwitch }),
          ...(type === 'authorizedPersonnel' && { authorizedPersonnel }),
          ...((type === 'validityType' || type === 'expirationDate') && {
            validityType
          }),
          ...((type === 'validityType' || type === 'expirationDate') &&
            validityType === 2 &&
            expirationDate && {
            expirationDateStr: moment(expirationDate).format(
              'YYYY-MM-DD 23:59:59'
            )
          }),
          liveRoomId: this.$route.params.id
        }
        // const apiFn =
        //   this.detail.liveModel === 'PERSON_LIVE'
        //     ? playbackSetAjax
        //     : playbackSet2
        playbackSet2(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                message: '设置成功',
                type: 'success',
                duration: 1500
              })
            }
          })
          .finally(() => {
            this.loading = false
            this.getPlaybackSetDetail()
          })
      }
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      const params = {
        liveRoomId: this.$route.params.id
      }
      getLiveRoomInfo(params)
        .then(res => {
          this.loading = false
          this.detail = { ...res.data }
          this.isPages = this.detail.liveModel === 'PERSON_LIVE'
          this.$nextTick(() => {
            this.searchFn()
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 预览
    onhandlePlay(row) {
      if (!row.cloudUrl) {
        return this.$message.error('回放合成中，请稍后再试')
      }
      // 真人播放地址播放地址不加密  数字人直播加密（）
      const videoUrl = this.detail.liveModel === 'PERSON_LIVE' ? row.cloudUrl : Decrypt(row.cloudUrl)
      // 播放视频
      AppVideo.play({
        url: videoUrl,
        playbackRate: [1, 1.25, 1.5, 1.75, 2],
        controls: {
          autoHide: false
        }
      })
    },
    // 删除回放记录
    delPlaybackRecord(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          const data = {
            id: row.id
          }
          delPlaybackRecord(data).then(res => {
            this.$message.success('操作成功')
          })
        }
      })
    }, // 下载埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        operationType: liveOperationType.type104,
        otherInfo: params.cloudId
      }
      this.$store.dispatch('im/operationLogsWrite', data)
    },
    onhandleDown(row) {
      if (this.detail.liveModel === 'AI_LIVE') {
        if (!row.cloudUrl) {
          return this.$message.error('回放合成中，请稍后再试')
        }
        const videoUrl = Decrypt(row.cloudUrl)
        const downloadUrl =
          videoUrl +
          (videoUrl.indexOf('?') > -1 ? '&' : '?') +
          `download_name=${encodeURI(row.cloudName + '.mp4')}`
        window.open(downloadUrl)
      } else {
        if (row.id) {
          const data = {
            livePlaybackRecordId: row.id
          }
          this.operationLogsWrite(row)
          getDownLoadUrl(data)
            .then(res => {
              const downloadUrl =
                res.data +
                (res.data.indexOf('?') > -1 ? '&' : '?') +
                `download_name=${encodeURI(
                  row.cloudName + '.' + getFileType(res.data).suffix
                )}`
              window.open(downloadUrl)
            })
            .catch(() => {})
        } else {
          row.downLoading = false
        }
      }
    },
    // 点击视频处理
    onhandleVideoProject() {
      console.log('点击视频处理', this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选择先视频')
      }
      if (this.multipleSelection.length > 20) {
        return this.$message.error('所选视频数量超过上限（限20个）')
      }
      const videoIds = this.multipleSelection
        .sort((a, b) => {
          return a.sort - b.sort
        })
        .reduce((pre, next) => {
          pre.push(next.videoId)
          return pre
        }, [])
      const data = {
        videoIds: videoIds,
        projectName: this.detail.name + moment().format('YYYYMMDDHHmmss')
      }
      videoprojectprojectProjectGenerate(data)
        .then(res => {
          const { href } = this.$router.resolve({
            path: `/videoEditorLive?projectId=${res.data}`
          })
          window.open(href, '_blank')
        })
        .catch(err => {
          console.log(err)
        })
    },
    orderStatusChange(e) {
      console.log(e)
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  color: #999;
  font-size: 12px;
  font-weight: 400;
  margin-left: 10px;
}
::v-deep {
  .playback-setting-nw {
    .el-form-item {
      input {
        background: transparent;
        color: #000000;
        font-size: 14px;
        font-weight: 400;
        /* display: block; */
      }
      .el-select,
      .el-input__inner {
        /* display: block; */
        /* border: none; */
        width: 100%;
        background: transparent;
      }
      /* select 能自适应宽度 */
    }
    .el-form-item__label {
      padding-left: 0;
      color: #000000;
      font-size: 14px;
      font-weight: 400;
      font-family: 'Microsoft YaHei';
      padding-right: 10px;
    }
  }
}
.liveType {
  display: inline-block;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding: 0 8px;
  border-radius: 13px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  height: 24px;
  line-height: 24px;
  .liveTypeicon {
    width: 14px;
    height: 14px;
    font-size: 14px;
    margin-right: 4px;
  }
}
.liveType0 {
  background: #fff2e6;
  color: #ff7d00;
}
.liveType1 {
  background: #e6f7ea;
  color: #00b42a;
}
.liveType2 {
  background: #feecec;
  color: #f53f3f;
}
::v-deep .picker-s {
  width: 245px !important;
  height: 32px;
  margin-left: 40px;
  margin-right: 16px;
  border-radius: 4px;
  border: 1px solid #cbcfd3;
}
</style>
